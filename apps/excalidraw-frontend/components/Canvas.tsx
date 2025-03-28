"use client"

import initDraw from "@/draw";
import { useEffect, useRef} from "react"

export default function Canvas({roomId , socket} : {roomId : string; socket : WebSocket;}){

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if(canvasRef.current){
            initDraw(canvasRef.current , roomId , socket);
        }
    } , [canvasRef]);

    return(
        <div className="h-full overflow-hidden">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    )
}