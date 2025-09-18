"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RouteItem, routes } from "@/lib/routes";
import { useAuth } from "@/provider/auth-provider";

export const NavigationBar = ({ className }: { className?: string }) => {
  const [menuActive, setMenuActive] = useState<string | null>(null);
  return (
    <div
      className={twMerge("item-center flex justify-center ml-[-4px] xl:ml-[13px] lg:ml-[10px] 2xl:ml-[13px]", className)}
      onMouseLeave={() => setMenuActive(null)}
    >
      {routes.map(item => {
        return (
          <NavListItem
            key={item.href}
            item={item}
            menuActive={menuActive}
            setMenuActive={setMenuActive}
            innactive={item.hidden}
          />
        );
      })}
    </div>
  );
};

function NavListItem({
  item,
  menuActive,
  setMenuActive,
  innactive
}: {
  item: RouteItem;
  menuActive: string | null;
  setMenuActive: (menuActive: string | null) => void;
  innactive?: boolean;
}) {
  const pathname = usePathname();
  const Comp = item?.sub ? "div" : Link;
  const { user } = useAuth();
  if (!user?.is_superuser && item.is_superuser) {
    return null;
  }

  const isActiveMainTab =
    pathname.startsWith(item.href) ||
    item.sameRouters?.includes(pathname)

  return (
    <Comp
      prefetch={!item?.sub ? true : undefined}
      href={item.href}
      onMouseEnter={() => setMenuActive(item.label)}
      key={item.label}
      className={twMerge(
        "relative flex min-w-[75px] flex-col items-center gap-0.5 rounded-b-[4px] p-1 text-white xl:min-w-[70px] xl:rounded-b-sm 2xl:min-w-[75px] lg:min-w-[55px] 2xl:gap-1 2xl:rounded-b-lg 2xl:p-3",
        innactive && "pointer-events-none opacity-50"
      )}
    >
      {item.icon && <item.icon className="h-5 w-5 2xl:h-7 2xl:w-7" />}
      <p
        className={twMerge(
          "cursor-default text-center font-russo text-[8px] uppercase tracking-widest xl:text-[10px] 3xl:text-[14px]"
        )}
      >
        {item.label}
      </p>

      <AnimatePresence>
        {item.sub && menuActive === item.label && (
          <NavigationSubMenu item={item} />
        )}
      </AnimatePresence>

      {isActiveMainTab && (
        <motion.div
          layoutId="active"
          id="active"
          className="pointer-events-none absolute inset-0 -z-10 rounded-b-md bg-gradient-1 xl:rounded-b-lg"
        />
      )}

      {menuActive === item.label && !isActiveMainTab && (
        <motion.div
          layoutId="hover"
          id="hover"
          className="pointer-events-none absolute inset-0 -z-10 rounded-b-md border-2 border-t-0 border-[#B3B3B3] 2xl:rounded-b-lg"
        />
      )}
    </Comp>
  );
}

function NavigationSubMenu({ item }: { item: RouteItem }) {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.001, ease: "easeOut" }}
      className={twMerge(
        "absolute top-full -z-10 flex items-start rounded-md bg-gradient-2 p-1.5 2xl:rounded-lg 2xl:p-2.5",
        item.hidden && "pointer-events-none opacity-50"
      )}
    >
      {item.sub?.map(subItem => (
        <NavigationSubMenuItem key={subItem.href} subItem={subItem} />
      ))}
    </motion.ul>
  );
}

function NavigationSubMenuItem({ subItem }: { subItem: RouteItem }) {
  const pathname = usePathname();
  return (
    <li
      key={subItem.label}
      className={twMerge(
        "nav-list-item relative rounded-[calc(var(--radius)/2)] border border-transparent p-2 font-russo text-sm uppercase 3xl:p-4",
        subItem.hidden && "pointer-events-none opacity-50"
      )}
    >
      {pathname.startsWith(subItem.href) && (
        <motion.div
          layoutId="submenulist"
          id="submenulist"
          className="active absolute inset-0 -z-10 rounded-[calc(var(--radius)/2)] border border-white"
        />
      )}
      {!subItem.sub || subItem.sub?.length === 0 ? (
        <Link prefetch href={subItem.href} className="hover:text-shadow-md">
          <div className="flex items-center gap-1 xl:gap-2">
            {subItem.icon && (
              <subItem.icon className="h-3 w-3 2xl:h-5 2xl:w-5" />
            )}
            <span
              className={twMerge(
                "min-w-[11ch] text-xxs leading-none tracking-widest 2xl:text-sm",
                pathname.startsWith(subItem.href) && "text-shadow-md"
              )}
            >
              {subItem.label}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-1 text-xxs tracking-widest 2xl:gap-2">
          {subItem.icon && <subItem.icon className="h-3 w-3 2xl:h-5 2xl:w-5" />}
          <span
            className={twMerge(
              "min-w-[11ch] text-xxs leading-none tracking-widest 2xl:text-sm",
              pathname.startsWith(subItem.href) && "text-shadow-md"
            )}
          >
            {subItem.label}
          </span>
        </div>
      )}
      {subItem.sub && (
        <ul className="mt-1.5 flex w-full list-inside list-disc flex-col gap-1.5 text-nowrap pl-1 xl:pl-2 2xl:mt-3 2xl:gap-3">
          {subItem.sub.map(subSubItem => (
            <li
              key={subSubItem.label}
              className="group text-xxs leading-none tracking-[0.2em] 2xl:text-xs 2xl:leading-4 2xl:tracking-widest"
            >
              <Link prefetch href={subSubItem.href} className="relative font-extralight">
                {subSubItem.label}

                {pathname.startsWith(subSubItem.href) ? (
                  <div className="animate-underline-in absolute -bottom-0.5 left-1/2 right-1/2 h-[1px] rounded-full bg-white 2xl:-bottom-1" />
                ) : (
                  <div className="absolute -bottom-0.5 left-1/2 right-1/2 h-[1px] rounded-full bg-white transition-all duration-300 group-hover:left-0 group-hover:right-0 2xl:-bottom-1" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
