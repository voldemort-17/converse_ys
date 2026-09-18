"use client";

import { SendHorizontal } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function AddPostButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button className="primary-button h-11 px-4" disabled={pending || disabled}>{pending ? "Posting…" : <><SendHorizontal size={18} /> Post</>}</button>;
}
