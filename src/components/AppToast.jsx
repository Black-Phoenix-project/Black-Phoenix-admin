import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AppToast({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium
        ${toast.type === "error"
          ? "bg-red-950 border-red-500/40 text-red-300"
          : "bg-zinc-900 border-emerald-500/40 text-emerald-300"
        }`}
    >
      {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {toast.msg}
    </div>
  );
}
