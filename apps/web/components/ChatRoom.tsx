import axios from "axios";
import { BACKEND_URL } from "../app/config";

async function getChats(roomId : string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return res.data.messages
}

export default async function ChatRoom({id} : {id : string}) {
    const messages = await getChats(id);
}