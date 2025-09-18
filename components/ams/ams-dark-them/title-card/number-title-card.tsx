"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-provider";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { TagAssignComponent } from "@/components/tag-assign";

interface NumberTitleProps {
  title: number;
  queryparams: string;
  label: string;
}

function NumberTitleCard({ title, queryparams, label }: NumberTitleProps) {
  const router = useRouter()
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.set("dg", queryparams);

  const { data: latestData, isError } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  const { user } = useAuth();

  if (!user?.is_superuser && (isError || !description)) {
    return null;
  }


  const href = `${pathname}?${currentParams.toString()}`;

  const isActive =
    searchParams.get("dg") === queryparams ||
    (!searchParams.get("dg") && queryparams === "dg-1");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if(pathname === href) return;

    startTransition(() => {
      router.push(href);
    })
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "relative h-[35px] w-[49px] select-none rounded-lg border border-zinc-500 bg-zinc-950 px-[6px] py-1.5 xl:h-[47px] xl:w-[63px] 3xl:h-[33px] 3xl:w-[89px] 3xl:px-[20px]",
        {
          "shadow-[0px_0px_4px_1px_rgba(255,255,255,1.00)]": isActive,
          "bg-zinc-800 opacity-50": !isActive,
          "opacity-80 !cursor-progress": isPending
        }
      )}
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h3
            className="whitespace-nowrap font-russo text-[20px] font-medium text-white 3xl:text-[30px]"
          >
            {title}
          </h3>
        </div>
      </div>
      <TagAssignComponent type="single" tag={label} />
    </a>
  );
}

export default NumberTitleCard;
