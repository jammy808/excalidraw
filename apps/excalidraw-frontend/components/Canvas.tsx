"use client"

import initDraw from "@/draw";
import { useEffect, useRef, useState} from "react"
import { IconButton } from "./IconButton";
import { Circle, CircleIcon, Pencil, PencilIcon, RectangleHorizontalIcon } from "lucide-react";

type Shape = "circle" | "rect" | "pencil";

export default function Canvas({roomId , socket} : {roomId : string; socket : WebSocket;}){

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const[selectedTool , setSelectedTool] = useState<Shape>("circle");

    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool;
    },[selectedTool]);

    useEffect(() => {

        if(canvasRef.current){
            initDraw(canvasRef.current , roomId , socket);
        }
    } , [canvasRef]);

    return(
        <div className="h-full overflow-hidden">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </div>
    )
}

function Topbar({selectedTool , setSelectedTool} : {selectedTool : Shape , setSelectedTool : (s:Shape) => void}){
    return(
        <div className="fixed top-2 left-2">
            <div className="flex gap-t">
                <IconButton 
                    activated={selectedTool === "pencil"}
                    icon={<PencilIcon />}
                    onClick={() => setSelectedTool("pencil")}
                />

                <IconButton 
                    activated={selectedTool === "circle"}
                    icon={<CircleIcon />}
                    onClick={() => setSelectedTool("circle")}
                />

                <IconButton 
                    activated={selectedTool === "rect"}
                    icon={<RectangleHorizontalIcon />}
                    onClick={() => setSelectedTool("rect")}
                />

            </div>
        </div>
    )
}