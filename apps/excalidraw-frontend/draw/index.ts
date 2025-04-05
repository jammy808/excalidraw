import { BACKEND_URL } from "@/config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type Shape = {
    type: "rectangle" | "circle" | "polygon" | "line" | "text" | "pencil";
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    points?: { x: number; y: number }[];
};

type ShapeWithId = {
    id: string;
    shape: Shape;
};

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    let existingShapes: ShapeWithId[] = await getExistingShapes(roomId);

    if (!ctx) return;

    socket.onmessage = null;

    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsed = JSON.parse(message.message);
            existingShapes.push({ id: message.chatId, shape: parsed.shape });
            drawShapes(existingShapes, canvas, ctx);
        }

        if(message.type === "re-fetch"){
            existingShapes = await getExistingShapes(roomId);
            drawShapes(existingShapes, canvas, ctx);
        }
    };

    drawShapes(existingShapes, canvas, ctx);

    window.addEventListener("drawGeneratedShapes", (e: Event) => {
        const shapes = (e as CustomEvent).detail;
        console.log("to draw ");
        console.log(shapes);

        shapes.forEach((shape: Shape) => {
            const id = uuidv4();
            existingShapes.push({ id, shape });
            drawShapes(existingShapes, canvas, ctx);

            socket.send(
                JSON.stringify({
                    chatId: id,
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId,
                })
            );
        });
    });

    let drawing = false;
    let startX = 0;
    let startY = 0;
    let pencilPath: { x: number; y: number }[] = [];

    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        startX = e.clientX;
        startY = e.clientY;
        //@ts-ignore
        const selectedTool = window.selectedTool;
        if (selectedTool == "pencil") pencilPath = [{ x: e.offsetX, y: e.offsetY }];

        if (selectedTool === "eraser") {
            const eraseX = e.offsetX;
            const eraseY = e.offsetY;

            const radius = 10;
            const isPointInside = (x: number, y: number, shape: Shape) => {
                if (shape.type === "rectangle" || shape.type === "circle" || shape.type === "line") {
                    return (
                        x >= shape.x &&
                        x <= shape.x + (shape.width || 0) &&
                        y >= shape.y &&
                        y <= shape.y + (shape.height || 0)
                    );
                } else if (shape.type === "pencil" && shape.points) {
                    return shape.points.some(
                        (point) =>
                            Math.abs(point.x - x) < radius && Math.abs(point.y - y) < radius
                    );
                } else if (shape.type === "text") {
                    return (
                        x >= shape.x &&
                        x <= shape.x + 100 &&
                        y >= shape.y - 20 &&
                        y <= shape.y + 10
                    );
                }
                return false;
            };

            const index = existingShapes.find(({ shape }) =>
                isPointInside(eraseX, eraseY, shape)
            )?.id;

            console.log("id : " + index);

            if (index !== undefined) {
                existingShapes = existingShapes.filter(({id}) => id !== index);
                drawShapes(existingShapes, canvas, ctx);

                socket.send(
                    JSON.stringify({
                        type: "erase",
                        id: index,
                        roomId,
                    })
                );
            }

            drawing = false;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            drawShapes(existingShapes, canvas, ctx);

            ctx.strokeStyle = "rgba(255 , 255 , 255";
            //@ts-ignore
            const selectedTool = window.selectedTool;
            if (selectedTool === "rectangle") {
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedTool === "circle") {
                ctx.beginPath();
                ctx.ellipse(
                    startX + width / 2,
                    startY + height / 2,
                    Math.abs(width / 2),
                    Math.abs(height / 2),
                    0, 0,
                    2 * Math.PI
                );
                ctx.stroke();
                ctx.closePath();
            } else if (selectedTool == "pencil") {
                pencilPath.push({ x: e.offsetX, y: e.offsetY });

                ctx.beginPath();
                ctx.moveTo(pencilPath[0].x, pencilPath[0].y);
                for (let i = 1; i < pencilPath.length; i++) {
                    ctx.lineTo(pencilPath[i].x, pencilPath[i].y);
                }
                ctx.stroke();
            }
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!drawing) return;
        drawing = false;

        const width = e.clientX - startX;
        const height = e.clientY - startY;

        //@ts-ignore
        const type = window.selectedTool;
        let shape: Shape;

        //@ts-ignore
        if (window.selectedTool == "pencil") {
            shape = { type, x: startX, y: startY, points: pencilPath };
        } else {
            shape = { type, x: startX, y: startY, width, height };
        }

        const id = uuidv4();
        existingShapes.push({ id, shape });
        drawShapes(existingShapes, canvas, ctx);

        console.log("sending :" + id);

        socket.send(
            JSON.stringify({
                chatId: id,
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId,
            })
        );
    });
}

function drawShapes(shapes: ShapeWithId[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(({ shape }) => {
        if (!shape) return;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";

        switch (shape.type) {
            case "rectangle":
                ctx.strokeRect(shape.x, shape.y, shape.width!, shape.height!);
                if (shape.text) {
                    ctx.font = `${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(shape.text, shape.x + shape.width! / 2, shape.y + shape.height! / 2);
                }
                break;

            case "circle":
                ctx.beginPath();
                ctx.ellipse(
                    shape.x + shape.width! / 2,
                    shape.y + shape.height! / 2,
                    Math.abs(shape.width! / 2),
                    Math.abs(shape.height! / 2),
                    0,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
                ctx.closePath();

                if (shape.text) {
                    ctx.font = `${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(shape.text, shape.x + shape.width! / 2, shape.y + shape.height! / 2);
                }
                break;

            case "polygon":
                if (shape.points) {
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
                    ctx.closePath();
                    ctx.stroke();

                    if (shape.text) {
                        const centerX = shape.points.reduce((sum, p) => sum + p.x, 0) / shape.points.length;
                        const centerY = shape.points.reduce((sum, p) => sum + p.y, 0) / shape.points.length;
                        ctx.font = `${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(shape.text, centerX, centerY);
                    }
                }
                break;

            case "line":
                ctx.beginPath();
                ctx.moveTo(shape.x, shape.y);
                ctx.lineTo(shape.x + shape.width!, shape.y + shape.height!);
                ctx.stroke();
                ctx.closePath();

                if (shape.text) {
                    const midX = shape.x + shape.width! / 2;
                    const midY = shape.y + shape.height! / 2;
                    ctx.font = `${shape.fontSize || 16}px ${shape.fontFamily || "Arial"}`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(shape.text, midX, midY - 5);
                }
                break;

            case "text":
                ctx.font = `${shape.fontSize || 20}px ${shape.fontFamily || "Arial"}`;
                ctx.fillText(shape.text || "", shape.x, shape.y);
                break;

            case "pencil":
                if (shape.points && shape.points.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    ctx.stroke();
                }
                break;

            default:
                console.warn("Unsupported shape type:", shape.type);
                break;
        }
    });
}

async function getExistingShapes(roomId: string): Promise<ShapeWithId[]> {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: { id: string; message: string }) => {
        const messageData = JSON.parse(x.message);
        return { id: x.id, shape: messageData.shape };
    });

    return shapes;
}
