"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap
} from "react-leaflet";
import Image from "next/image";
import { Icon, LatLngExpression } from "leaflet";
import { twMerge } from "tailwind-merge";
import bulkCarrier from "@/assets/voyage/Bulk carrier sailing.jpg";
import { Arrow, BorderLine, Close, MainBorder, VerticalBorder, VerticalBorderLine } from "@/assets/voyage/live-status-svg/svg-icon";
import navigationGreen from "@/assets/voyage/voyage-navigation-green.svg";
import navigationRed from "@/assets/voyage/voyage-navigation-red.svg";
import { LIVE_STATUS_DARK_MAP_URL } from "@/lib/map-urls";
import { useGetAllVoyageCordsQuery } from "@/queries/use-get-all-voyage-cords-query";
import "leaflet-rotatedmarker";
import ReactCountryFlag from "react-country-flag";
import L from "leaflet";
import { useVoyageDetailsQuery } from "@/queries/use-voyagelist";
import { ResetViewControl } from "./live-status-sub-controls/reset-view-control";
import { SearchWithFilter } from "./live-status-sub-controls/search-filter";
import { OnlineCard, StatusCard } from "./live-status-sub-controls/footer-cards";
import "leaflet/dist/leaflet.css";
import "./map.css";

const time = 0.5;

declare module 'react-leaflet' {
  interface MarkerProps {
    vesselId?: number;
    rotationAngle?: number;
    rotationOrigin?: string;
  }
}

declare module 'leaflet' {
  interface MarkerOptions {
    vesselId?: number;
    rotationAngle?: number;
    rotationOrigin?: string;
  }
}

function secToHr(sec: number): number {
  return sec / (60 * 60);
}

