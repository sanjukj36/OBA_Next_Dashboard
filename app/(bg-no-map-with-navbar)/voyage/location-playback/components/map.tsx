"use client";

import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import navigationGreen from "@/assets/voyage/voyage-navigation-green.svg";
import { LIVE_STATUS_DARK_MAP_URL } from "@/lib/map-urls";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pause, Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { addOpacity, safeDateFormate } from "@/lib/utils";
import { usePlaybackCordsQuery } from "@/queries/use-get-playback-cords-query";
import { useInitialPlaybackCordsQuery } from "@/queries/use-get-playback-initial-cords-query";
import {
  LocationPlaybackNavlistItem,
  useLocationPlayback
} from "../location-playback-context";
import "./map.css";
import Loader from "@/components/loader/Loader";

function VoyagePlaybackMap() {
  const { data } = usePlaybackCordsQuery();
  const { lastCords } = data ?? {};
  const center = [
    lastCords?.LAT ?? 21.505,
    lastCords?.LON ?? -0.09
  ] as LatLngExpression;
  const zoom = lastCords ? 6 : 3;

  return (
    <div className="relative isolate m-[6px] flex-1 rounded-[12px] p-[14px] shadow-[0px_0px_3.6px_0px_#FFFFFF]">
      <LoadingComponent />
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2.3}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        scrollWheelZoom={true}
        attributionControl={false}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={false}
        className="z-0 h-full w-full overflow-hidden rounded-[8px] bg-black"
      >
        <TileLayer url={LIVE_STATUS_DARK_MAP_URL} />
        <VesselPlaybackPath />
        <VesselMarker />
      </MapContainer>
      <DateRangeSelection />
      <VoyagePlaybackController />
      <NavigationCard />
    </div>
  );
}

export default VoyagePlaybackMap;

function LoadingComponent() {
  const { isFetching } = usePlaybackCordsQuery();
  const { isFetching: initialIsFetching } = useInitialPlaybackCordsQuery()
  const [showLoader, setShowLoader] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFetching) {
      timeoutRef.current = setTimeout(() => {
        setShowLoader(true);
      }, 2000); // Only show loader if fetching lasts more than 2s
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowLoader(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isFetching]);

  if (initialIsFetching) {
    return (
      <Loader className="absolute inset-0 bg-black/50" />
    );
  }

  if (!showLoader) return null;

  return (
    <Loader className="absolute inset-0 bg-black/50" />
  );
}

function VesselPlaybackPath() {
  const { data } = usePlaybackCordsQuery()
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug");


  if (debug) {
    console.info({ data });
  }


  return (
    <>
      {
        data?.paths?.map((item, key) => {
          return (
            <Polyline
              key={`voyage-plyaback-path-data-${key}`}
              pathOptions={{ color: "#0085C9", dashArray: "5", dashOffset: "0" }}
              className="animated-path"
              positions={item ?? []}
            />
          )
        })
      }
      {
        data?.missPaths?.map((item, key) => {
          return (
            <Polyline
              key={`voyage-plyaback-path-no-data-${key}`}
              pathOptions={{ color: addOpacity("#0085C9", 50) }}
              positions={item ?? []}
            />
          )
        })
      }
    </>
  );
}

function NavigationCard({ className }: { className?: string }) {
  const { filteredNavList } = useLocationPlayback();
  return (
    <div
      className={twMerge(
        "absolute right-4 top-3 flex flex-col gap-3",
        className
      )}
    >
      {filteredNavList &&
        filteredNavList.length > 0 &&
        filteredNavList.map(item => <NavigationItem key={item.id} {...item} />)}
    </div>
  );
}

type NavigationItemProps = LocationPlaybackNavlistItem;
function NavigationItem(props: NavigationItemProps) {
  const { currentNavList, setCurrentNavList } = useLocationPlayback();
  const handleOnClick = () => {
    setCurrentNavList([...currentNavList, { ...props }]);
  };
  return (
    <div
      onClick={handleOnClick}
      className="flex cursor-pointer items-center gap-4 rounded-[6px] border border-[#626262] bg-[linear-gradient(90deg,_#1B1B1B_0%,_#2F2F2F_100%)] px-5 py-2 font-alexandria text-[20px] font-[500] uppercase leading-[100%] tracking-[0%] shadow-[3px_5px_9.4px_0px_#000000]"
    >
      {props?.icon ? (
        <props.icon />
      ) : (
        <div className="rounded border border-slate-700 bg-black" />
      )}
      <span>{props.name}</span>
    </div>
  );
}

