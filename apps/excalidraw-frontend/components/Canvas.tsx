"use client";

import initDraw from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { CircleIcon, EraserIcon, PencilIcon, RectangleHorizontalIcon } from "lucide-react";
import axios from "axios";
import { FLASK_URL } from "@/config";

type Shape = "circle" | "rectangle" | "polygon" | "line" | "pencil" | "eraser";

export default function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("circle");
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]);

    const handlePromptSubmit = async () => {
        if (!prompt) return;

        try {
            const response = await axios.post(`${FLASK_URL}/draw`, { prompt });
            // const shapes = [
            //     {
            //       "type": "rect",
            //       "x": 200,
            //       "y": 200,
            //       "width": 100,
            //       "height": 50,
            //       "color": "blue",
            //       "strokeColor": "black",
            //       "strokeWidth": 2
            //     },
            //     {
            //         "type": "rect",
            //         "x": 300,
            //         "y": 300,
            //         "width": 100,
            //         "height": 50,
            //         "color": "blue",
            //         "strokeColor": "black",
            //         "strokeWidth": 2
            //       },
            //       {
            //         "type": "rect",
            //         "x": 100,
            //         "y": 100,
            //         "width": 100,
            //         "height": 50,
            //         "color": "blue",
            //         "strokeColor": "black",
            //         "strokeWidth": 2
            //       },
            //   ];
            
            const shapes = response.data;
            console.log(response);

            const event = new CustomEvent("drawGeneratedShapes", { detail: shapes });
            window.dispatchEvent(event);
        } catch (error) {
            console.error("Error fetching shapes:", error);
        }
    };

    return (
        <div className="h-full overflow-hidden">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <div className="fixed top-2 left-2 flex gap-2">
                <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt"
                    className="p-2 border border-gray-500 rounded bg-white"
                />
                <button onClick={handlePromptSubmit} className="bg-blue-500 text-white p-2 rounded">Generate</button>
            </div>
        </div>
    );
}

function Topbar({ selectedTool, setSelectedTool }: { selectedTool: Shape; setSelectedTool: (s: Shape) => void }) {
    return (
        <div className="flex gap-2">
            <IconButton activated={selectedTool === "pencil"} icon={<PencilIcon />} onClick={() => setSelectedTool("pencil")} />
            <IconButton activated={selectedTool === "eraser"} icon={<EraserIcon />} onClick={() => setSelectedTool("eraser")} />
            <IconButton activated={selectedTool === "circle"} icon={<CircleIcon />} onClick={() => setSelectedTool("circle")} />
            <IconButton activated={selectedTool === "rectangle"} icon={<RectangleHorizontalIcon />} onClick={() => setSelectedTool("rectangle")} />
        </div>
    );
}
