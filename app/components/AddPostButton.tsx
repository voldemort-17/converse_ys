"use client"

import { Send, SendHorizonalIcon } from "lucide-react";
import { useFormStatus } from "react-dom"

const AddPostButton = () => {
    const { pending } = useFormStatus();
    return (
        <button className="cursor-pointer disabled:cursor-not-allowed" disabled={pending}>{pending ? "Sending": <SendHorizonalIcon />}</button>
    )
}

export default AddPostButton