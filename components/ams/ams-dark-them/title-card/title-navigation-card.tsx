"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TitleCardProps {
  title: string;
  href: string;
  disable?: boolean;
}

function TitleNavigationCard({ title, href, disable }: TitleCardProps) {
  const router = useRouter()
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition()

  const activePageName = pathname.toLowerCase().startsWith(href.toLowerCase());

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (disable || pathname === href) return;

    startTransition(() => {
      router.push(href);
    })
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "relative h-[17px] w-[96px] rounded-md border border-stone-300 bg-zinc-950 xl:h-[21px] xl:w-[121px] 3xl:h-[32px] 3xl:w-44",
        {
          "shadow-[0px_0px_4px_1px_rgba(255,255,255,1.00)]": activePageName,
          "bg-zinc-800 opacity-50": !activePageName,
          "pointer-events-none opacity-50": disable,
          "opacity-80 !cursor-progress": isPending
        }
      )}
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h1 className="whitespace-nowrap font-alexandria text-[7px] font-medium text-input xl:text-[10px] 3xl:text-[15px]">
            {title}
          </h1>
        </div>
      </div>
    </a>
  );
}

export default TitleNavigationCard;
