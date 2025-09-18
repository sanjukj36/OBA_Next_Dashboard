import Image from "next/image";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import { cn } from "@/lib/utils";

type StatusPushButtonComponentProps = {
  active?: boolean;
};

export const StatusPushButton = (props: StatusPushButtonComponentProps) => {
  const activeClassName =
    "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)] shadow-sky";

  const inactiveClassName =
    "bg-[linear-gradient(221.99deg,_#2B2B2B_8.23%,_#808080_96.83%)] shadow-red";

  return (
    <div className="relative isolate size-[31px] rounded-full">
      <Image
        src={ringBgImage}
        alt="bg ring Image"
        className="pointer-events-none h-full w-full select-none"
      />
      <div
        style={{ filter: "blur(4px)" }}
        className={cn(
          "absolute inset-[8%] -z-10 rounded-full",
          props.active ? activeClassName : inactiveClassName
        )}
      />
    </div>
  );
};
