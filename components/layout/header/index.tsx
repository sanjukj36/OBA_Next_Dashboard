"use client";

import "./style.css";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ChatBotButton } from "@/components/chat-bot";
import { AlertIndicationBarInNavbarNew } from "@/components/dashboard/overview-black/alert-indication-bar";
import {
  NavTimeCardNew,
  TimeCard
} from "@/components/dashboard/overview-black/time-card";
import { cn } from "@/lib/utils";
import { useHeaderShowStore } from "@/store/header-show";
import { LogoutUser } from "./logout-user";
import { NavigationBar } from "./navigation-bar";
import { NavigationTitleCard } from "./navigation-title-card";
import { TagAssignToggle } from "./tag-assign-toggle";
import { VesselSelection, VesselSelectionNew } from "./vessel-selection";

type HeaderType = "sticky" | "normal" | "overlay";

type SubHeaderProps = Pick<
  HeaderProps,
  | "className"
  | "showTime"
  | "showTitle"
  | "showLogoutUser"
  | "showVesselSelection"
>;

const OverlayHeader = ({ className, ...props }: SubHeaderProps) => {
  const { show, setShow } = useHeaderShowStore(store => store);
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
          "fixed left-0 right-0 top-0 isolate z-[9999] origin-top transition-all duration-300",
          show
            ? "bottom-0 -translate-y-0 scale-y-100"
            : "bottom-full -translate-y-full scale-y-0"
        )}
      >
        <div
          onPointerDown={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <div
          className={twMerge(
            "relative isolate flex w-full transition-opacity duration-700 ease-in-out",
            className
          )}
        >
          <div className="nav-header-bg absolute inset-0 -z-10" />

          <div className="flex grow-[1] justify-start p-1">
            {props.showVesselSelection && <VesselSelection />}
            {props.showTime && <TimeCard size="sm" />}
            <TagAssignToggle />
          </div>
          <NavigationBar
            className={cn({
              "grow-[3]":
                (props.showVesselSelection || props.showTime) &&
                (props.showLogoutUser || props.showTitle)
            })}
          />
          {props.showLogoutUser && <LogoutUser />}
          {props.showTitle && (
            <div className="flex h-auto grow items-center justify-center">
              <NavigationTitleCard />
            </div>
          )}
        </div>
      </div>

      <button
        onPointerDown={() => setShow(true)}
        className={twMerge(
          "absolute left-1/2 z-[9999] flex origin-top items-center justify-center rounded-bl-[8px] rounded-br-[8px] bg-black shadow-[0px_0px_4px_2px_#777777] transition-all duration-300 lg:left-[521px] lg:top-[-6px] lg:h-[24px] lg:w-[60px] lg:rounded-[8px] xl:left-1/2 xl:top-[-6px] xl:h-[24px] xl:w-[64px] 2xl:left-1/2 3xl:left-1/2 3xl:top-[-6px] 3xl:h-[29px] 3xl:w-[80px]",
          !show
            ? "-translate-x-1/2 translate-y-0"
            : "-translate-x-1/2 -translate-y-full shadow-none"
        )}
      >
        <div className="bg-[#B9B9B9] lg:top-[7px] lg:h-[4px] lg:w-[40px] lg:rounded-[2px] xl:h-[4.44px] xl:w-[40px] xl:rounded-[2px] 3xl:h-[5px] 3xl:w-[48px] 3xl:rounded-[9px]" />
      </button>
    </React.Fragment>
  );
};

const StrickHeader = ({ className, ...props }: SubHeaderProps) => {
  return (
    <div
      className={twMerge(
        "sticky top-0 isolate z-[9999] flex w-full justify-center transition-opacity duration-700 ease-in-out",
        className
      )}
    >
      <div className="nav-header-bg absolute inset-0 -z-10" />
      <div className="flex grow-[1] justify-start p-1">
        {props.showVesselSelection && <VesselSelection />}
        {props.showTime && <TimeCard size="sm" />}
        <TagAssignToggle />
      </div>
      <NavigationBar
        className={cn({
          "grow-[3]":
            (props.showVesselSelection || props.showTime) &&
            (props.showLogoutUser || props.showTitle)
        })}
      />
      {props.showLogoutUser && <LogoutUser />}
      {props.showTitle && (
        <div className="flex grow items-center justify-center">
          <NavigationTitleCard />
        </div>
      )}
    </div>
  );
};

export function VerticalDivider({ className }: { className?: string }) {
  return (
    <div className={twMerge("my-auto h-[90%] w-[1px] rounded-full bg-[linear-gradient(180deg,_#6E6E7A_0%,_#8B8B97_17.12%,_#DADAE6_33.66%,_#F2F2FE_53.37%,_#8B8B97_75.96%,_#717483_100%)] opacity-80" , className)}/>
  );
}

const NormalHeader = ({ className }: SubHeaderProps) => {
  return (
    <div
      className={twMerge(
        "relative isolate z-[9999] flex w-full items-center gap-[29px] px-1 transition-opacity duration-700 ease-in-out lg:gap-[3px] 2xl:gap-[15px] xl:gap-[4px] 3xl:gap-[28px]",
        className
      )}
    >
      <NavTimeCardNew />
      <VerticalDivider />
      <VesselSelectionNew />
      <VerticalDivider />
      <NavigationBar className="flex-1" />
      <VerticalDivider />
      <NavigationTitleCard className="h-full px-1" />

      <VerticalDivider />
      <AlertIndicationBarInNavbarNew className="px-1" />

      <VerticalDivider />
      <div className="flex gap-0.5 2xl:gap-1">
        <ChatBotButton className="h-[30px] w-[30px] 2xl:w-[65px] 2xl:h-[65px] xl:h-[65px] xl:w-[65px] lg:w-[66px] lg:h-[66px] 3xl:h-[56px] 3xl:w-[71px]" />

        <TagAssignToggle />
      </div>
    </div>
  );
};

type HeaderProps = {
  className?: string;
  floating?: boolean;
  type?: HeaderType;
  showVesselSelection?: boolean;
  showLogoutUser?: boolean;
  showTime?: boolean;
  showTitle?: boolean;
};

const Header = ({
  className,
  type = "normal",
  showTitle = false,
  showTime = false,
  showLogoutUser = true,
  showVesselSelection = true
}: HeaderProps) => {
  if (type === "overlay") {
    return (
      <OverlayHeader
        className={className}
        {...{ showTitle, showTime, showLogoutUser, showVesselSelection }}
      />
    );
  }

  if (type === "sticky") {
    return (
      <StrickHeader
        className={className}
        {...{ showTitle, showTime, showLogoutUser, showVesselSelection }}
      />
    );
  }

  if (type === "normal") {
    return (
      <NormalHeader
        className={className}
        {...{ showTitle, showTime, showLogoutUser, showVesselSelection }}
      />
    );
  }
};

export default Header;
