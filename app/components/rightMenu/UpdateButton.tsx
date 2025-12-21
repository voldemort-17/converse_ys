"use client"

import { useFormStatus } from "react-dom"

const UpdateButton = () => {
    const {pending} = useFormStatus();
    return (
        <button className="bg-blue-500 rounded-md font-bold p-3 mt-2 cursor-pointer disabled:bg-blue-500/50 disabled:cursor-not-allowed" disabled={pending}>{pending ? "Updating..." : "Update"}</button>
    )
}

export default UpdateButton