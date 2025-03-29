import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
    type : "rect";
    x : number;
    y : number;
    width : number;
    height : number
} | 
{
    type : "circle";
    x : number;
    y : number;
    width : number;
    height : number
}

export default async function initDraw(canvas : HTMLCanvasElement , roomId : string , socket : WebSocket){
    const ctx = canvas.getContext("2d");

    let existingShapes : Shape[] = await getExistingShapes(roomId);

    if(!ctx){
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(message.type == "chat"){
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes , canvas , ctx);
        }
    }

    clearCanvas(existingShapes , canvas , ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown" , (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener("mouseup" , (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const shape : Shape = {
            //@ts-ignore
            type : window.selectedTool,
            x : startX,
            y : startY,
            width : width,
            height : height,
        }

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type : "chat",
            message : JSON.stringify({
                shape
            }),
            roomId
        }))
    })
    
    canvas.addEventListener("mousemove" , (e) => {
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            clearCanvas(existingShapes , canvas , ctx);

            ctx.strokeStyle = "rgba(255 , 255 , 255";
            //@ts-ignore
            const selectedTool = window.selectedTool;
            if(selectedTool === "rect"){
                ctx.strokeRect(startX, startY, width, height);
            }
            else if(selectedTool === "circle"){
                ctx.beginPath();
                ctx.ellipse(
                    startX + width/2, // centerX
                    startY + height/2, // centerY
                    Math.abs(width/2), // horizontal radius
                    Math.abs(height/2), // vertical radius
                    0,0, // angles
                    2*Math.PI
                )
                ctx.stroke();
                ctx.closePath();
            }
        }
    })
}

function clearCanvas(existingShapes : Shape[] , canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D){
    ctx.clearRect(0,0 , canvas.width , canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255 , 255 , 255";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }else if(shape.type === "circle"){
            ctx.beginPath();
            ctx.ellipse(
                shape.x + shape.width/2, // centerX
                shape.y + shape.height/2, // centerY
                Math.abs(shape.width/2), // horizontal radius
                Math.abs(shape.height/2), // vertical radius
                0,0, // angles
                2*Math.PI
            )
            ctx.stroke();
            ctx.closePath();
        }

    })
}

async function getExistingShapes(roodId : string){
    const res = await axios.get(`${BACKEND_URL}/chats/${roodId}`)
    const messages = res.data.messages;

    const shapes = messages.map((x : {message : string}) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    })

    return shapes;
}