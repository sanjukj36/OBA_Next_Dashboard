import React from "react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AudioIconProps extends React.SVGAttributes<SVGElement> {
  size?: IconSize | number;
}

export const AudioIcon = ({ size = "md", ...props }: AudioIconProps) => {
  const sizeMap: Record<IconSize, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32
  };

  const iconSize = typeof size === "string" ? sizeMap[size] : size;

  return (
    <svg
      {...props}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M21.3125 7.5625C21.3125 4.90463 19.1579 2.75 16.5 2.75C13.8421 2.75 11.6875 4.90463 11.6875 7.5625V16.5C11.6875 19.1579 13.8421 21.3125 16.5 21.3125C19.1579 21.3125 21.3125 19.1579 21.3125 16.5V7.5625Z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 17C6 22.6953 10.6172 27.3125 16.3125 27.3125M16.3125 27.3125C22.0078 27.3125 26.625 22.6953 26.625 17M16.3125 27.3125V31.4375"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
