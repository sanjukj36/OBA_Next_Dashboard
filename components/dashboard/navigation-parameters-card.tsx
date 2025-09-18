import { ValueBoxComponent } from "./value-box";

export const NavigationParametersDataCardList = () => {
  return (
    <div className="relative flex h-[288px] w-[446px] flex-col gap-3 p-4">
      <CardListBg />
      <div className="grid h-full w-full grid-cols-3 place-content-center gap-4">
        <NavigationParameterItem />
        <NavigationParameterItem />
        <NavigationParameterItem />
        <NavigationParameterItem />
        <NavigationParameterItem />
        <NavigationParameterItem />
      </div>
    </div>
  );
};

function NavigationParameterItem() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-russo text-base">LAT</p>
      <ValueBoxComponent value={9.97} />
    </div>
  );
}

function CardListBg() {
  return (
    <svg
      width="100%"
      viewBox="0 0 448 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 -z-10"
    >
      <rect
        x="1"
        y="1"
        width="446"
        height="288"
        rx="10"
        fill="url(#paint0_linear_1481_3556)"
        stroke="black"
        strokeWidth="2"
      />
      <circle cx="17.5" cy="15.5" r="7.5" fill="#020204" />
      <circle
        cx="17.5"
        cy="15.5"
        r="5.5"
        fill="url(#paint1_linear_1481_3556)"
      />
      <path
        d="M19 11H17C17 14 14.3333 14.5 13 14.5V16C16 15.5 17 17.5 17 19.5H19C19 16.5 21.3333 16.3333 22.5 16.5V15C19.3 15 18.8333 12.3333 19 11Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="17.5" cy="277.5" r="7.5" fill="#020204" />
      <circle
        cx="17.5"
        cy="277.5"
        r="5.5"
        fill="url(#paint2_linear_1481_3556)"
      />
      <path
        d="M19 273H17C17 276 14.3333 276.5 13 276.5V278C16 277.5 17 279.5 17 281.5H19C19 278.5 21.3333 278.333 22.5 278.5V277C19.3 277 18.8333 274.333 19 273Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="430.5" cy="15.5" r="7.5" fill="#020204" />
      <circle
        cx="430.5"
        cy="15.5"
        r="5.5"
        fill="url(#paint3_linear_1481_3556)"
      />
      <path
        d="M432 11H430C430 14 427.333 14.5 426 14.5V16C429 15.5 430 17.5 430 19.5H432C432 16.5 434.333 16.3333 435.5 16.5V15C432.3 15 431.833 12.3333 432 11Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <circle cx="435.5" cy="276.5" r="7.5" fill="#020204" />
      <circle
        cx="435.5"
        cy="276.5"
        r="5.5"
        fill="url(#paint4_linear_1481_3556)"
      />
      <path
        d="M437 272H435C435 275 432.333 275.5 431 275.5V277C434 276.5 435 278.5 435 280.5H437C437 277.5 439.333 277.333 440.5 277.5V276C437.3 276 436.833 273.333 437 272Z"
        fill="black"
        stroke="black"
        strokeWidth="0.2"
      />
      <path
        d="M423.849 7.75C423.591 8.02569 423.356 8.32877 423.142 8.64941C422.317 9.88431 421.753 11.4643 421.446 13.0762C421.139 14.6912 421.082 16.3869 421.309 17.874C421.517 19.2451 421.985 20.5463 422.83 21.3984L423.004 21.5625C425.201 23.5009 427.202 24.4971 429.035 24.8271C430.877 25.1587 432.48 24.8052 433.848 24.167C435.201 23.5354 436.331 22.6218 437.243 21.834C437.622 21.5069 437.947 21.2188 438.25 20.96V266.681C435.899 265.565 433.179 265.83 430.898 266.715C429.548 267.239 428.31 267.993 427.331 268.859C426.422 269.664 425.694 270.603 425.346 271.587L425.281 271.784C424.489 274.426 424.609 276.834 425.217 278.732C425.528 279.704 425.976 280.562 426.509 281.25H26.4512C27.2367 277.835 27.2434 275.982 26.7744 274.575C26.522 273.818 26.143 273.229 25.7793 272.664C25.412 272.094 25.0371 271.515 24.6895 270.704L24.6123 270.524L24.457 270.405L24.1357 270.165C20.823 267.75 17.7844 267.588 15.3516 268.411C13.8762 268.91 12.6546 269.761 11.7451 270.631L11.2529 23.585C12.7773 24.6847 14.3237 25.2715 15.8281 25.4561C17.7441 25.6911 19.5379 25.2694 21.0664 24.5127C22.5911 23.7578 23.8693 22.662 24.7715 21.5127C25.631 20.4177 26.2126 19.188 26.2461 18.0977C26.8766 15.5218 26.7538 13.4553 26.127 11.7832C25.4939 10.0947 24.3766 8.88256 23.1641 7.98145C22.1585 7.23413 21.0706 6.69098 20.1211 6.26074L423.849 7.75Z"
        stroke="black"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1481_3556"
          x1="224"
          y1="1"
          x2="224"
          y2="289"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#232323" />
          <stop offset="1" stopColor="#070707" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1481_3556"
          x1="6.5"
          y1="-0.5"
          x2="21.1667"
          y2="19.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1481_3556"
          x1="6.5"
          y1="261.5"
          x2="21.1667"
          y2="281.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1481_3556"
          x1="419.5"
          y1="-0.5"
          x2="434.167"
          y2="19.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1481_3556"
          x1="424.5"
          y1="260.5"
          x2="439.167"
          y2="280.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.206731" stopColor="#D5D5D5" />
          <stop offset="1" stopColor="#020204" />
        </linearGradient>
      </defs>
    </svg>
  );
}
