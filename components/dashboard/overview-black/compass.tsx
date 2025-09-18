import Image from "next/image";
import { twMerge } from "tailwind-merge";
import iconBgRing from "@/assets/bg-ring_50x50.png";
import compassOverlayShip1Image from "@/assets/compass-overlay-ship-1_320x320.png";
import { TagAssignComponent } from "@/components/tag-assign";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";
import { useChatBotStore } from "@/store/chat-bot-store";
import { ErrorComponent } from "./error-display";

// import compassOverlayShip2Image from "@/assets/compass-overlay-ship-2_320x320.png";
// import compassOverlayShip3Image from "@/assets/compass-overlay-ship-3_320x320.png";
// import compassOverlayShip4Image from "@/assets/compass-overlay-ship-4_320x320.png";
// import compassOverlayShip5Image from "@/assets/compass-overlay-ship-5_320x320.png";

export const CompassComponent = ({ label }: { label: string }) => {
  const { data: latestData, error, refetch } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];

  return (
    <div className="relative mx-auto grid aspect-square grid-cols-2 grid-rows-2 lg:left-0 lg:mt-[19px] lg:w-[min(100%,590px)] lg:px-[6px] lg:py-[6px] lg:pt-[15px] xl:mt-[23px] xl:w-[min(96%,690px)] xl:px-0 2xl:mt-[31px] 3xl:mt-0 3xl:w-[min(100%,790px)] 3xl:px-6 3xl:py-2">
      <div className="absolute inset-[10%] grid place-items-center">
        <CompassLines
          heading={data?.value ?? 180}
          className="relative col-start-1 col-end-2 row-start-1 row-end-2 aspect-square h-full"
        />
        <div className="relative col-start-1 col-end-2 row-start-1 row-end-2 size-[78%]">
          <Image
            className="__compass-bg pointer-events-none w-full select-none"
            src={compassOverlayShip1Image}
            alt="compass overlay ship"
          />
        </div>
      </div>
      {/* <AlertIcon className="" /> */}
      {/* <AiIcon className="justify-self-end" /> */}
      <AmsIcon className="self-end" hidden />
      <AllTagsIcon className="place-self-end" hidden />

      {error && <ErrorComponent key={label} error={error.message} refetch={refetch} />}
      <TagAssignComponent type="single" tag={label} />
    </div>
  );
};

const bgClassName =
  "bg-[linear-gradient(206.84deg,_#555555_-28.07%,_#8C8C8C_109.3%)]";

