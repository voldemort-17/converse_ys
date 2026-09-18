"use client";

import { useFormStatus } from "react-dom";

export default function UpdateButton() {
  const { pending } = useFormStatus();
  return <button className="primary-button" disabled={pending}>{pending ? "Saving..." : "Save changes"}</button>;
}
