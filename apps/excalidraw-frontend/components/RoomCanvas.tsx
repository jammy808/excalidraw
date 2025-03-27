"use client"

import { WS_URL } from "@/config";
import { useEffect, useState } from "react"
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){

    const[socket , setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMWNkMzc0My1kMWZjLTQ3YmEtYmQ5ZC0zN2QwNDBhMzM1NGIiLCJpYXQiOjE3NDMwODY2MDl9.xBaP2JYLzdQlWeN2kN3oOFmBhW0v_ft6x06CFuBCyMc`);

        ws.onopen = () =>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type : "join_room",
                roomId
            }))
        }

    },[])

    if(!socket){
        return <div>Connecting to server..</div>
    }

    return <Canvas roomId={roomId} socket={socket}/>
}