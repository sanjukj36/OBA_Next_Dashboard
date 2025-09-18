import { twMerge } from "tailwind-merge";

// components/Loader.tsx
export default function Loader({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-white/70",
        className
      )}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}
