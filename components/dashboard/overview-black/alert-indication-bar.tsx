import { twMerge } from "tailwind-merge";
import { AlertStatus } from "@/types/alert-statut";
import {
  AlertTableContextProvider,
  useAlertTable
} from "../alerts-list/alert-list-table-context";
import { RingBorder } from "./ring-border";

export function AlertIndicationBarInNavbarNew({
  className,
  buttonClassName
}: {
  className?: string;
  buttonClassName?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex h-full items-center gap-2.5",
        "pointer-events-none opacity-50",
        className
      )}
    >
      <AlertStatusCount
        alertStatus="critical"
        alertsCount={0}
        showTitle={false}
        buttonClassName={buttonClassName}
      />
      <AlertStatusCount
        alertStatus="important"
        alertsCount={0}
        showTitle={false}
        buttonClassName={buttonClassName}
      />
    </div>
  );
}

export function AlertIndicationBarInNavbar({
  className
}: {
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex h-full items-center gap-2.5",
        "pointer-events-none opacity-50",
        className
      )}
    >
      <AlertStatusCount
        alertStatus="critical"
        alertsCount={0}
        showTitle={false}
      />
      <AlertStatusCount
        alertStatus="important"
        alertsCount={0}
        showTitle={false}
      />
    </div>
  );
}

export function AlertIndicationBar() {
  return (
    <AlertTableContextProvider>
      <RingBorder
        className={twMerge(
          "h-auto min-h-[74px] w-full", // Base mobile size
          "sm:min-h-[80px]", // Small tablets
          "md:min-h-[85px]", // Tablets
          "lg:h-[74px] lg:w-auto", // Laptops
          "xl:min-w-auto xl:h-[85px] xl:w-auto", // Large screens
          "2xl:h-[85px] 2xl:w-full", // Extra large screens
          "3xl:h-[102px] 3xl:w-full", // Largest screens
          "pointer-events-none opacity-50"
        )}
        innerClassName={twMerge(
          "relative flex w-full items-center justify-around", // Base layout
          "gap-1 sm:gap-2 md:gap-3 lg:gap-[3px] xl:gap-2 2xl:gap-2 3xl:gap-10", // Responsive gaps
          "px-2 sm:px-4 md:px-6 lg:px-2" // Horizontal padding
        )}
      >
        <AlertStatusCount alertStatus="critical" alertsCount={0} />
        <AlertStatusCount alertStatus="important" alertsCount={0} />
        <AlertStatusCount alertStatus="normal" alertsCount={0} />
      </RingBorder>
    </AlertTableContextProvider>
  );
}

function AlertStatusCount({
  alertStatus,
  alertsCount,
  showTitle = true,
  buttonClassName
}: {
  alertStatus: AlertStatus;
  alertsCount: number;
  showTitle?: boolean;
  buttonClassName?: string;
}) {
  const alertTitle: Record<AlertStatus, string> = {
    important: "Important",
    normal: "Normal",
    critical: "Critical"
  };

  const { setAlertTabShow, setAlertType } = useAlertTable();

  const handleClick = () => {
    setAlertTabShow(true);
    setAlertType(alertStatus);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 sm:gap-2 md:gap-2.5 lg:gap-[4px] xl:gap-[6px] 2xl:gap-[7px] 3xl:gap-4"
    >
      <AlertStatusPushButtonComponent
        status={alertStatus}
        alertsCount={alertsCount}
        className={buttonClassName}
      />
      {showTitle && (
        <p className="font-russo text-[10px] uppercase sm:text-[13px] md:text-sm lg:text-[11px] xl:text-[15px] 2xl:text-[16px] 3xl:text-lg">
          {alertTitle[alertStatus]}
        </p>
      )}
    </button>
  );
}

type AlertsStatusPushButtonComponentProps = {
  status: AlertStatus;
  alertsCount: number;
  className?: string;
};
export const AlertStatusPushButtonComponent = (
  props: AlertsStatusPushButtonComponentProps
) => {
  if (!props.status) {
    throw new Error("Must provide AlertStatus");
  }
  const borderStyle: Record<AlertStatus, string> = {
    critical: "shadow-alert-critical bg-[#FF00001A] border-2 border-[#FF2525]",
    normal: "shadow-alert-normal bg-[#0B85151A] border-2 border-[#00FFAC]",
    important: "shadow-alert-important bg-[#D7AC001A] border-2 border-[#FFF90B]"
  };
  const textShadowStyle: Record<AlertStatus, string> = {
    critical: "text-shadow-critical",
    normal: "text-shadow-normal",
    important: "text-shadow-important"
  };
  const textStrokeColor: Record<AlertStatus, string> = {
    critical: "#510000",
    normal: "#000000",
    important: "#333200"
  };

  return (
    <div
      className={twMerge(
        "flex items-center justify-center rounded-full",
        "size-6", // 24px - Mobile (default)
        "xs:size-7", // 28px - ~400px+
        "sm:size-8", // 32px - 640px+
        "md:size-9", // 36px - 768px+
        "lg:size-[31px]", // 40px - 1024px+
        "xl:size-[37px]", // 44px - 1280px+
        "2xl:size-[38px]", // 48px - 1536px+
        "3xl:size-[62px]", // 64px - 1920px+
        props.className,
        borderStyle[props.status]
      )}
    >
      <p
        style={
          {
            WebkitTextStroke: `1px ${textStrokeColor[props.status]}`
          } as React.CSSProperties
        }
        className={twMerge(
          "text-center font-russo font-normal leading-[100%] tracking-normal",
          // Custom text sizes matching your design
          "text-[10px]", // Mobile (<400px)
          "xs:text-[12px]", // Small mobile
          "sm:text-[14px]", // 640px+
          "md:text-[16px]", // 768px+
          "lg:text-[13px]", // 1024px+
          "xl:text-[18px]", // 1280px+
          "2xl:text-[20px]", // 1536px+
          "3xl:text-[25px]", // 1920px+
          textShadowStyle[props.status]
        )}
      >
        {props.alertsCount}
      </p>
    </div>
  );
};
