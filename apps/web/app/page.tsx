"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home() {

  const [roomId , setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div>
        <input type="text" placeholder="Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value)}/>

        <button onClick={() => router.push(`/room/${roomId}`)} >Join Room</button>
      </div>
    </div>
  );
}
