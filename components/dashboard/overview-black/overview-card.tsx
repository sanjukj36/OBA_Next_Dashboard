import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const OverviewCard = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "rounded-lg border border-[#A3A3A3] bg-black p-4",
        className
      )}
    >
      {children}
    </div>
  );
};
