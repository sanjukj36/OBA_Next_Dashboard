import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Edit3Icon,
  Eye,
  Grid,
  List,
  Plus,
  Search,
  Trash2Icon,
  X
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteGeofenceApi, isActiveGeofenceApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import {
  getGeofencicngListQuery,
  useGeofencicngListQuery
} from "@/queries/use-geofencing-list";
import "leaflet/dist/leaflet.css";
import CoordsShow from "./coords_show";
import { tr } from "zod/v4/locales";

type Geofence = {
  id: string;
  name: string;
  location: string;
  radius: number; // in meters
  createdAt: string; // ISO string
  status: "Active" | "Inactive";
};

interface GeofencingListProps {
  geofences: Geofence[];
}

const GeofencingList: React.FC<GeofencingListProps> = ({}) => {
  const [uiView, setUIView] = useState<"list" | "card">("card");
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- modal state
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const {
    data: data,
    isLoading: loading,
    error: error
  } = useGeofencicngListQuery();

  return (
    <div className="flex flex-1 p-1">
      <div className="h-full w-full rounded-xl border-[11px] border-black px-7 pt-6 shadow-[0px_0px_9.6px_0px_rgba(255,255,255,0.50)]">
        <div className="flex items-center justify-between">
          {/* Search Button */}
          <div className="inline-flex w-[18%] items-center justify-start gap-5 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-10 py-1.5 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50">
            {/* <div className="h-4 w-4 shadow-[2px_3px_3.299999952316284px_0px_rgba(0,0,0,1.00)] outline outline-2 outline-offset-[-1px] outline-white" /> */}
            <Search className="h-5 w-5 text-white" />
            <div className="justify-start font-alexandria text-xs font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)] xl:text-lg 3xl:text-2xl">
              Search{" "}
            </div>
          </div>
          {/* End Search Button */}

          <div>
            <div className="flex items-center gap-4">
              {/* Switch list show design Button */}
              <div
                onClick={() => setUIView(uiView === "list" ? "card" : "list")}
                className="items-center justify-center rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2.5 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50"
              >
                {uiView === "list" ? (
                  <List
                    className="h-4 w-4 text-white 3xl:h-6 3xl:w-6"
                    stroke="currentColor"
                  />
                ) : (
                  <Grid
                    className="h-4 w-4 text-white 3xl:h-6 3xl:w-6"
                    stroke="currentColor"
                  />
                )}
              </div>
              {/* Switch list show design Button */}

              {/* View Alerts Button */}
              <div className="inline-flex items-center justify-start gap-3 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50">
                <Eye
                  className="h-4 w-4 text-white 3xl:h-6 3xl:w-6"
                  stroke="currentColor"
                />
                <div className="justify-start font-alexandria text-xs font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)] xl:text-lg 3xl:text-2xl">
                  View Alerts
                </div>
              </div>
              {/* View Alerts Button */}

              {/* Add Geofence Button */}
              <Link href={"/voyage/geofencing/geofencing-form"}>
                <div className="inline-flex items-center justify-start gap-3 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50">
                  <Plus
                    className="h-4 w-4 text-white 3xl:h-6 3xl:w-6"
                    stroke="currentColor"
                  />
                  <div className="justify-start font-alexandria text-xs font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)] xl:text-lg 3xl:text-2xl">
                    Add Geofence
                  </div>
                </div>
              </Link>
              {/* Add Geofence Button */}
            </div>
          </div>
        </div>
        <div className="mt-6 h-0 w-full rotate-180 outline outline-1 outline-offset-[-0.50px] outline-zinc-500"></div>

        {data?.length >= 1 && (
          <>
            {/* Card UI View */}
            {uiView === "card" && (
              <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-5">
                {data.map(item => (
                  <React.Fragment key={item.id}>
                    {selectedItem ? (
                      <MapModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                    ) : (
                      <DataShow
                        uiView={uiView}
                        key={item.id}
                        mainHead={item.name}
                        subHead={item.description}
                        status={item.isActive ? "Enabled" : "Disabled"}
                        id={item.id}
                        coordsArray={item.coordsArray}
                        priority={item.priority}
                        setSelectedItem={setSelectedItem}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {/* End Card UI View */}

            {/* List UI View */}
            {uiView === "list" && (
              <div className="flex-1 py-3">
                {data.map(item => (
                  <React.Fragment key={item.id}>
                    {selectedItem ? (
                      <MapModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

                    ) : (
                      <DataShow
                        uiView={uiView}
                        key={item.id}
                        mainHead={item.name}
                        subHead={item.description}
                        status={item.isActive ? "Enabled" : "Disabled"}
                        id={item.id}
                        coordsArray={item.coordsArray}
                        priority={item.priority}
                        setSelectedItem={setSelectedItem}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {/* End List UI View */}
          </>
        )}
      </div>
    </div>
  );
};

export default GeofencingList;

interface ShowDataProps {
  mainHead: string;
  subHead: string;
  status: string;
  id: number;
  uiView: string;
  coordsArray: [];
  priority: string;
}
const DataShow: React.FC<ShowDataProps> = ({
  uiView,
  mainHead,
  subHead,
  status,
  id,
  coordsArray,
  priority,
  setSelectedItem
}) => {
  const [isOn, setIsOn] = useState(status === "Enabled");
  // const [isModalOpen, setIsModalOpen] = useState(false); // <-- modal state

  const { token } = useAuth();
  const queryClient = useQueryClient();

  const handleIsActive = async ({
    id,
    isActive
  }: {
    id: number;
    isActive: boolean;
  }) => {
    if (!id || !token) return; // <-- fixed condition
    try {
      const response = await isActiveGeofenceApi({ id, isActive }, token);
      if (response.status === 200 && response.data.success) {
        setIsOn(isActive);
        toast.success(`Its ${isActive ? `Enabled` : `Disabled`}`);
        queryClient.invalidateQueries({
          queryKey: getGeofencicngListQuery()
        });
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting geofence");
    }
  };

  const _onDeleted = async () => {
    if (!id || !token) return; // <-- fixed condition
    try {
      const response = await deleteGeofenceApi({ id }, token);
      if (response.status === 200 && response.data.success) {
        toast.success("Deleted coordinate");
        queryClient.invalidateQueries({
          queryKey: getGeofencicngListQuery()
        });
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting geofence");
    }
  };

  return (
    <>
      {uiView === "card" && (
        <div className="h-[258px] w-full xl:h-[371px] 3xl:h-[440px]">
          <div
            className={`h-full w-full rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 transition-all duration-300`}
          >
            {/* Image + Content */}
            <div
              onClick={
                () => setSelectedItem({ id, coordsArray, priority }) // pass whole item data
              }
              className={`m-3 h-[131px] w-[148px] rounded-2xl pt-3 xl:h-[210px] xl:w-[198px] 3xl:h-[277px] 3xl:w-[322px] ${!isOn ? "opacity-50 grayscale" : ""}`}
            >
              <CoordsShow
                coordsArray={coordsArray}
                priority={priority}
                uiView={uiView}
              />
            </div>

            <div className={`px-5 ${!isOn ? "opacity-50 grayscale" : ""}`}>
              {/* Heading */}
              <div
                className={`font-alexandria text-xs font-normal xl:text-lg 3xl:text-2xl ${
                  isOn ? "text-white" : "text-gray-400"
                }`}
              >
                {mainHead}
              </div>
              <div
                className={`mt-1 font-alexandria text-[10px] font-light xl:text-sm 3xl:text-lg ${
                  isOn ? "text-slate-300" : "text-gray-500"
                }`}
              >
                {subHead}
              </div>
              {/* End Heading */}

              {/* View Button */}
              <div
                className={`mt-3 flex items-center ${!isOn ? "cursor-not-allowed opacity-50 grayscale" : ""}`}
              >
                {/* <div className="flex-1"></div> */}
                {/* <button
                  disabled={!isOn}
                  className={`${isOn ? "" : "cursor-not-allowed"} ml-auto inline-flex items-center gap-2 rounded-[8px] px-2 py-1 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] transition-all duration-300`}
                >
                  <Eye
                    className={`h-5 w-5 ${isOn ? "text-white" : "text-gray-400"}`}
                  />
                  <div className="font-alexandria text-xl font-normal">
                    View
                  </div>
                </button> */}
              </div>
              {/* End View Button */}

              {/* Divider */}
              <div className="mt-3 h-0 rotate-180 opacity-50 outline outline-1 outline-offset-[-0.5px] outline-zinc-500" />
            </div>

            {/* Bottom Controls (Toggle stays full opacity always) */}
            <div className="flex items-center justify-between px-5 pt-5">
              <ToggleButton
                isOn={isOn}
                id={id}
                handleIsActive={handleIsActive}
              />
              <div className="flex">
                <Edit3Icon
                  onClick={() => console.log({ id })}
                  className={`ml-6 h-4 w-4 3xl:h-6 3xl:w-6 ${
                    isOn
                      ? "cursor-pointer text-white transition hover:text-green-900"
                      : "cursor-not-allowed text-gray-400 opacity-50"
                  }`}
                />
                <Trash2Icon
                  onClick={() => _onDeleted()}
                  className={`ml-5 h-4 w-4 3xl:h-6 3xl:w-6 ${
                    isOn
                      ? "cursor-pointer text-white transition hover:text-red-500"
                      : "cursor-not-allowed text-gray-400 opacity-50"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {uiView === "list" && (
        <div className="relative my-4 flex h-20 w-full items-center rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 shadow-lg">
          {/* Image */}

          <div
            onClick={() => setSelectedItem({ id, coordsArray, priority })}
            className={`pt- m-2 h-[69px] w-[239px] ${!isOn ? "opacity-50 grayscale" : ""}`}
          >
            <CoordsShow
              coordsArray={coordsArray}
              priority={priority}
              uiView={uiView}
            />
          </div>

          {/* Text Content */}
          <div className="ml-6 flex flex-col justify-center">
            <div
              className={`font-alexandria text-xs font-normal xl:text-lg 3xl:text-2xl ${
                isOn ? "text-white" : "text-gray-400"
              }`}
            >
              {mainHead}
            </div>
            <div
              className={`font-alexandria text-[10px] font-light xl:text-sm 3xl:text-lg ${
                isOn ? "text-slate-300" : "text-gray-500"
              }`}
            >
              {subHead}
            </div>
          </div>

          {/* View Button */}
          {/* <button
            disabled={!isOn}
            className={`ml-auto flex items-center gap-2 rounded bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-1 text-lg font-normal shadow-md outline outline-1 outline-zinc-600 transition ${
              isOn
                ? "text-white hover:scale-105"
                : "cursor-not-allowed text-gray-500 opacity-50"
            }`}
          >
            <Eye className="h-5 w-5" />
            View
          </button> */}

          {/* Divider */}
          <div className="mx-6 ml-auto h-10 w-px bg-zinc-600 opacity-50" />

          {/* Toggle */}
          <div>
            <ToggleButton isOn={isOn} id={id} handleIsActive={handleIsActive} />
          </div>

          <Edit3Icon
            onClick={() => console.log({ id })}
            className={`ml-6 h-4 w-4 3xl:h-6 3xl:w-6 ${
              isOn
                ? "cursor-pointer text-white transition hover:text-green-900"
                : "cursor-not-allowed text-gray-400 opacity-50"
            }`}
          />

          {/* Trash */}
          <Trash2Icon
            onClick={() => _onDeleted()}
            className={`ml-5 h-4 w-4 3xl:h-6 3xl:w-6 ${
              isOn
                ? "cursor-pointer text-white transition hover:text-red-500"
                : "cursor-not-allowed text-gray-400 opacity-50"
            }`}
          />
        </div>
      )}
      
    </>
  );
};

interface ToggleButtonProps {
  isOn: boolean;
  id: number;
  handleIsActive: (params: { id: number; isActive: boolean }) => Promise<void>;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  id,
  handleIsActive
}) => {
  const isActive = !isOn;

  const handleClick = () => {
    handleIsActive({ id, isActive });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Switch */}
      <div
        onClick={handleClick}
        className="relative h-3 w-5 cursor-pointer rounded-xl bg-stone-900 outline outline-1 outline-stone-300 3xl:h-6 3xl:w-11"
      >
        <div
          className={`absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full border border-white bg-white transition-transform duration-300 3xl:h-4 3xl:w-4 ${
            isOn
              ? "translate-x-3 3xl:translate-x-6"
              : "translate-x-0/2 3xl:translate-x-1"
          }`}
        />
      </div>

      {/* Label */}
      <div
        className={`font-alexandria text-[10px] font-light xl:text-sm 3xl:text-lg ${
          isOn ? "text-lime-600" : "text-red-600"
        }`}
      >
        {isOn ? "Enabled" : "Disabled"}
      </div>
    </div>
  );
};


interface MapModalProps {
  selectedItem: {
    coordsArray: { lat: number; lng: number }[];
    priority: string;
  } | null;
  setSelectedItem: (item: {coordsArray: { lat: number; lng: number }[];
    priority: string;}) => void;
}

const MapModal: React.FC<MapModalProps> = ({ selectedItem, setSelectedItem }) => {
  if (!selectedItem) return null; // ✅ Don't render if no item selected

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setSelectedItem(null)}
    >
      <div
        className="relative rounded-2xl p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedItem(null)}
          className="absolute right-0 top-0 z-[9999] text-white hover:text-red-500"
        >
          <X className="m-4 h-6 w-6" />
        </button>

        {/* Map inside modal */}
        <div className="relative h-[600px] w-[1000px] overflow-hidden rounded-xl bg-zinc-900">
          <CoordsShow
            coordsArray={selectedItem.coordsArray}
            priority={selectedItem.priority}
            uiView="card"
            isModel={true}
          />
        </div>
      </div>
    </div>
  );
};


