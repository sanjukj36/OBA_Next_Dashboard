import Image from "next/image";
import ringBgImage from "@/assets/bg-ring_62x62.png";
import { cn } from "@/lib/utils";

type StatusPushButtonComponentProps = {
  active?: boolean;
};

export const AlertStatusButton = (props: StatusPushButtonComponentProps) => {
  const activeClassName =
    "bg-[linear-gradient(221.99deg,_#006E21_12.23%,_#1CAA00_99.83%)]";

  const inactiveClassName =
    "bg-[linear-gradient(221.99deg,_#5F0000_8.23%,_#C50000_96.83%)]";

  return (
    <div className="relative isolate size-[21px] rounded-full">
      <Image
        src={ringBgImage}
        alt="bg ring Image"
        className="pointer-events-none h-full w-full select-none"
      />
      <div
        className={cn(
          "absolute inset-[8%] -z-10 rounded-full",
          props.active ? activeClassName : inactiveClassName
        )}
      />
    </div>
  );
};
