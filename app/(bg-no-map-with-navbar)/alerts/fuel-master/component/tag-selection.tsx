"use client"

import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ACTIVE_TAB_LAYOUT_ID = "tab-active-background";

export function AlertTabSelection() {
  return (
    <ButtonWrapper className="flex gap-4 items-center ">
      <TabSelectionButton href="/alerts/fuel-master/realtime">Realtime</TabSelectionButton>
      <TabSelectionButton href="/alerts/fuel-master/historical">Historic</TabSelectionButton>
    </ButtonWrapper>
  );
};

type ButtonWrapperProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<T>;
export function ButtonWrapper<T extends React.ElementType = "div">({ as, children, className, ...props }: ButtonWrapperProps<T>) {
  const Component = as || "div" as React.ElementType
  return (
    <Component
      className={twMerge("rounded-[10px] border border-[#626262]  p-1 h-[40px] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)]", className)}
      {...props}
    >
      {children}
    </Component>
  )
}

type TabSelectionButtonProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
}
function TabSelectionButton({ className, children, href }: TabSelectionButtonProps) {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const isActive = pathname === href;

  const handleClick = () => {
    const params = searchParams.toString();
    const fullHref = params ? `${href}?${params}` : href
    router.push(fullHref);
  }

  return (
    <button
      onClick={handleClick}
      className={twMerge("relative flex rounded-[7px] h-[29px] items-center justify-center font-alexandria text-[20px] font-medium text-white px-5 py-1 tracking-[0%] leading-[100%]",
        isActive ? "text-white" : "text-white/70",
        className,
      )}
    >
      {isActive && (
        <motion.div
          layoutId={ACTIVE_TAB_LAYOUT_ID}
          className="absolute inset-0 rounded-[7px] border border-[#626262] z-0 font-alexandria"
          style={{
            background:
              "linear-gradient(180deg, #070707 0%, #101010 100%)",
          }}
          transition={{
            type: "spring",
            bounce: 0.05,
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}


