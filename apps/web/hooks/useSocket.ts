import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export default function useSocket(){
    const[loading , setLoading ] = useState(true);
    const[socket , setSocket ] = useState<WebSocket>();

    useEffect(() => {
        //this is done temporaily fix with auth
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMWNkMzc0My1kMWZjLTQ3YmEtYmQ5ZC0zN2QwNDBhMzM1NGIiLCJpYXQiOjE3NDI4NDEzNDB9.FP1Rnuf6PQBMAocPme-j_evLz-VdCEA3llUUjo4SmMI`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    } , []);

    return {socket , loading};
}