import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
} : {
    icon : ReactNode,
    onClick : () => void,
    activated : boolean
}) {
    return(
        <div className={`m-2 pointer rounded-full p-2 hover:bg-zinc-300 hover:text-black ${activated ? "text-black bg-zinc-300" : "text-white bg-zinc-700"}`}
        onClick={onClick}>
            {icon}
        </div>
    )
}