function LiveStatusMapComponent() {
  const { data: vesselsData, isLoading } = useGetAllVoyageCordsQuery();
  const [selectedVessel, setSelectedVessel] = useState<{
    id: number;
    position: LatLngExpression;
  } | null>(null);
  const [mapPosition, setMapPosition] = useState<LatLngExpression | null>(null);
  const [isZooming] = useState(false);
  const [targetZoom, setTargetZoom] = useState<number | null>(null);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [, setIsTransitioning] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [pendingVessel, setPendingVessel] = useState<{
    id: number;
    position: LatLngExpression;
  } | null>(null);
  const [, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"online" | "offline" | null>(null);


  useEffect(() => {
    if (!isLoading && vesselsData) {
      setDataLoaded(true);
    }
  }, [isLoading, vesselsData]);



  function arePositionsEqual(pos1: LatLngExpression, pos2: LatLngExpression) {
    const [lat1, lng1] = Array.isArray(pos1) ? pos1 : [pos1.lat, pos1.lng];
    const [lat2, lng2] = Array.isArray(pos2) ? pos2 : [pos2.lat, pos2.lng];

    return Math.abs(lat1 - lat2) < 0.0001 && Math.abs(lng1 - lng2) < 0.0001;
  }

  const handleVesselSelectFromMap = (vessel: {
    id: number;
    position: LatLngExpression;
  }) => {
    // Check if the new vessel is at the same position as the currently selected one
    const isSamePosition = selectedVessel &&
      arePositionsEqual(vessel.position, selectedVessel.position);

    if (isSamePosition && selectedVessel?.id !== vessel.id) {
      // Just update the selected vessel without moving the map
      setSelectedVessel(vessel);
    } else {
      setSelectedVessel(vessel);
    }
  };


  // Handle vessel selection from list (move map and show popup)
  const handleVesselSelectFromList = (vessel: {
    id: number;
    position: LatLngExpression;
  }) => {
    if (!mapRef.current) return;

    // Check if the new vessel is at the same position as the currently selected one
    const isSamePosition = selectedVessel &&
      arePositionsEqual(vessel.position, selectedVessel.position);

    if (isSamePosition) {
      // Just update the selected vessel without moving the map
      setSelectedVessel(vessel);
      return;
    }

    setIsTransitioning(true);

    // First zoom out slightly for better context
    mapRef.current.flyTo([21.505, -0.09], 3, {
      duration: 0.5,
      easeLinearity: 0.25
    }).once('moveend', () => {
      // Then fly to vessel with higher zoom
      mapRef.current?.flyTo(vessel.position, 7, {
        duration: 1,
        easeLinearity: 0.25
      }).once('moveend', () => {
        setSelectedVessel(vessel);
        setIsTransitioning(false);
      });
    });
  };

  function MapEvents() {
    const map = useMap();
    const isProgrammaticZoom = useRef(false);

    useEffect(() => {
      const handleZoomStart = () => {
        // Only clear selection if this is a user-initiated zoom
        if (!isProgrammaticZoom.current) {
          // Don't clear selection - allow zooming with modal open
        }
        isProgrammaticZoom.current = false;
      };

      map.on('zoomstart', handleZoomStart);
      return () => {
        map.off('zoomstart', handleZoomStart);
      };
    }, [map]);

    return null;
  }

  const handleResetView = () => {
    setSelectedVessel(null); // Clear selection
    mapRef.current?.flyTo([21.505, -0.09], 3, {
      duration: 1,
      easeLinearity: 0.25
    });
  };

  const handleZoomComplete = () => {
    if (pendingVessel && isZoomingOut) {
      // After zooming out, center on the vessel position
      setMapPosition(pendingVessel.position);
      setTargetZoom(7); // Zoom in to a comfortable level
      setIsZoomingOut(false);

      // Set a slight delay before showing modal to ensure smooth transition
      setTimeout(() => {
        setSelectedVessel(pendingVessel);
        setPendingVessel(null);
      }, 300);
    }
  };

  return (
    <div className="relative isolate m-[6px] flex-1 rounded-[12px] p-[14px] shadow-[0px_0px_3.6px_0px_#FFFFFF]">
      <MapContainer
        center={[21.505, -0.09]}
        zoom={3}
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
        ref={mapRef}
      >
        <MapEvents />
        <TileLayer url={LIVE_STATUS_DARK_MAP_URL} />
        <AllMarkers onSelectVessel={handleVesselSelectFromMap} statusFilter={statusFilter} />
        <MapPanHandler
          position={mapPosition}
          zoomLevel={targetZoom}
          onZoomComplete={handleZoomComplete}
        />
        <ResetViewControl
          onClick={handleResetView}
          isLoading={isLoading || !vesselsData}
        />
      </MapContainer>
      {/* Fixed position modal */}
      {selectedVessel && !isZooming && (
        <div className="pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="pointer-events-auto">
            <PopupComponent
              id={selectedVessel.id}
              onClose={() => setSelectedVessel(null)}
            />
          </div>
        </div>
      )}
      <OfflineVesselList
        onVesselSelect={handleVesselSelectFromList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        className="absolute left-[calc(16px+14px)] font-alexandria top-[calc(19px+14px)] z-10 lg:left-[calc(8px+14px)] xl:left-[calc(16px+14px)] 2xl:left-[calc(16px+14px)] 3xl:left-[calc(16px+14px)]"
      />
      <div className="pointer-events-none absolute bottom-[32px] left-0 right-0 z-10 flex justify-center px-[400px] lg:left-0 lg:right-[175px] lg:px-[4px] xl:left-[-111px] xl:right-0 xl:px-0 2xl:left-[-111px] 2xl:right-0 2xl:px-0 3xl:left-0 3xl:right-0 3xl:px-[400px]">
        <StatusCard navigationGreen={navigationGreen} navigationRed={navigationRed} />
      </div>
      <div className="absolute bottom-[32px] right-[45px] z-10 lg:right-[22px] xl:right-[25px] 2xl:px-[30px] 3xl:right-[45px]">
        <OnlineCard time={time} />
      </div>
    </div>
  );
}

export default LiveStatusMapComponent;

function AllMarkers({
  onSelectVessel,
  statusFilter
}: {
  onSelectVessel: (vessel: { id: number; position: LatLngExpression }) => void;
  statusFilter: "online" | "offline" | null;
}) {
  const { data } = useGetAllVoyageCordsQuery();
  const [openPopupId, setOpenPopupId] = useState<number | null>(null);
  const map = useMap();
  const center = map.getCenter();

  // Filter vessels based on status
  const filteredData = data?.filter(vessel => {
    if (!statusFilter) return true;
    const timeDiffSeconds = vessel.time_info?.time_difference_seconds;
    if (timeDiffSeconds === undefined || timeDiffSeconds === null) {
      return statusFilter === "offline";
    }
    const hoursDiff = timeDiffSeconds / 3600;
    const isOnline = hoursDiff < time;
    return statusFilter === "online" ? isOnline : !isOnline;
  });

  const navigationRedWithAnimationIcon = new Icon({
    iconUrl: navigationRed.src,
    iconSize: [30, 30]
  });

  const navigationGreenIcon = new Icon({
    iconUrl: navigationGreen.src,
    iconSize: [30, 30]
  });

  useEffect(() => {
    if (data?.length) {
      const bounds = L.latLngBounds(
        data
          .filter(v => v.data?.LAT && v.data?.LONG)
          .map(v => [v.data.LAT, v.data.LONG])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [data, map]);


  if (!filteredData || filteredData.length === 0) return null;

  return filteredData?.map(item => {
    if (!item.data || Object.entries(item.data).length === 0 || !item.time_info) return null

    const position = [item.data.LAT ?? 0, item.data.LONG ?? 0] as LatLngExpression;
    const rotationAngle = item.data.HDG;
    const diffInHr = secToHr(item?.time_info?.time_difference_seconds);
    const icon = diffInHr < time ? navigationGreenIcon : navigationRedWithAnimationIcon;
    return (
      <Marker
        key={item.vessel_id}
        position={position}
        icon={icon}
        rotationAngle={rotationAngle}
        rotationOrigin="center center"
        eventHandlers={{
          click: (e) => {
            // Prevent Leaflet's default popup behavior
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            onSelectVessel({
              id: item.vessel_id,
              position: position
            });
          }
        }}
      >
        <Tooltip direction="top" offset={[0, -20]} permanent={false} className="custom-tooltip">
          <div className="bg-black text-white p-2 rounded font-alexandria border-4">
            <h4 className="font-semibold">{item.vessel_name}</h4>
            <p>Status: {diffInHr < time ? "Online" : "Offline"}</p>
            <p>
              Last update:{" "}
              {formatTimeDifference(item.time_info?.time_difference_seconds ?? null)}
            </p>
          </div>
        </Tooltip>
        {openPopupId === item.vessel_id && (
          <Popup
            closeButton={false}
            minWidth={714}
            className="z-30 h-auto w-auto p-0"
            position={center} // Use map center instead of marker position
            autoPan={false}
          >
            <PopupComponent id={openPopupId} onClose={() => setOpenPopupId(null)}
            />
          </Popup>
        )}
      </Marker>
    );
  });
}

function formatTimeDifference(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "N/A";
  if (seconds < 60) return "just now"; // Less than 1 minute

  const days = Math.floor(seconds / 86400); // 86400 seconds in a day
  const hours = Math.floor((seconds % 86400) / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((seconds % 3600) / 60); // 60 seconds in a minute

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0 && days === 0) { // Only show minutes if less than a day
    parts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  }

  return parts.length > 0 ? `${parts.join(' ')} ago` : "just now";
}

function PopupComponent({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: voyageData } = useVoyageDetailsQuery(id);
  const progressPercentage = 55;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="pointer-events-auto flex h-auto w-[714px] flex-col rounded-[30px] border border-white/50 bg-[#1A1A1A] p-[7px] lg:h-[432px] lg:w-[521px] xl:h-auto xl:w-[714px] 2xl:h-auto 2xl:w-[714px] 3xl:h-auto 3xl:w-[714px]">
        <div className="flex h-full w-full flex-1 flex-col rounded-[25px] bg-[#1A1A1A] px-[17px] py-[27px]">
          {/* Header Section */}
          <div className="flex justify-between">
            <div className="flex gap-[17px]">
              <div className="flex h-[40px] w-[60px] items-center justify-center bg-gray-500 text-white">
                {voyageData?.flag ? (
                  <ReactCountryFlag
                    countryCode={voyageData.flag}
                    svg
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    title={voyageData.flag}
                  />
                ) : (
                  <span className="text-xs text-white">NO FLAG</span>
                )}
              </div>
              <div className="flex flex-col justify-between font-alexandria text-[18px] uppercase leading-[100%] tracking-[0%] text-white lg:text-[14px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                <div className="flex gap-[28px] font-normal">
                  <p>{voyageData?.vessel_name}</p>
                  <div className="h-full w-[1px]">
                    <VerticalBorderLine />
                  </div>
                  <p>IMO {voyageData?.imo || "_"}</p>
                </div>
                <p>{voyageData?.vessel_type || "_"}</p>
              </div>
            </div>
            <button
              className="text-white hover:text-gray-300"
              onClick={onClose}
            >
              <Close />
            </button>
          </div>

          <div className="my-[20px] h-[1px]">
            <MainBorder />
          </div>

          {/* Progress bar section */}
          <div className="mb-2 flex items-start gap-[60px] lg:gap-[47px] xl:gap-[60px] 2xl:gap-[60px] 3xl:gap-[60px]">
            <div className="h-[179px] w-[179px] flex-shrink-0 lg:h-[112px] lg:w-[112px] xl:h-[179px] xl:w-[179px] 2xl:h-[179px] 2xl:w-[179px] 3xl:h-[179px] 3xl:w-[179px]">
              <Image
                src={bulkCarrier}
                alt="Bulk Carrier"
                className="h-full w-full rounded-[9px] object-contain"
              />
            </div>

            <div className="ml-[-16px] flex flex-col">
              {/* City names with 8px gap below */}
              <div className="mb-[8px] mt-[8px] flex justify-between">
                <p className="ml-[-7px] font-alexandria text-[18px] font-normal uppercase text-white lg:text-[14px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                  {voyageData?.from || "_"}
                </p>
                <p className="font-alexandria text-[18px] uppercase text-white lg:text-[14px] xl:text-[18px] 2xl:text-[18px] 3xl:text-[18px]">
                  {voyageData?.to || "_"}
                </p>
              </div>

              {/* Progress Bar with 12px gap below */}
              <div className="relative mb-[36px] mt-[49px] h-[4px] w-[417px] lg:mb-[29px] lg:mt-[18px] lg:w-[321px] xl:mb-[36px] xl:mt-[49px] xl:w-[417px] 2xl:mb-[36px] 2xl:mt-[49px] 2xl:w-[417px] 3xl:mb-[36px] 3xl:mt-[49px] 3xl:w-[417px]">
                <div className="absolute left-0 right-0 top-0 h-full bg-[#D9D9D9]"></div>
                <div
                  className="absolute left-0 top-0 h-full bg-[#0085C9]"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                <div className="absolute left-0 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#0085C9]"></div>
                <div className="absolute right-0 top-1/2 h-[18px] w-[18px] -translate-y-1/2 translate-x-1/2 transform rounded-full bg-[#D9D9D9]"></div>
                <div
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                  style={{ left: `${progressPercentage}%` }}
                >
                  <div className="relative">
                    <Arrow />
                    <div className="absolute right-[12px] top-1/2 h-[3px] w-[12px] -translate-y-1/2 transform bg-[#0085C9]"></div>
                  </div>
                </div>
              </div>

              {/* ATD/ETA dates with proper alignment */}
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <p className="mb-[4px] ml-[-7px] font-alexandria text-[15px] font-normal uppercase text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                    ATD:
                  </p>
                  <p className="ml-[-7px] font-alexandria text-[15px] font-normal text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                    {voyageData?.ATD || "_"}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <p className="mb-[4px] font-alexandria text-[15px] font-normal uppercase text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                    ETA:
                  </p>
                  <p className="font-alexandria text-[15px] font-normal text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                    {voyageData?.ReportedETA || "_"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table section */}
          <div className="my-[10px] h-[1px] w-full lg:my-[5px] xl:my-[10px] 2xl:my-[10px] 3xl:my-[10px]">
            <BorderLine />
          </div>

          <div className="relative mb-[20px] mt-[15px] grid grid-cols-3 gap-4 text-center">
            {/* Vertical dividers */}
            <div className="absolute left-1/3 top-0">
              <VerticalBorder />
            </div>
            <div className="absolute left-2/3 top-0">
              <VerticalBorder />
            </div>

            {/* Table cells */}
            <div className="flex flex-col">
              <p className="font-alexandria text-[15px] font-semibold text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                Navigational Status
              </p>
              <div className="h-[1px] w-full py-4">
                <BorderLine />
              </div>
              <p className="font-alexandria text-[14px] font-normal text-white">
                {"_"}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="font-alexandria text-[15px] font-semibold text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                Speed/Course
              </p>
              <div className="my-[10px] h-[1px] w-full rounded-full" />
              <p className="py-2 font-alexandria text-[14px] font-normal text-white">
                {"_"} / {voyageData?.position.heading || "_"}°
              </p>
            </div>

            <div className="flex flex-col">
              <p className="font-alexandria text-[15px] font-semibold text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
                Draught
              </p>
              <div className="my-[10px] h-[1px] w-full rounded-full" />
              <p className="py-2 font-alexandria text-[14px] font-normal text-white">
                {"_"}
              </p>
            </div>
          </div>
          <div className="my-[6px] h-[1px] w-full">
            <BorderLine />
          </div>

          <div className="mt-4 w-full text-start lg:mt-[5px] xl:mt-4 2xl:mt-4 3xl:mt-4">
            <p className="font-alexandria text-[15px] font-light text-white lg:text-[12px] xl:text-[15px] 2xl:text-[15px] 3xl:text-[15px]">
              Last Data Received:{" "}
              {formatTimeDifference(voyageData?.time_info?.time_difference_seconds ?? null)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// MapPanHandler - only handles panning from list clicks
function MapPanHandler({
  position,
  zoomLevel,
  onZoomComplete
}: {
  position?: LatLngExpression | null;
  zoomLevel?: number | null;
  onZoomComplete?: () => void;
}) {
  const map = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (position && zoomLevel !== null) {
      map.flyTo(position, zoomLevel, {
        duration: 1,
        easeLinearity: 0.25
      }).once('moveend', () => {
        onZoomComplete?.();
      });
    }
  }, [position, zoomLevel, map, onZoomComplete]);

  return null;
}

function OfflineVesselList({
  className,
  onVesselSelect,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: {
  className?: string;
  onVesselSelect?: (vessel: { id: number; position: LatLngExpression }) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: "online" | "offline" | null;
  setStatusFilter: (status: "online" | "offline" | null) => void;
}) {
  const { data: vessels } = useGetAllVoyageCordsQuery();
  const [isOpen, setIsOpen] = useState(false);

  if (!vessels) {
    return <div className={className}>Loading vessels...</div>;
  }

  // Function to determine status based on time difference

  const getVesselStatus = (timeDiffSeconds: number | null) => {
    if (timeDiffSeconds === null) return "offline";
    const hoursDiff = timeDiffSeconds / 3600;
    return hoursDiff < time ? "online" : "offline";
  };

  // Filter vessels based on search term and status
  const filteredVessels = vessels?.filter(vessel => {
    // Filter by search term
    const matchesSearch = vessel.vessel_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    let matchesStatus = true;
    if (statusFilter) {
      const timeDiffSeconds = vessel.time_info?.time_difference_seconds;
      if (timeDiffSeconds === undefined || timeDiffSeconds === null) {
        matchesStatus = statusFilter === "offline";
      } else {
        const hoursDiff = timeDiffSeconds / 3600;
        const isOnline = hoursDiff < time;
        matchesStatus = statusFilter === "online" ? isOnline : !isOnline;
      }
    }
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div
      className={twMerge(
        "flex max-h-[90vh] min-w-[226px] flex-col gap-[10px] rounded-[9px] border-[1px] border-white/50 bg-[#1A1A1A] p-[15px] font-alexandria lg:min-w-[266px] lg:p-[12px] xl:min-w-[266px] xl:p-[15px] 2xl:min-w-[266px] 2xl:p-[15px] 3xl:min-w-[266px] 3xl:p-[15px]",
        className
      )}
    >

      {/* Search and Filter Bar */}
      <div className="relative ml-[-297px]">
        <SearchWithFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          status={statusFilter}
          setStatus={setStatusFilter}
          isOpen={isOpen}
          setIsOpen={setIsOpen} />
      </div>
      <div className="overflow-y-auto ml-[-6px]">
        {filteredVessels.length > 0 ? (
          filteredVessels.map(vessel => {
            const vesselName =
              vessel.vessel_name === vessel.vessel_name.toUpperCase()
                ? vessel.vessel_name
                : `${vessel.vessel_name.toUpperCase()}`;

            const status = getVesselStatus(
              vessel.time_info?.time_difference_seconds ?? null
            );
            const position = [
              vessel.data?.LAT ?? 0,
              vessel.data?.LONG ?? 0
            ] as LatLngExpression;

            return (
              <div
                key={vessel.vessel_id}
                className="flex cursor-pointer items-center gap-[13px] rounded p-2 hover:bg-white/10"
                onClick={() =>
                  onVesselSelect?.({
                    id: vessel.vessel_id,
                    position: position
                  })
                }
              >
                <div
                  className={`size-[19px] rounded-full border-[1px] border-white ${status === "online" ? "bg-[#15803D]" : "bg-[#B91C1C]"
                    }`}
                />
                <p className="font-alexandria text-[15px] uppercase leading-[100%] tracking-[0%] lg:text-[12px] xl:text-[14px] 2xl:text-[15px] 3xl:text-[15px]">
                  {vesselName}
                </p>
              </div>
            );
          })
        ) : (
          <div className="p-2 text-center text-gray-400">
            No vessels found..
          </div>
        )}
      </div>
    </div>
  );
}