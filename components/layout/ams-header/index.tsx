"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RingBorder } from "@/components/dashboard/overview-black/ring-border";
import { amsRoutes, RouteItem } from "@/lib/routes";
import { useAmsHeaderShowStore } from "@/store/ams-header";
import { LogoutUser } from "../header/logout-user";

type AmsNavigationItem = RouteItem & {
  setSub1?: Dispatch<SetStateAction<RouteItem[] | null>>;
};

const AmsNavigationItem = ({
  setSub1,
  sub,
  href,
  label,
  ...props
}: AmsNavigationItem) => {
  const isSub = !!sub && sub.length > 0;
  const Comp = isSub ? "div" : Link;
  const pathname = usePathname();

  useEffect(() => {
    const active = pathname.startsWith(href);
    if (active) {
      if (sub && setSub1) {
        setSub1(sub);
      } else {
        setSub1?.(null);
      }
    }
  }, [pathname, href, sub, setSub1]);

  const active = pathname.startsWith(href);

  return (
    <Comp
      href={href}
      prefetch={true}
      className={twMerge(
        "flex cursor-pointer items-center gap-2 2xl:gap-2.5",
        props.hidden && "pointer-events-none opacity-50"
      )}
      onPointerDown={e => {
        if (isSub) {
          e.preventDefault();
          setSub1?.(sub);
        }
      }}
    >
      {props?.icon && <props.icon className="size-[14px] 2xl:size-[20px]" />}
      <div className="relative flex-1">
        <p className="min-w-max font-alexandria text-[12px] uppercase leading-[100%] 2xl:text-[20px]">
          {label}
        </p>
        <div
          className={twMerge(
            "absolute -bottom-2 h-[1px] rounded-full bg-white transition-all duration-300",
            active ? "left-0 right-0" : "left-0 right-full"
          )}
        />
      </div>
    </Comp>
  );
};

const AmsNavigationBar = () => {
  const [sub, setSub] = useState<RouteItem[] | null>(null);

  return (
    <div className="pointer-events-auto mt-auto flex flex-col-reverse gap-1 p-2">
      <RingBorder
        className="h-[60px] 2xl:h-[90px]"
        innerClassName="flex items-center justify-center px-6"
      >
        <div className="flex w-full items-center justify-center gap-4 overflow-x-auto py-2 2xl:gap-16">
          {amsRoutes.map(
            item =>
              !item.hidden && (
                <AmsNavigationItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  sub={item.sub}
                  setSub1={setSub}
                  hidden={item.disable}
                />
              )
          )}
        </div>
      </RingBorder>

      {/* sub-menu */}
      {
        <RingBorder
          className={twMerge(
            "ml-auto h-[90px] w-min origin-right transition-all duration-300",
            sub && sub.length > 0 ? "scale-x-100" : "scale-x-0"
          )}
          innerClassName="flex items-center justify-center px-6"
        >
          <div className="flex w-full items-center justify-center gap-16 overflow-x-auto py-2">
            {sub &&
              sub.length > 0 &&
              sub.map(item => (
                <AmsNavigationItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  sub={item.sub}
                  hidden={item.hidden}
                />
              ))}
          </div>
        </RingBorder>
      }
    </div>
  );
};

const AmsTopBarSection = () => {
  return (
    <div className="pointer-events-auto flex w-full p-4">
      <LogoutUser className="ml-auto" />
    </div>
  );
};

const AmsHeader = () => {
  const { show, setShow } = useAmsHeaderShowStore(store => store);
  const pathname = usePathname();

  useEffect(() => {
    setShow(false);
  }, [pathname, setShow]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <React.Fragment>
      <div
        className={twMerge(
          "fixed bottom-0 left-0 right-0 isolate z-[9999] origin-bottom transition-all duration-300",
          show
            ? "top-0 translate-y-0 scale-y-100"
            : "top-full translate-y-full scale-y-0"
        )}
      >
        <div
          onPointerDown={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <div
          className={twMerge(
            "pointer-events-none relative isolate flex h-full w-full flex-col transition-opacity duration-700 ease-in-out"
          )}
        >
          <AmsTopBarSection />
          <AmsNavigationBar />
        </div>
      </div>
      <button
        onPointerDown={() => setShow(true)}
        className={twMerge(
          "fixed bottom-0 left-1/2 z-[9999] flex h-[22px] w-[74px] origin-bottom items-center justify-center rounded-tl-[8px] rounded-tr-[8px] bg-black shadow-[0px_0px_4px_2px_#777777] transition-all duration-300",
          !show
            ? "-translate-x-1/2 translate-y-0"
            : "-translate-x-1/2 translate-y-full shadow-none"
        )}
      >
        <div className="h-[5px] w-[48px] rounded-[9px] bg-[#B9B9B9]" />
      </button>
    </React.Fragment>
  );
};

export default AmsHeader;
