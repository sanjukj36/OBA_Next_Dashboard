import React from "react";
import Image from "next/image";
import loadPercentageBgImage from "@/assets/ams/load-persentage-title-bg.png";
import { CanvasRadialGaugeChart } from "../chart/canvas-radial-gauge-chart";

export const RadialGaugeCard = () => {
  return (
    <div className="relative flex w-[195px] flex-col items-center justify-center gap-4">
      <CanvasRadialGaugeChart value={61} size={135} />
      <LoadPersentageTitleCard title="ME LOAD %" />
      <CardListBg />
    </div>
  );
};

function CardListBg() {
  return (
    <svg
      width="100%"
      viewBox="0 0 197 293"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -z-10"
    >
      <rect
        width="195"
        height="291"
        rx="10"
        transform="matrix( 0 0 1 196 1)"
        fill="url(#paint0_linear_1481_3478)"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="15.5" cy="18.5" r="7.5" fill="#020204" />
      <circle
        cx="15.5"
        cy="18.5"
        r="5.5"
        fill="url(#paint1_linear_1481_3478)"
      />
      <path
        d="M17 14H15C15 17 12.3333 17.5 11 17.5V19C14 18.5 15 20.5 15 22.5H17C17 19.5 19.3333 19.3333 20.5 19.5V18C17.3 18 16.8333 15.3333 17 14Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="15.5" cy="278.5" r="7.5" fill="#020204" />
      <circle
        cx="15.5"
        cy="278.5"
        r="5.5"
        fill="url(#paint2_linear_1481_3478)"
      />
      <path
        d="M17 274H15C15 277 12.3333 277.5 11 277.5V279C14 278.5 15 280.5 15 282.5H17C17 279.5 19.3333 279.333 20.5 279.5V278C17.3 278 16.8333 275.333 17 274Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="177.5" cy="18.5" r="7.5" fill="#020204" />
      <circle
        cx="177.5"
        cy="18.5"
        r="5.5"
        fill="url(#paint3_linear_1481_3478)"
      />
      <path
        d="M179 14H177C177 17 174.333 17.5 173 17.5V19C176 18.5 177 20.5 177 22.5H179C179 19.5 181.333 19.3333 182.5 19.5V18C179.3 18 178.833 15.3333 179 14Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="177.5" cy="278.5" r="7.5" fill="#020204" />
      <circle
        cx="177.5"
        cy="278.5"
        r="5.5"
        fill="url(#paint4_linear_1481_3478)"
      />
      <path
        d="M179 274H177C177 277 174.333 277.5 173 277.5V279C176 278.5 177 280.5 177 282.5H179C179 279.5 181.333 279.333 182.5 279.5V278C179.3 278 178.833 275.333 179 274Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <path
        d="M172.955 9.83789C171.948 10.4076 170.966 11.142 170.141 12.0674C168.13 14.3211 167.105 17.614 168.642 22.0576L168.798 22.4912C169.674 24.8165 171.153 26.2964 172.936 27.1152C174.697 27.9243 176.7 28.0633 178.618 27.8281C180.54 27.5925 182.424 26.9757 183.992 26.2197C184.834 25.8139 185.604 25.3546 186.25 24.8789V270.187C185.627 269.688 184.893 269.24 184.095 268.861C182.567 268.137 180.739 267.634 178.858 267.52C175.205 267.298 171.254 268.555 169.037 272.622L168.828 273.024C167.59 275.528 167.18 277.659 167.326 279.477C167.473 281.299 168.174 282.745 169.057 283.881C169.852 284.904 170.794 285.674 171.605 286.25H22.2646C22.3234 286.206 22.3823 286.161 22.4395 286.115C23.6958 285.103 24.5456 283.726 25.0801 282.256C26.132 279.363 26.0175 275.956 25.2178 273.781C24.074 270.025 20.1483 268.653 16.7666 268.434C15.0413 268.322 13.3503 268.497 12.0312 268.86C11.5649 268.989 11.1302 269.145 10.75 269.329V27.0195C13.6735 28.516 16.8122 28.3849 19.4111 27.3105C22.3333 26.1025 24.6748 23.6559 25.2354 20.8574L25.2471 20.7988L25.249 20.7393C25.4997 14.1539 24.4217 11.3067 22.8955 9.99219C22.8321 9.9376 22.7679 9.88646 22.7041 9.83789H172.955Z"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1481_3478"
          x1="97.5"
          y1="0"
          x2="97.5"
          y2="291"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#232323" />
          <stop offset="1" stopColor="#070707" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1481_3478"
          x1="4.5"
          y1="2.5"
          x2="19.1667"
          y2="22.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1481_3478"
          x1="4.5"
          y1="262.5"
          x2="19.1667"
          y2="282.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1481_3478"
          x1="166.5"
          y1="2.5"
          x2="181.167"
          y2="22.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1481_3478"
          x1="166.5"
          y1="262.5"
          x2="181.167"
          y2="282.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LoadPersentageTitleCard({ title }: { title: string }) {
  return (
    <div className="relative h-[46.6px] w-[144px] select-none">
      <Image
        src={loadPercentageBgImage}
        alt={`${title} Background`}
        fill
        className="over"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-left">
          <h1 className="whitespace-nowrap font-russo text-xl font-medium text-white">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