function VoyagePlaybackController() {
  const [sliderValue, setSliderValue] = useState([0]);
  const { data, isFetching } = useInitialPlaybackCordsQuery();
  const { selectedDate, setSelectedDate } = useLocationPlayback();
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 3>(1)
  const [playPause, setPlayPause] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { vesselTimeToTimestampMap } = data ?? {};

  const playbackSpeedLabelMap: Record<
    typeof playbackSpeed,
    `${typeof playbackSpeed}x`
  > = {
    "1": "1x",
    "2": "2x",
    "3": "3x"
  };

  const start = vesselTimeToTimestampMap
    ? vesselTimeToTimestampMap[0]?.time
    : null;
  const end = vesselTimeToTimestampMap
    ? vesselTimeToTimestampMap[vesselTimeToTimestampMap?.length - 1]?.time
    : null;
  const startDate = safeDateFormate(start, "dd-MM-yyyy HH:mm") ?? "00-00-0000";
  const endDate = safeDateFormate(end, "dd-MM-yyyy HH:mm") ?? "00-00-0000";
  const currentDate =
    safeDateFormate(selectedDate?.time ?? null, "dd-MM-yyyy HH:mm") ??
    "00-00-0000";

  const min = 0;
  const max = (data?.recordCount ?? 100) - 1;

  //TODO: pending play and 2x button
  const handleChangePlaybackSpeed = () => {
    if (playbackSpeed === 1) return setPlaybackSpeed(2)
    if (playbackSpeed === 2) return setPlaybackSpeed(3)
    if (playbackSpeed === 3) return setPlaybackSpeed(1)
  }

  useEffect(() => {
    if (playPause) {
      intervalRef.current = setInterval(() => {
        setSliderValue(([val]) => {
          const next = val + playbackSpeed;
          if (next >= max) {
            clearInterval(intervalRef.current!);
            setPlayPause(false);
            return [max];
          } else {
            return [next];
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playPause, playbackSpeed]);


  useEffect(() => {
    if (isFetching) {
      setSliderValue([0])
    }
  }, [isFetching])

  useEffect(() => {
    const [index] = sliderValue;
    const current = (vesselTimeToTimestampMap ?? [])[index];

    setSelectedDate(current);
  }, [sliderValue, setSelectedDate, vesselTimeToTimestampMap]);

  const handlePlayPause = () => {
    setPlayPause(prev => !prev);
  };

  const disabled = !vesselTimeToTimestampMap || vesselTimeToTimestampMap?.length === 0

  return (
    <div className="absolute bottom-[22px] left-1/2 flex w-[60%] -translate-x-1/2 flex-col gap-2 font-alexandria leading-[100%] tracking-[0%]">
      <div className="mb-2 flex justify-between text-[15px]">
        <p>{startDate}</p>
        <p>{endDate}</p>
      </div>
      <Slider
        disabled={disabled}
        value={sliderValue}
        onValueChange={setSliderValue}
        min={min}
        max={max}
        step={playbackSpeed}
      />
      <div className="mt-2 flex w-full justify-between gap-2">
        <button
          onClick={handlePlayPause}
          disabled={disabled}
          className={twMerge("gradient-border grid size-[60px] place-content-center rounded-[5px]", disabled && "opacity-50")}
        >
          {playPause ? (
            <Pause className="fill-white" />
          ) : (
            <Play className="fill-white" />
          )}
        </button>
        <div className="gradient-border grid h-[60px] place-content-center rounded-[5px] px-6 text-[25px]">
          {currentDate}
        </div>
        <button
          onClick={handleChangePlaybackSpeed}
          className="gradient-border grid size-[60px] place-content-center rounded-[5px] text-[30px] font-[500]"
        >
          {playbackSpeedLabelMap[playbackSpeed]}
        </button>
      </div>
    </div>
  );
}

function HorizontalDivider() {
  return (
    <div className="h-[1px] w-full rounded-full bg-[linear-gradient(90deg,_#6E6E7A_0%,_#8B8B97_17.12%,_#DADAE6_33.66%,_#F2F2FE_53.37%,_#8B8B97_75.96%,_#717483_100%)] opacity-80" />
  );
}

function DateRangeSelection() {
  const {
    from_date: fromDate,
    to_date: toDate,
    setFrom: setFromDate,
    setTo: setToDate,
    setInitialDate,
    setPrevSelectedDate
  } = useLocationPlayback();

  return (
    <div className="absolute left-[22px] top-[22px] flex gap-2 leading-[100%] tracking-[0%] font-alexandria">
      <div className="flex flex-col gap-1 rounded-[9px] border border-white/50 bg-black p-2">
        <p className="text-[15px]">From Date (UTC)</p>
        <HorizontalDivider />
        <Popover>
          <PopoverTrigger asChild>
            <button
              data-empty={!fromDate}
              className="mt-2 flex items-center gap-2"
            >
              <p className="min-w-[13ch] text-start">
                {fromDate ? format(fromDate, "dd-MM-yyyy") : "00-00-0000"}
              </p>
              <CalendarIcon className="ml-auto" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date)
                setInitialDate(undefined)
                setPrevSelectedDate(undefined)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1 rounded-[9px] border border-white/50 bg-black p-2">
        <p className="text-[15px]">To Date (UTC)</p>
        <HorizontalDivider />
        <Popover>
          <PopoverTrigger asChild>
            <button
              data-empty={!toDate}
              className="mt-2 flex items-center gap-2"
            >
              <p className="min-w-[13ch] text-start">
                {toDate ? format(toDate, "dd-MM-yyyy") : "00-00-0000"}
              </p>
              <CalendarIcon className="ml-auto" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={toDate} onSelect={(date) => {
              setToDate(date)
              setInitialDate(undefined)
              setPrevSelectedDate(undefined)
            }} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function VesselMarker() {
  const { data } = usePlaybackCordsQuery()
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current && data?.lastCords?.HDG) {
      markerRef.current.setRotationAngle(data.lastCords.HDG)
    }
  }, [data?.lastCords?.HDG])

  if (!data) return null;

  const { lastCords } = data;

  const icon = new Icon({
    iconUrl: navigationGreen.src,
    iconSize: [44, 44]
  });


  return (
    <>
      <Marker
        ref={markerRef}
        position={[lastCords?.LAT ?? 0, lastCords?.LON ?? 0]}
        icon={icon}
        rotationAngle={lastCords?.HDG ?? 0}
        rotationOrigin="center center"
        riseOnHover
      />
    </>
  );
}
