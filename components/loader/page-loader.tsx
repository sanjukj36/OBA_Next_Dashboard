"use client";

import { twMerge } from "tailwind-merge";

export default function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "flex w-full flex-1 items-center justify-center bg-black/30 text-7xl font-bold tracking-widest text-gray-400",
        className
      )}
    >
      Loading...
    </div>
  );
}
