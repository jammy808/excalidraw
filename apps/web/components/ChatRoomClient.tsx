"use client"

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({messages , id} : {messages : {message : string}[] ; id : string}) {
    
    const[chats , setChats] = useState(messages);
    const[currMessage , setCurrMessage] = useState("");
    const{socket , loading} = useSocket();

    useEffect(() => {
        if(socket && !loading){

            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id
            }))

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                
                if(parsedData.type === "chat"){
                    setChats(c => [...c , {message : parsedData.message} ]);
                }
            }
        }

    } , [socket , loading , id]);


    return (
        <div>
            {chats.map((m,idx) => <div key={idx}>{m.message}</div>)}

            <input type="text" placeholder="type here" value={currMessage} onChange={(e) => {setCurrMessage(e.target.value)}} />

            <button onClick={() => {
                socket?.send(JSON.stringify({
                    type : "chat",
                    message : currMessage,
                    roomId : id
                }))
                setCurrMessage("");
            }}
            > Send </button>
        </div>
    )
}