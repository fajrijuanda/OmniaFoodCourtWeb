"use client";

import { cx } from "./utils";

export function FeedbackAlert({ message, successText = "berhasil", className = "" }: { message: string; successText?: string; className?: string }) {
  const isSuccess = message.toLowerCase().includes(successText.toLowerCase());
  return (
    <div className={cx(
      "rounded-[14px] border px-4 py-3 text-sm font-bold",
      isSuccess ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700",
      className
    )}>
      {message}
    </div>
  );
}
