import Image from "next/image";
import { twMerge } from "tailwind-merge";
import iconBgRing from "@/assets/bg-ring_50x50.png";
import compassBgWithRingImage from "@/assets/compass-bg-with-ring_404x404.png";
import compassOverlayShip1Image from "@/assets/compass-overlay-ship-1_320x320.png";

// import compassOverlayShip2Image from "@/assets/compass-overlay-ship-2_320x320.png";
// import compassOverlayShip3Image from "@/assets/compass-overlay-ship-3_320x320.png";
// import compassOverlayShip4Image from "@/assets/compass-overlay-ship-4_320x320.png";
// import compassOverlayShip5Image from "@/assets/compass-overlay-ship-5_320x320.png";

// TODO: Replace the compass image with actual functionalities.
export const CompassComponent = () => {
  return (
    <div className="relative grid size-[440px] grid-cols-2 grid-rows-2 px-6 py-2">
      <Image
        className="__compass-bg pointer-events-none absolute left-1/2 top-1/2 size-[404px] -translate-x-1/2 -translate-y-1/2 select-none"
        src={compassBgWithRingImage}
        alt="compass bg image with ring"
      />
      <Image
        className="__compass-bg pointer-events-none absolute left-1/2 top-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 select-none"
        src={compassOverlayShip1Image}
        alt="compass overlay ship"
      />
      <AmsIcon className="" />
      <AllTagsIcon className="justify-self-end" />
      <AlertIcon className="self-end" />
      <AiIcon className="place-self-end" />
    </div>
  );
};

function AmsIcon({ className }: { className: string }) {
  const bgClassName =
    "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]";
  return (
    <button
      className={twMerge(
        "relative grid size-[50px] place-content-center rounded-full",
        className
      )}
    >
      <div
        className={twMerge(
          "absolute inset-[3%] -z-10 rounded-full",
          bgClassName
        )}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}
      <svg
        width="26"
        height="24"
        viewBox="0 0 26 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_979_3772)">
          <path
            d="M20.488 3.00199H20.347C19.9694 3.01494 19.5515 3.08815 19.0983 3.21615C18.1919 3.47314 17.1647 3.9413 16.1124 4.50011C14.0026 5.61572 11.7921 7.08993 9.99453 7.91669C8.66523 8.53426 7.00863 8.93269 5.47287 9.28631C3.93712 9.63992 2.50459 9.95368 1.72865 10.3123C1.36964 10.4816 1.17981 10.6559 1.08867 10.8053C0.998039 10.9498 0.982933 11.0643 1.01617 11.2237C1.08263 11.5424 1.44769 11.9907 1.94719 12.3144L2.11285 12.419C10.3017 12.3044 16.6864 11.7367 21.636 9.79929C21.7418 8.92273 21.9734 8.07108 22.4669 7.38378V7.3788L22.4719 7.37382C23.7055 5.77012 22.92 3.75902 21.344 3.14593C21.0922 3.04881 20.8052 3.001 20.488 3V3.00199ZM21.5907 12.2218C19.3651 13.4719 16.3641 14.0645 13.0711 14.2737C9.61185 14.4929 5.83541 14.2787 2.31979 13.8852L2.41496 14.5825C3.98546 14.7419 7.3762 15.1702 11.1174 15.1552C15.0046 15.1403 19.1537 14.5925 21.6209 12.8543C21.6109 12.6501 21.6008 12.4409 21.5907 12.2218ZM21.9482 13.7259C19.5867 15.2947 16.2181 15.8625 12.8898 16.0069C15.1406 17.9493 17.3863 18.7511 19.2997 18.9503C21.5756 19.1894 23.4034 18.517 24.0731 17.9642C24.7277 17.4263 24.9543 16.993 24.9946 16.6593C25.0298 16.3207 24.8939 15.9969 24.5817 15.6384C24.0127 14.971 22.8949 14.3235 21.9482 13.7259Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_979_3772"
            x="-3"
            y="0"
            width="32"
            height="24"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_979_3772"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_979_3772"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </button>
  );
}

