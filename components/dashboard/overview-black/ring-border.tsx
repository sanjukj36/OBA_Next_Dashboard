import React, { CSSProperties, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function RingBorder({
  children,
  className,
  innerClassName,
  secondClassName,
  variant = "outline",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  secondClassName?: string;
  innerClassName?: string;
  variant?: "outline" | "value-card" | "outline-sm" | "value-card-destructive" | "dg-value-card";
}) {
  if (variant === "dg-value-card") {
    return (
      <div
        style={{ "--border": "2px"} as CSSProperties}
        className={twMerge(
          "flex rounded-[20px] bg-black p-0.5 gradient-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (variant === "outline") {
    return (
      <div
        className={twMerge(
          "flex rounded-[20px] bg-linear-black-overview-card p-0.5",
          className
        )}
        {...props}
      >
        <div
          className={twMerge(
            "flex h-full w-full rounded-[18px] bg-black p-2",
            secondClassName
          )}
        >
          <div
            className={twMerge(
              "flex-1 border border-white/50 bg-transparent",
              "rounded-[12px] 3xl:rounded-[20px]",
              innerClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "value-card") {
    return (
      <div
        className={twMerge(
          "flex rounded-[10px] bg-[#1A1A1A] p-[5px] font-din",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full rounded-[5px] bg-linear-black-overview-card p-0.5">
          <div className="flex h-full w-full rounded-[3px] bg-[#1A1A1A] p-1">
            <div className={twMerge("h-full w-full bg-black", innerClassName)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "value-card-destructive") {
    return (
      <div
        className={twMerge(
          "flex rounded-[10px] bg-[#1A1A1A] p-[5px] font-din",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full rounded-[5px] bg-destructive p-0.5">
          <div className="flex h-full w-full rounded-[3px] bg-[#1A1A1A] p-1">
            <div className={twMerge("h-full w-full bg-black", innerClassName)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "outline-sm") {
    return (
      <div
        className={twMerge(
          "flex rounded-[10px] bg-[linear-gradient(270deg,_#3D3D3D_23.56%,_#FFFFFF_50%,_#4B4B4B_89.42%)] p-[1px] font-alexandria shadow-[0px_0px_6.3px_0.5px_#E8E8E8]",
          className
        )}
        {...props}
      >
        <div
          className={twMerge(
            "flex h-full w-full items-center justify-center rounded-[9px] bg-black p-1 text-[15px] uppercase leading-[100%] tracking-[0%]",
            innerClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}
