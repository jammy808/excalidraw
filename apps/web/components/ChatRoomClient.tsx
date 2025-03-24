"use client"

import useSocket from "../hooks/useSocket";

export default async function ChatRoomClient({messages , id} : {messages : {message : string}[] ; id : string}) {
    
    const{socket , loading} = useSocket();
}