function AllTagsIcon({ className }: { className: string }) {
  const bgClassName =
    "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]";
  return (
    <button
      className={twMerge(
        "relative grid size-[50px] place-content-center rounded-full",
        className
      )}
    >
      <div
        className={twMerge(
          "absolute inset-[3%] -z-10 rounded-full",
          bgClassName
        )}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1494_3818)">
          <g filter="url(#filter0_d_1494_3818)">
            <path
              d="M21.8906 17.2344L27.2188 11.9062M15.1094 13.3594L18.9844 17.2344M5.90625 19.6562L12.2031 13.3594"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28.6719 11.9062C29.4744 11.9062 30.125 11.2557 30.125 10.4531C30.125 9.65059 29.4744 9 28.6719 9C27.8693 9 27.2188 9.65059 27.2188 10.4531C27.2188 11.2557 27.8693 11.9062 28.6719 11.9062Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.4375 20.1406C21.24 20.1406 21.8906 19.49 21.8906 18.6875C21.8906 17.885 21.24 17.2344 20.4375 17.2344C19.635 17.2344 18.9844 17.885 18.9844 18.6875C18.9844 19.49 19.635 20.1406 20.4375 20.1406Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.6562 13.3594C14.4588 13.3594 15.1094 12.7088 15.1094 11.9062C15.1094 11.1037 14.4588 10.4531 13.6562 10.4531C12.8537 10.4531 12.2031 11.1037 12.2031 11.9062C12.2031 12.7088 12.8537 13.3594 13.6562 13.3594Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.45312 22.5625C5.25566 22.5625 5.90625 21.9119 5.90625 21.1094C5.90625 20.3068 5.25566 19.6562 4.45312 19.6562C3.65059 19.6562 3 20.3068 3 21.1094C3 21.9119 3.65059 22.5625 4.45312 22.5625Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_1494_3818"
            x="-1.75"
            y="4.25"
            width="36.625"
            height="23.0625"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1494_3818"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1494_3818"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_1494_3818">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

function AlertIcon({ className }: { className: string }) {
  const bgClassName =
    "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]";
  return (
    <button
      className={twMerge(
        "relative grid size-[50px] place-content-center rounded-full",
        className
      )}
    >
      <div
        className={twMerge(
          "absolute inset-[3%] -z-10 rounded-full",
          bgClassName
        )}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}

      <svg
        width="37"
        height="35"
        viewBox="0 0 37 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_979_3757)">
          <path
            d="M18.2833 23.5192C18.7139 23.5192 19.0751 23.3733 19.3669 23.0815C19.6587 22.7897 19.8041 22.429 19.803 21.9995C19.802 21.5699 19.6561 21.2092 19.3654 20.9174C19.0746 20.6256 18.7139 20.4797 18.2833 20.4797C17.8527 20.4797 17.492 20.6256 17.2013 20.9174C16.9105 21.2092 16.7646 21.5699 16.7636 21.9995C16.7626 22.429 16.9085 22.7902 17.2013 23.083C17.4941 23.3758 17.8547 23.5212 18.2833 23.5192ZM16.7636 17.4402H19.803V8.32183H16.7636V17.4402ZM18.2833 31.1179C16.181 31.1179 14.2053 30.7187 12.3563 29.9203C10.5073 29.122 8.89893 28.0394 7.53117 26.6727C6.16341 25.3059 5.08085 23.6975 4.28349 21.8475C3.48614 19.9975 3.08695 18.0218 3.08594 15.9205C3.08493 13.8192 3.48411 11.8436 4.28349 9.99354C5.08287 8.14351 6.16543 6.53512 7.53117 5.16838C8.89691 3.80163 10.5053 2.71907 12.3563 1.9207C14.2074 1.12233 16.183 0.723145 18.2833 0.723145C20.3836 0.723145 22.3592 1.12233 24.2103 1.9207C26.0613 2.71907 27.6697 3.80163 29.0354 5.16838C30.4012 6.53512 31.4842 8.14351 32.2846 9.99354C33.085 11.8436 33.4837 13.8192 33.4807 15.9205C33.4776 18.0218 33.0784 19.9975 32.2831 21.8475C31.4878 23.6975 30.4052 25.3059 29.0354 26.6727C27.6657 28.0394 26.0573 29.1225 24.2103 29.9218C22.3633 30.7212 20.3876 31.1199 18.2833 31.1179ZM18.2833 28.0784C21.6774 28.0784 24.5522 26.9006 26.9078 24.545C29.2634 22.1894 30.4412 19.3146 30.4412 15.9205C30.4412 12.5264 29.2634 9.6516 26.9078 7.29601C24.5522 4.94041 21.6774 3.76262 18.2833 3.76262C14.8892 3.76262 12.0144 4.94041 9.6588 7.29601C7.30321 9.6516 6.12541 12.5264 6.12541 15.9205C6.12541 19.3146 7.30321 22.1894 9.6588 24.545C12.0144 26.9006 14.8892 28.0784 18.2833 28.0784Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_979_3757"
            x="-0.914062"
            y="0.723145"
            width="38.3984"
            height="38.3945"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_979_3757"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_979_3757"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </button>
  );
}

function AiIcon({ className }: { className: string }) {
  const bgClassName =
    "bg-[linear-gradient(221.99deg,_#004558_-0.91%,_#00AFEA_49.47%,_#00BBFF_99.85%)]";
  return (
    <button
      className={twMerge(
        "relative grid size-[50px] place-content-center rounded-full",
        className
      )}
    >
      <div
        className={twMerge(
          "absolute inset-[3%] -z-10 rounded-full",
          bgClassName
        )}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}
      <span className="font-din text-[25px] text-white text-shadow-custom-black">
        AI
      </span>
    </button>
  );
}