type IconProps = {
  className: string;
  hidden?: boolean;
};
function AmsIcon({ className, hidden }: IconProps) {
  return (
    <button
      className={twMerge(
        "relative grid place-content-center rounded-full lg:size-[34.32px] 3xl:size-[50px]",
        hidden ? "pointer-events-none opacity-0" : "grid",
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

function AllTagsIcon({ className, hidden }: IconProps) {
  return (
    <button
      className={twMerge(
        "relative place-content-center rounded-full lg:size-[34.32px] 3xl:size-[50px]",
        hidden ? "pointer-events-none opacity-0" : "grid",
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

function AlertIcon({ className, hidden }: IconProps) {
  return (
    <button
      className={twMerge(
        "relative grid place-content-center rounded-full lg:size-[34.32px] 3xl:size-[50px]",
        hidden ? "pointer-events-none opacity-0" : "grid",
        className
      )}
    >
      <div
        className={twMerge("absolute inset-0 -z-10 rounded-full", bgClassName)}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}
      <svg
        className="w-[25px] lg:h-[25px] lg:w-[25px] xl:h-[25px] xl:w-[25px] 3xl:h-[35px] 3xl:w-[37px]"
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

function AiIcon({ className, hidden }: IconProps) {
  const { setOpen } = useChatBotStore();
  return (
    <button
      onClick={() => setOpen(true)}
      className={twMerge(
        "relative grid place-content-center rounded-full lg:size-[34.32px] 3xl:size-[50px]",
        hidden ? "pointer-events-none opacity-0" : "grid",
        className
      )}
    >
      <div
        className={twMerge(
          "absolute -z-10 lg:inset-0 lg:size-[34.32px] lg:rounded-full xl:inset-0 xl:size-[34.32px] xl:rounded-full 3xl:inset-0 3xl:size-[50px] 3xl:rounded-full",
          bgClassName
        )}
      />
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        src={iconBgRing}
        alt="bg ring image"
      />
      {/* Content */}
      <svg width="41" height="41" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="3xl:w-[41px] 3xl:h-[41px] 2xl:w-[30px] 2xl:h-[30px] xl:w-[30px] xl:h-[30px] lg:w-[30px] lg:h-[30px]">
        <g filter="url(#filter0_d_4596_14628)">
          <path d="M15.9971 3.5C22.3397 3.5 27.5264 8.39116 27.5264 14.4775C27.5262 20.5637 22.3395 25.4541 15.9971 25.4541C9.65473 25.454 4.46896 20.5637 4.46875 14.4775C4.46875 8.39125 9.6546 3.50014 15.9971 3.5Z" stroke="white" />
          <mask id="path-2-inside-1_4596_14628" fill="white">
            <path d="M3 11.7204C3 10.5022 3.98753 9.51465 5.20572 9.51465V19.4404C3.98753 19.4404 3 18.4528 3 17.2347V11.7204Z" />
          </mask>
          <path d="M2 11.7204C2 9.9499 3.43525 8.51465 5.20572 8.51465V10.5146C4.53982 10.5146 4 11.0545 4 11.7204H2ZM5.20572 20.4404C3.43525 20.4404 2 19.0051 2 17.2347H4C4 17.9006 4.53982 18.4404 5.20572 18.4404V20.4404ZM5.20572 20.4404C3.43525 20.4404 2 19.0051 2 17.2347V11.7204C2 9.9499 3.43525 8.51465 5.20572 8.51465V10.5146C4.53982 10.5146 4 11.0545 4 11.7204V17.2347C4 17.9006 4.53982 18.4404 5.20572 18.4404V20.4404ZM5.20572 9.51465V19.4404V9.51465Z" fill="white" mask="url(#path-2-inside-1_4596_14628)" />
          <mask id="path-4-inside-2_4596_14628" fill="white">
            <path d="M29 11.7204C29 10.5022 28.0125 9.51465 26.7943 9.51465V19.4404C28.0125 19.4404 29 18.4528 29 17.2347V11.7204Z" />
          </mask>
          <path d="M30 11.7204C30 9.9499 28.5648 8.51465 26.7943 8.51465V10.5146C27.4602 10.5146 28 11.0545 28 11.7204H30ZM26.7943 20.4404C28.5648 20.4404 30 19.0051 30 17.2347H28C28 17.9006 27.4602 18.4404 26.7943 18.4404V20.4404ZM26.7943 20.4404C28.5648 20.4404 30 19.0051 30 17.2347V11.7204C30 9.9499 28.5648 8.51465 26.7943 8.51465V10.5146C27.4602 10.5146 28 11.0545 28 11.7204V17.2347C28 17.9006 27.4602 18.4404 26.7943 18.4404V20.4404ZM26.7943 9.51465V19.4404V9.51465Z" fill="white" mask="url(#path-4-inside-2_4596_14628)" />
          <circle cx="20.4088" cy="12.8229" r="1.70572" fill="white" stroke="white" />
          <path d="M13.6441 17.9197C13.3087 18.017 13.1712 18.4104 13.4419 18.6312C13.646 18.7977 13.8866 18.9443 14.157 19.0656C14.6806 19.3004 15.294 19.4306 15.9249 19.4406C16.5558 19.4506 17.1778 19.3402 17.7176 19.1223C17.9998 19.0084 18.2533 18.8676 18.4709 18.7053C18.7497 18.4973 18.631 18.0989 18.3006 17.9903C18.0914 17.9215 17.8654 18.0005 17.696 18.1411C17.5379 18.2724 17.3459 18.3849 17.1278 18.4729C16.7738 18.6159 16.3658 18.6883 15.9521 18.6817C15.5383 18.6751 15.136 18.5898 14.7926 18.4358C14.5893 18.3446 14.4116 18.2315 14.2663 18.102C14.0955 17.9498 13.8639 17.856 13.6441 17.9197Z" fill="white" />
          <circle cx="11.5885" cy="12.8229" r="1.70572" fill="white" stroke="white" />
        </g>
        <defs>
          <filter id="filter0_d_4596_14628" x="0" y="0" width="32" height="28.9541" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4596_14628" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4596_14628" result="shape" />
          </filter>
        </defs>
      </svg>

    </button>
  );
}

function CompassLines({
  className,
  heading
}: {
  className: string;
  heading: number;
}) {
  const rotationAngle = !isNaN(Math.abs(180 - heading))
    ? Math.abs(180 - heading)
    : 0;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 396 396"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("", className)}
      style={{
        transform: `rotate(${rotationAngle}deg)`
      }}
    >
      <g filter="url(#filter0_d_77_120)">
        <ellipse
          cx="197.722"
          cy="199.5"
          rx="190.722"
          ry="192.5"
          fill="url(#paint0_radial_77_120)"
          strokeWidth="1"
          stroke="white"
        />
      </g>
      <g filter="url(#filter1_d_77_120)">
        <path
          d="M198 27.889C292.578 27.889 369.25 104.361 369.25 198.695C369.25 293.029 292.578 369.5 198 369.5C103.422 369.5 26.75 293.029 26.75 198.695C26.7501 104.361 103.422 27.889 198 27.889Z"
          stroke="white"
          strokeWidth="1"
        />
      </g>
      <path d="M319.236 317.7L312.252 311.407" stroke="white" strokeWidth="2" />
      <path
        d="M262.991 356.453L258.371 346.498"
        stroke="white"
        strokeWidth="2"
      />
      <line
        y1="-1"
        x2="4.49852"
        y2="-1"
        transform="matrix(-0.924231 -0.381835 0.383534 -0.923527 356.708 260.224)"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M356.367 261.046L348.508 257.767"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M358.51 196.782L368.864 196.838"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M345.151 135.041L354.757 131.114"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M310.862 83.9635L317.994 77.4194"
        stroke="white"
        strokeWidth="2"
      />
      <path d="M77.0207 317.7L84.2501 310.525" stroke="white" strokeWidth="2" />
      <path
        d="M133.127 355.568L136.801 345.609"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M39.8963 261.048L49.0736 257.669"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M37.9412 196.834L27.6433 196.838"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M49.0669 135.964L40.2829 132.37"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M85.1443 84.4423L78.2733 77.4225"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M263.555 41.1232L260.09 49.3208"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M132.636 41.1284L135.91 49.3541"
        stroke="white"
        strokeWidth="2"
      />
      <line
        x1="196.971"
        y1="27.9998"
        x2="196.971"
        y2="36.8829"
        stroke="white"
        strokeWidth="2"
      />
      <ellipse
        cx="198.345"
        cy="198.152"
        rx="160.542"
        ry="160.96"
        transform="rotate(-90 198.345 198.152)"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M197.336 368.505C197.721 369.17 198.682 369.17 199.067 368.505L203.79 360.346C204.176 359.679 203.695 358.845 202.924 358.845H193.479C192.709 358.845 192.228 359.679 192.614 360.346L197.336 368.505Z"
        fill="#D90000"
      />
      <line
        x1="36.6052"
        y1="196.314"
        x2="358.121"
        y2="196.314"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.681"
        y2="-0.5"
        transform="matrix(-0.00151626 0.999999 -0.999999 -0.00150839 196.271 37.8059)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.712"
        y2="-0.5"
        transform="matrix(0.19361 0.981079 -0.981269 0.192643 166.143 40.8247)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.715"
        y2="-0.5"
        transform="matrix(-0.20415 0.97894 0.979151 0.203135 228.737 41.4631)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.803"
        y2="-0.5"
        transform="matrix(0.383534 0.923527 0.924231 -0.381835 135.673 50.0098)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.803"
        y2="-0.5"
        transform="matrix(-0.383534 0.923527 -0.924231 -0.381835 258.712 50.0098)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.939"
        y2="-0.5"
        transform="matrix(0.556569 -0.830801 0.832136 0.554571 107.876 331.466)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.098"
        y2="-0.5"
        transform="matrix(0.708026 -0.706187 0.708026 0.706187 83.5093 311.527)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.098"
        y2="-0.5"
        transform="matrix(-0.708026 -0.706187 -0.708026 0.706187 310.855 311.527)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.258"
        y2="-0.5"
        transform="matrix(0.832136 -0.554571 0.556569 0.830801 63.5259 287.224)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.393"
        y2="-0.5"
        transform="matrix(0.924231 -0.381835 0.383534 0.923527 48.6633 259.509)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.484"
        y2="-0.5"
        transform="matrix(0.980882 -0.194603 0.195579 0.980688 39.5205 229.431)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.484"
        y2="-0.5"
        transform="matrix(-0.980882 -0.194603 -0.195579 0.980688 354.858 229.431)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.939"
        y2="-0.5"
        transform="matrix(-0.556569 -0.830801 -0.832136 0.554571 286.502 331.466)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.264"
        y2="-0.5"
        transform="matrix(-0.836593 -0.547826 -0.54982 0.835283 331.576 286.141)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.4"
        y2="-0.5"
        transform="matrix(-0.928511 -0.371304 -0.372972 0.927843 346.396 257.818)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.507"
        y2="-0.5"
        transform="matrix(0.994733 0.102502 -0.103031 0.994678 37.5933 180.342)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.689"
        y2="-0.5"
        transform="matrix(-0.103031 0.994678 -0.994733 -0.102502 211.439 37.91)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.688"
        y2="-0.5"
        transform="matrix(0.0972663 0.995258 -0.995307 0.0967664 181.596 38.5415)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.753"
        y2="-0.5"
        transform="matrix(-0.296047 0.955173 0.955607 0.294645 244.67 44.9385)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.749"
        y2="-0.5"
        transform="matrix(0.286397 0.958111 0.958518 -0.285032 151.266 44.4717)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.87"
        y2="-0.5"
        transform="matrix(-0.476558 0.879143 -0.880178 -0.474644 273.651 57.0815)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.021"
        y2="-0.5"
        transform="matrix(0.639059 -0.769157 0.770788 0.637092 94.614 321.587)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.184"
        y2="-0.5"
        transform="matrix(0.776832 -0.629708 0.631684 0.775226 72.4319 299.258)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.013"
        y2="-0.5"
        transform="matrix(-0.631684 -0.775226 -0.776832 0.629708 298.574 322.562)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.334"
        y2="-0.5"
        transform="matrix(0.884662 -0.466232 0.468132 0.883658 55.051 273.035)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.447"
        y2="-0.5"
        transform="matrix(0.958518 -0.285032 0.286397 0.958111 43.1318 243.943)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.508"
        y2="-0.5"
        transform="matrix(0.995664 -0.0930257 0.0935066 0.995619 37.134 213.088)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.443"
        y2="-0.5"
        transform="matrix(-0.95576 -0.29415 -0.29555 0.955327 350.801 245.407)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.863"
        y2="-0.5"
        transform="matrix(-0.468132 -0.883658 -0.884662 0.466232 272.294 339.898)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.176"
        y2="-0.5"
        transform="matrix(-0.770788 -0.637092 -0.639059 0.769157 320.972 300.434)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.337"
        y2="-0.5"
        transform="matrix(-0.88685 -0.462058 -0.46395 0.885862 339.675 272.369)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.514"
        y2="-0.5"
        transform="matrix(0.998922 0.0464298 -0.0466714 0.99891 36.8418 189.35)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.682"
        y2="-0.5"
        transform="matrix(-0.0487931 0.998809 -0.998821 -0.0485405 202.428 37.844)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.699"
        y2="-0.5"
        transform="matrix(0.14973 0.988727 -0.988842 0.148971 173.184 39.5964)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.732"
        y2="-0.5"
        transform="matrix(-0.249604 0.968348 0.96866 0.248389 236.196 43.2399)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.777"
        y2="-0.5"
        transform="matrix(0.340043 0.94041 0.940973 -0.338482 142.652 47.3068)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.832"
        y2="-0.5"
        transform="matrix(-0.426182 0.904637 -0.905489 -0.42437 265.558 53.0183)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.975"
        y2="-0.5"
        transform="matrix(0.594673 -0.803968 0.805443 0.592673 101.753 327.167)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.137"
        y2="-0.5"
        transform="matrix(0.740128 -0.672467 0.674381 0.738384 78.3462 306.118)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.059"
        y2="-0.5"
        transform="matrix(-0.674381 -0.738384 -0.740128 0.672467 305.442 316.673)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.293"
        y2="-0.5"
        transform="matrix(0.857023 -0.515278 0.517248 0.855836 59.511 280.912)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.42"
        y2="-0.5"
        transform="matrix(0.940973 -0.338482 0.340043 0.94041 45.9636 252.538)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.497"
        y2="-0.5"
        transform="matrix(0.988861 -0.148844 0.149603 0.988746 38.2263 222.068)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.467"
        y2="-0.5"
        transform="matrix(-0.970786 -0.239946 -0.241125 0.970494 353.229 236.711)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.903"
        y2="-0.5"
        transform="matrix(-0.517248 -0.855836 -0.857023 0.515278 280.184 335.46)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.221"
        y2="-0.5"
        transform="matrix(-0.805443 -0.592673 -0.594673 0.803968 326.552 293.324)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.372"
        y2="-0.5"
        transform="matrix(-0.910453 -0.413613 -0.415399 0.909639 343.488 264.605)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.497"
        y2="-0.5"
        transform="matrix(0.9889 0.14858 -0.149338 0.988786 38.6023 172.944)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.699"
        y2="-0.5"
        transform="matrix(-0.149338 0.988786 -0.9889 -0.14858 219.169 39.6866)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.682"
        y2="-0.5"
        transform="matrix(0.0451488 0.99898 -0.998991 0.044915 189.953 37.9413)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.781"
        y2="-0.5"
        transform="matrix(-0.348002 0.937494 0.938082 0.346414 253.006 47.7543)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.729"
        y2="-0.5"
        transform="matrix(0.242317 0.970197 0.970492 -0.241133 158.336 42.5354)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.903"
        y2="-0.5"
        transform="matrix(-0.517019 0.855974 -0.85716 -0.515049 280.156 60.7771)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.059"
        y2="-0.5"
        transform="matrix(0.674183 -0.738564 0.740307 0.672269 88.9644 316.684)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.221"
        y2="-0.5"
        transform="matrix(0.805285 -0.592888 0.594888 0.803809 67.8467 293.348)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.975"
        y2="-0.5"
        transform="matrix(-0.594888 -0.803809 -0.805285 0.592888 292.653 327.125)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.365"
        y2="-0.5"
        transform="matrix(0.905376 -0.424612 0.426424 0.904523 51.7109 266.345)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.467"
        y2="-0.5"
        transform="matrix(0.970722 -0.240205 0.241385 0.97043 41.1626 236.732)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.514"
        y2="-0.5"
        transform="matrix(0.998909 -0.0466959 0.0469389 0.998898 36.6121 205.631)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.42"
        y2="-0.5"
        transform="matrix(-0.941063 -0.338231 -0.339791 0.940501 348.428 252.479)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="320.832"
        y2="-0.5"
        transform="matrix(-0.426424 -0.904523 -0.905376 0.424612 265.6 343.222)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.137"
        y2="-0.5"
        transform="matrix(-0.740307 -0.672269 -0.674184 0.738564 316.06 306.062)"
        stroke="white"
      />
      <line
        y1="-0.5"
        x2="321.301"
        y2="-0.5"
        transform="matrix(-0.862272 -0.506446 -0.508405 0.861118 335.709 279.482)"
        stroke="white"
      />
      <defs>
        <filter
          id="filter0_d_77_120"
          x="0"
          y="0"
          width="395.443"
          height="399"
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
          <feMorphology
            radius="1"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_77_120"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_77_120"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_77_120"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_77_120"
          x="14.5"
          y="15.639"
          width="367"
          height="366.112"
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
          <feMorphology
            radius="2"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_77_120"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.553846 0 0 0 0 0.553846 0 0 0 0 0.553846 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_77_120"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_77_120"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_77_120"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(201.148 208.649) rotate(48.9769) scale(179.216 178.068)"
        >
          <stop stopColor="#242424" />
          <stop offset="0.932065" />
        </radialGradient>
      </defs>
    </svg>
  );
}
