import React from "react";
import Image from "next/image";
import flowmeterDataKgHrBg from "@/assets/ams/flowmeter-data-item-bg.png";
import { ValueBoxComponent } from "./value-box";

export const FlowmeterDataCard = () => {
  return (
    <div className="relative flex h-[283px] w-[640px] flex-col gap-3 p-4">
      <CardListBg />
      <div className="h-full w-full px-2">
        <div className="flex gap-3">
          <div className="flex h-full flex-col gap-2">
            <ValueBoxComponent value={89} unit="deg C" />
            <ValueBoxComponent value={89} unit="deg C" />
            <ValueBoxComponent value={89} unit="deg C" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <h3 className="font-russo text-2xl uppercase">FLOWMETER DATA</h3>
            <div className="flex flex-1 flex-col gap-3">
              <FlowmeterDataTitleCard />
              <FlowmeterDataTitleCard />
              <FlowmeterDataTitleCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function FlowmeterDataTitleCard() {
  return (
    <div className="relative h-[63px] w-[494.75px] px-9 py-4">
      <Image
        src={flowmeterDataKgHrBg}
        alt={`Background`}
        fill
        className="absolute inset-0 -z-10 h-full w-full"
        priority
      />

      <div className="flex min-w-[207px] items-center gap-1 font-russo text-2xl text-shadow-custom-black-rgba">
        <p className="min-w-[2ch]">ME</p>
        <span className="">:</span>
        <p className="mr-auto">1623</p>
        <p>kg/hr</p>
      </div>
    </div>
  );
}

function CardListBg() {
  return (
    <svg
      width="100%"
      viewBox="0 0 642 285"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 -z-10"
    >
      <rect
        x="1"
        y="1"
        width="640"
        height="283"
        rx="10"
        fill="url(#paint0_linear_1481_3636)"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="12.6836" cy="13.6836" r="5.68359" fill="#020204" />
      <circle
        cx="12.6836"
        cy="13.6836"
        r="4.16797"
        fill="url(#paint1_linear_1481_3636)"
      />
      <path
        d="M13.8203 10.2734H12.3047C12.3047 12.5469 10.2839 12.9258 9.27344 12.9258V14.0625C11.5469 13.6836 12.3047 15.1992 12.3047 16.7148H13.8203C13.8203 14.4414 15.5885 14.3151 16.4727 14.4414V13.3047C14.0477 13.3047 13.694 11.2839 13.8203 10.2734Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="12.6836" cy="268.684" r="5.68359" fill="#020204" />
      <circle
        cx="12.6836"
        cy="268.684"
        r="4.16797"
        fill="url(#paint2_linear_1481_3636)"
      />
      <path
        d="M13.8203 265.273H12.3047C12.3047 267.547 10.2839 267.926 9.27344 267.926V269.062C11.5469 268.684 12.3047 270.199 12.3047 271.715H13.8203C13.8203 269.441 15.5885 269.315 16.4727 269.441V268.305C14.0477 268.305 13.694 266.284 13.8203 265.273Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="629.684" cy="268.684" r="5.68359" fill="#020204" />
      <circle
        cx="629.684"
        cy="268.684"
        r="4.16797"
        fill="url(#paint3_linear_1481_3636)"
      />
      <path
        d="M630.82 265.273H629.305C629.305 267.547 627.284 267.926 626.273 267.926V269.062C628.547 268.684 629.305 270.199 629.305 271.715H630.82C630.82 269.441 632.589 269.315 633.473 269.441V268.305C631.048 268.305 630.694 266.284 630.82 265.273Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="629.684" cy="14.6836" r="5.68359" fill="#020204" />
      <circle
        cx="629.684"
        cy="14.6836"
        r="4.16797"
        fill="url(#paint4_linear_1481_3636)"
      />
      <path
        d="M630.82 11.2734H629.305C629.305 13.5469 627.284 13.9258 626.273 13.9258V15.0625C628.547 14.6836 629.305 16.1992 629.305 17.7148H630.82C630.82 15.4414 632.589 15.3151 633.473 15.4414V14.3047C631.048 14.3047 630.694 12.2839 630.82 11.2734Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <path
        d="M623.753 275.945C623.008 275.232 622.449 274.382 622.042 273.479C621.074 271.326 620.964 268.879 621.105 267.201L621.112 267.125L621.13 267.05C621.615 265.042 622.511 263.523 623.681 262.418C624.846 261.317 626.237 260.672 627.65 260.333C629.861 259.803 632.186 260.008 634 260.439V22.7637C631.02 23.9829 628.487 23.7715 626.481 22.834C624.211 21.7725 622.749 19.8429 622.081 18.374L622.073 18.3564L622.065 18.3369C620.518 14.5364 621.144 11.4656 622.648 9.20605C623.224 8.34114 623.922 7.60854 624.653 7H19.0137C20.9682 8.42114 22.0203 10.2394 22.4326 12.1611C23.0532 15.0537 22.1864 17.9884 21.2275 19.8066L21.1611 19.9326L21.0615 20.0352L20.7754 20.3242C17.8096 23.242 14.7745 23.9313 12.1357 23.4521C10.5266 23.1599 9.11848 22.4432 8.00391 21.6221L8.44141 261.139C12.0343 259.666 14.9192 259.67 17.1299 260.454C19.6036 261.332 21.0921 263.138 21.709 264.597L21.708 264.598C23.0722 267.638 22.7817 270.484 21.8721 272.772C21.3849 273.998 20.7177 275.07 20.0264 275.945H623.753Z"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1481_3636"
          x1="321"
          y1="1"
          x2="321"
          y2="284"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#232323" />
          <stop offset="1" stopColor="#070707" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1481_3636"
          x1="4.34766"
          y1="1.55859"
          x2="15.4622"
          y2="16.8096"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1481_3636"
          x1="4.34766"
          y1="256.559"
          x2="15.4622"
          y2="271.81"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1481_3636"
          x1="621.348"
          y1="256.559"
          x2="632.462"
          y2="271.81"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1481_3636"
          x1="621.348"
          y1="2.55859"
          x2="632.462"
          y2="17.8096"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
      </defs>
    </svg>
  );
}
