import { GaugeCard } from "./gauge-card";

export const GaugeCardList = () => {
  return (
    <div className="relative isolate flex justify-around gap-6 p-4">
      <GaugeCard />
      <GaugeCard />
      <GaugeCard />
      <GaugeCardListBg />
    </div>
  );
};

function GaugeCardListBg() {
  return (
    <svg
      className="absolute inset-0 -z-10"
      width="100%"
      viewBox="0 0 727 313"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="725"
        height="311"
        rx="10"
        fill="url(#paint0_linear_1527_3152)"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="17.5" cy="16.5" r="7.5" fill="#020204" />
      <circle
        cx="17.5"
        cy="16.5"
        r="5.5"
        fill="url(#paint1_linear_1527_3152)"
      />
      <path
        d="M19 12H17C17 15 14.3333 15.5 13 15.5V17C16 16.5 17 18.5 17 20.5H19C19 17.5 21.3333 17.3333 22.5 17.5V16C19.3 16 18.8333 13.3333 19 12Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="17.5" cy="293.5" r="7.5" fill="#020204" />
      <circle
        cx="17.5"
        cy="293.5"
        r="5.5"
        fill="url(#paint2_linear_1527_3152)"
      />
      <path
        d="M19 289H17C17 292 14.3333 292.5 13 292.5V294C16 293.5 17 295.5 17 297.5H19C19 294.5 21.3333 294.333 22.5 294.5V293C19.3 293 18.8333 290.333 19 289Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="710.5" cy="16.5" r="7.5" fill="#020204" />
      <circle
        cx="710.5"
        cy="16.5"
        r="5.5"
        fill="url(#paint3_linear_1527_3152)"
      />
      <path
        d="M712 12H710C710 15 707.333 15.5 706 15.5V17C709 16.5 710 18.5 710 20.5H712C712 17.5 714.333 17.3333 715.5 17.5V16C712.3 16 711.833 13.3333 712 12Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="710.5" cy="293.5" r="7.5" fill="#020204" />
      <circle
        cx="710.5"
        cy="293.5"
        r="5.5"
        fill="url(#paint4_linear_1527_3152)"
      />
      <path
        d="M712 289H710C710 292 707.333 292.5 706 292.5V294C709 293.5 710 295.5 710 297.5H712C712 294.5 714.333 294.333 715.5 294.5V293C712.3 293 711.833 290.333 712 289Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <path
        d="M703.606 9C702.703 9.79222 702.032 10.7569 701.551 11.792C700.469 14.1178 700.346 16.7677 700.504 18.5869L700.511 18.666L700.53 18.7422C701.635 23.1605 704.591 25.2355 707.774 25.9736C710.296 26.5583 712.956 26.3123 715 25.8223V284.428C711.605 283.035 708.741 283.258 706.488 284.276C703.972 285.414 702.341 287.487 701.595 289.074L701.586 289.093L701.578 289.112C699.846 293.226 700.55 296.544 702.227 298.979C702.916 299.981 703.761 300.818 704.642 301.5H23.2051C25.5187 299.95 26.7514 297.933 27.2266 295.792C27.9207 292.664 26.9501 289.487 25.8779 287.521L25.8086 287.395L25.707 287.293L25.3867 286.98C22.0763 283.832 18.7108 283.105 15.8018 283.615C13.9158 283.946 12.2754 284.788 11.0039 285.735L11.4971 25.0332C15.595 26.696 18.8583 26.696 21.3369 25.8457C24.0623 24.9107 25.7123 22.9881 26.4053 21.4209L26.4062 21.4219C27.9446 18.1254 27.6196 15.0382 26.5996 12.5566C26.03 11.171 25.2425 9.96688 24.4336 9H703.606Z"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1527_3152"
          x1="363.5"
          y1="1"
          x2="363.5"
          y2="312"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#232323" />
          <stop offset="1" stopColor="#070707" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1527_3152"
          x1="6.5"
          y1="0.5"
          x2="21.1667"
          y2="20.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1527_3152"
          x1="6.5"
          y1="277.5"
          x2="21.1667"
          y2="297.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1527_3152"
          x1="699.5"
          y1="0.5"
          x2="714.167"
          y2="20.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1527_3152"
          x1="699.5"
          y1="277.5"
          x2="714.167"
          y2="297.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
      </defs>
    </svg>
  );
}
