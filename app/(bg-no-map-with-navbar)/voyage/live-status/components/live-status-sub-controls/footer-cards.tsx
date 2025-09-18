import { InnerRectOnline, OfflineIcon, OnlineIcon, StatusCardRect, StatusVertical } from "@/assets/voyage/live-status-svg/svg-icon";
import { useGetAllVoyageCordsQuery } from "@/queries/use-get-all-voyage-cords-query";
import Image, { StaticImageData } from "next/image";

interface StatusCardProps {
    navigationGreen: StaticImageData;
    navigationRed: StaticImageData;
}

interface OnlineCardProps {
    time: number;
}

export const StatusCard = ({ navigationGreen, navigationRed }: StatusCardProps) => {
    return (
        <div className="pointer-events-auto relative h-[84px] w-[393px] lg:h-[76px] lg:w-[371px] xl:h-[80px] xl:w-[390px] 2xl:h-[80px] 2xl:w-[392px] 3xl:h-[84px] 3xl:w-[393px]">
            {/* Background with shadow and border */}
            <div className="absolute inset-[3px] rounded-[10px] bg-[#1A1A1A] shadow-[0_0_3.6px_rgba(255,255,255,0.5)] lg:inset-[3px] xl:inset-[3px] 2xl:inset-[3px] 3xl:inset-[3px]">
                {/* Inner border with gradient */}
                <div className="absolute inset-[8px] ml-[1px] mt-[0px] lg:inset-[3px] lg:ml-[-6px] lg:mt-[2px] xl:inset-[7px] xl:ml-[-1px] xl:mt-[-1px] 2xl:inset-[8px] 2xl:ml-[-1px] 2xl:mt-[-2px] 3xl:inset-[8px] 3xl:ml-[1px] 3xl:mt-0">
                    <StatusCardRect />
                </div>
            </div>

            {/* Left red circle (50.3895, 40.7453 in SVG) */}
            <div className="absolute left-[43.3895px] top-[40.7453px] -translate-x-1/2 -translate-y-1/2 transform"
                title="Vessels updated in the last 30 minutes">
                <Image
                    src={navigationGreen}
                    alt="Online vessel icon"
                    width={35}
                    height={35}
                    className="h-[35px] w-[35px]"
                />
            </div>

            {/* Middle right green circle (342.062, 40.0668 in SVG) */}
            <div className="absolute left-[246.062px] top-[40.0668px] -translate-x-1/2 -translate-y-1/2 transform lg:left-[240.062px] xl:left-[235.062px] 2xl:left-[236.062px] 3xl:left-[246.062px]"
                title="Vessels not updated in the last 30 minutes">
                <Image
                    src={navigationRed}
                    alt="Offline vessel icon"
                    width={35}
                    height={35}
                    className="h-[35px] w-[35px]"
                />
            </div>

            {/* Text sections */}
            <div className="absolute left-[73.594px] top-[35.7108px] font-alexandria text-[12px] text-white">
                {/* Left text group */}
                <div className="flex flex-col">
                    <span className="mt-[-7px] font-alexandria text-[18px] font-semibold lg:text-[14px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        0 - 30 Mins
                    </span>
                </div>
            </div>
            <div className="absolute left-[203.031px] top-[19px]">
                <StatusVertical />
            </div>

            {/* Right text group */}
            <div className="absolute left-[277.506px] top-[35.8368px] font-alexandria text-[12px] text-white lg:left-[276.506px] xl:left-[266.506px] 3xl:left-[277.506px]">
                <div className="flex flex-col">
                    <span className="mt-[-7px] font-alexandria text-[18px] font-semibold lg:text-[14px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                        30+ Mins{" "}
                    </span>
                </div>
            </div>
        </div>
    );
};

//onlineCards..

export const OnlineCard = ({ time }: OnlineCardProps) => {
    const { data: vessels } = useGetAllVoyageCordsQuery();

    const countStatus = () => {
        let online = 0;
        let offline = 0;

        vessels?.forEach(vessel => {
            const timeDiffSeconds = vessel.time_info?.time_difference_seconds;

            if (timeDiffSeconds === undefined || timeDiffSeconds === null) {
                offline++;
                return;
            }

            const hoursDiff = timeDiffSeconds / 3600;
            if (hoursDiff < time) {
                online++;
            } else {
                offline++;
            }
        });

        return { online, offline };
    };

    const { online, offline } = countStatus();

    return (
        <div className="relative h-[84px] w-[392px] lg:h-[80px] lg:w-[322px] xl:h-[80px] xl:w-[392px] 2xl:h-[80px] 2xl:w-[389px] 3xl:h-[84px] 3xl:w-[392px]">
            {/* Background with shadow and border */}
            <div className="absolute inset-[3px] rounded-[10px] bg-[#1A1A1A] shadow-[0_0_3.6px_rgba(255,255,255,0.5)] lg:inset-[6px] xl:inset-[3px] 2xl:inset-[1px] 3xl:inset-[3px]">
                {/* Inner border with gradient */}
                <div className="absolute inset-[7px]">
                    <InnerRectOnline />
                </div>
            </div>

            {/* Left icon */}
            <div className="absolute left-[43.3895px] top-[40.7453px] -translate-x-1/2 -translate-y-1/2 transform">
                <OnlineIcon />
            </div>

            {/* Right icon */}
            <div className="absolute left-[242.062px] top-[40.0668px] -translate-x-1/2 -translate-y-1/2 transform lg:left-[191.062px] xl:left-[242.062px] 2xl:left-[242.062px] 3xl:left-[242.062px]">
                <OfflineIcon />
            </div>

            {/* Vertical divider */}
            <div className="absolute left-[203.031px] top-[19px] lg:left-[162.031px] xl:left-[200.031px] 2xl:left-[200.031px] 3xl:left-[203.031px]">
                <StatusVertical />
            </div>

            {/* Online count - perfectly centered */}
            <div className="absolute left-[61.506px] top-1/2 -translate-y-1/2 transform">
                <div className="flex items-center">
                    <span className="w-[40px] text-center font-din text-[35px] font-semibold text-green-900 lg:text-[30px] xl:text-[30px] 2xl:text-[30px] 3xl:text-[35px]">
                        {online}
                    </span>
                    <span className="ms-[1px] mt-[4px] font-alexandria text-[20px] text-white lg:text-[14px] xl:text-[20px] 2xl:text-[20px] 3xl:text-[20px]">
                        Online
                    </span>
                </div>
            </div>

            {/* Offline count - perfectly centered and aligned */}
            <div className="absolute left-[259.506px] top-1/2 -translate-y-1/2 transform lg:left-[202.506px] xl:left-[256.506px] 2xl:left-[259.506px] 3xl:left-[259.506px]">
                <div className="flex items-center">
                    <span className="w-[40px] text-center font-din text-[35px] font-semibold text-red-600 lg:text-[30px] xl:text-[30px] 2xl:text-[30px] 3xl:text-[35px]">
                        {offline}
                    </span>
                    <span className="ms-[1px] mt-[4px] font-alexandria text-[20px] text-white lg:text-[14px] xl:text-[20px] 2xl:text-[20px] 3xl:text-[20px]">
                        Offline
                    </span>
                </div>
            </div>
        </div>
    );
};
