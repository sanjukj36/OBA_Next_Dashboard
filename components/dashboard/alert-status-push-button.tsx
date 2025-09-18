import Image from "next/image";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import { cn } from "@/lib/utils";
import { AlertStatus } from "@/types/alert-statut";

type AlertsStatusPushButtonComponentProps = {
  status: AlertStatus;
  alertsCount: number;
};

export const AlertStatusPushButtonComponent = (
  props: AlertsStatusPushButtonComponentProps
) => {
  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case "critical":
        return "bg-[linear-gradient(221.99deg,_#5F0000_-12.23%,_#C50000_99.85%)]";
      case "important":
        return "bg-[linear-gradient(221.99deg,_#AE7602_-12.23%,_#CEA400_99.85%)]";
      case "normal":
        return "bg-[linear-gradient(221.99deg,_#006E21_-12.23%,_#1CAA00_99.85%)]";
      default:
        return "bg-[linear-gradient(221.99deg,_#2B2B2B_8.23%,_#808080_96.83%)]";
    }
  };

  const statusColor = getStatusColor(props.status);

  return (
    <div className="relative isolate flex size-[62px] items-center justify-center rounded-full shadow-md shadow-black">
      <Image
        src={ringBgImage}
        alt="bg ring Image"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
      <div
        style={{
          filter: "blur(4px)"
        }}
        className={cn("absolute inset-[8%] -z-10 rounded-full", statusColor)}
      />
      <p className="text-center font-russo text-xl font-normal leading-[100%] tracking-normal text-shadow-custom-black-rgba">
        {props.alertsCount}
      </p>
    </div>
  );
};
