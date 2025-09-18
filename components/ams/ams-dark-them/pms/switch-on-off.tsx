import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

type SwitchOnOffProps = {
  className?: string;
  switchState?: boolean;
  dimensions?: "horizontal" | "vertical";
};

export default function SwitchOnOff({
  className = "",
  switchState,
  dimensions
}: SwitchOnOffProps) {
  const [internalSwitch] = useState(true);
  const [internalDimensions] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const isControlledSwitch = switchState !== undefined;
  const isControlledDimensions = dimensions !== undefined;

  const currentSwitchState = isControlledSwitch ? switchState : internalSwitch;
  const currentDimensions = isControlledDimensions
    ? dimensions
    : internalDimensions;

  const baseClasses = twMerge("transition-transform duration-300", className);
  const rotationClass = currentDimensions === "vertical" ? "rotate-90" : "";

  return (
    <div>
      {currentSwitchState ? (
        <SwitchOnSVG className={twMerge(baseClasses, rotationClass)} />
      ) : (
        <SwitchOffSVG className={twMerge(baseClasses, rotationClass)} />
      )}
    </div>
  );
}

const SwitchOnSVG = ({ className = "", style = {} }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_2766_18965)">
      <rect
        x={33}
        y={5}
        width={28}
        height={28}
        rx={3}
        transform="rotate(90 33 5)"
        fill="url(#paint0_radial_2766_18965)"
        stroke="#006B00"
        strokeWidth={2}
      />
      <rect
        x={30}
        y={17}
        width={4}
        height={22}
        rx={2}
        transform="rotate(90 30 17)"
        fill="#D9D9D9"
      />
      <circle cx={8} cy={19} r={3} transform="rotate(90 8 19)" fill="#006B00" />
      <circle
        cx={30}
        cy={19}
        r={3}
        transform="rotate(90 30 19)"
        fill="#006B00"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_2766_18965"
        x={0}
        y={0}
        width={38}
        height={38}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2766_18965"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2766_18965"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_2766_18965"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(49 19) rotate(90) scale(15)"
      >
        <stop stopColor="#007600" />
        <stop offset={1} />
      </radialGradient>
    </defs>
  </svg>
);

const SwitchOffSVG = ({ className = "", style = {} }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_2766_18007)">
      <rect
        x={3}
        y={31}
        width={28}
        height={28}
        rx={3}
        transform="rotate(-90 3 31)"
        fill="url(#paint0_radial_2766_18007)"
        stroke="#5B5B5B"
        strokeWidth={2}
      />
      <rect
        x={6.4375}
        y={19}
        width={3.64182}
        height={21.7738}
        rx={1.82091}
        transform="rotate(-113.279 6.4375 19)"
        fill="#D9D9D9"
      />
      <circle
        cx={28}
        cy={17}
        r={3}
        transform="rotate(-90 28 17)"
        fill="#5B5B5B"
      />
      <circle
        cx={6}
        cy={17}
        r={3}
        transform="rotate(-90 6 17)"
        fill="#5B5B5B"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_2766_18007"
        x={0}
        y={0}
        width={34}
        height={34}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2766_18007"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2766_18007"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_2766_18007"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(17 47) rotate(90) scale(15)"
      >
        <stop stopColor="#5B5B5B" />
        <stop offset={1} />
      </radialGradient>
    </defs>
  </svg>
);
