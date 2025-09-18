import React, { useState } from "react";
import { ArrowLeftIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRegisterGeofenceMutation } from "@/mutations/use-register-geofence-mutation";
import MapComponent from "./map-component";

interface GeofenceData {
  id?: string;
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  alert_send: boolean;
  fence_type: "Permitted" | "Restricted" | "Custom";
  coords_array: { lat: number; lng: number }[];
}

interface GeofencingFormProps {
  initialData?: GeofenceData; // if provided → Edit mode
}

export default function GeofencingForm({ initialData }: GeofencingFormProps) {
  const [title, setTitle] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    initialData?.priority || "Low"
  );
  const [selectedZone, setSelectedZone] = useState<
    "Permitted" | "Restricted" | "Custom"
  >(initialData?.fence_type || "Permitted");
  const [isAlertsNotificationOn, setIsAlertsNotificationOn] = useState(
    initialData?.alert_send ?? true
  );
  const [coordsArray, setCoordsArray] = useState<
    { lat: number; lng: number }[]
  >(initialData?.coords_array || []);

  const { mutate: registerGeofence } = useRegisterGeofenceMutation();

  // Reset handler
  const handleReset = () => {
    setTitle(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPriority(initialData?.priority || "Low");
    setSelectedZone(initialData?.fence_type || "Permitted");
    setIsAlertsNotificationOn(initialData?.alert_send ?? true);
    // setCoordsArray(initialData?.coords_array || []);
  };

  // Submit handler (Create / Update)
  const handleSubmit = () => {
    const payload: GeofenceData = {
      // id: initialData?.id,
      name: title,
      description,
      priority,
      alert_send: isAlertsNotificationOn,
      fence_type: selectedZone,
      coords_array: coordsArray || [] 
    };

    if (title.trim() === "") {
      toast.error("Title is required");
      return;
    }
    if (description.trim() === "") {
      toast.error("Description is required");
      return;
    }
    if (coordsArray.length === 0) {
      toast.error("Please draw the geofence area on the map");
      return;
    }

    registerGeofence(payload, {
      onSuccess: () => {
        toast.success("Geofence saved successfully");
        handleReset(); 
      },
      onError: () => {
        toast.error("Something went wrong while saving");
      }
    });
  };

  return (
    <div className="flex flex-1 p-1">
      <div className="h-full w-full rounded-xl border-[11px] border-black shadow-[0px_0px_9.6px_0px_rgba(255,255,255,0.50)]">
        <div className="flex h-full gap-2">
          {/* LEFT PANEL */}
          <div className="w-[27.64%] rounded-xl bg-gradient-to-r from-[#1B1B1B] to-[#2F2F2F] px-[23px] shadow-[0px_0px_9.6px_0px_rgba(255,255,255,0.50)]">
            <div className="mt-5 flex items-center gap-2">
              <Link href={"/voyage/geofencing"}>
                <ArrowLeftIcon className="m-2 h-6 w-6 text-white" />
              </Link>
              <span className="font-alexandria text-2xl text-white">
                {initialData ? "Edit Geofence" : "Add Geofence"}
              </span>
            </div>

            {/* Zone Selection */}
            <div className="mt-[36px] h-[64px] w-full">
              <ZoneRadioButton
                selected={selectedZone}
                setSelected={setSelectedZone}
              />
            </div>

            {/* Title */}
            <div className="mt-5">
              <span className="font-alexandria text-2xl">Title</span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter title"
                className="h-16 w-full rounded-[10px] bg-gradient-to-l from-black to-zinc-600 px-4 text-white opacity-90 shadow-[0px_4px_4px_0px_rgba(0,0,0,1.00)] outline-none focus:opacity-100"
              />
            </div>

            {/* Description */}
            <div className="mt-5">
              <span className="font-alexandria text-2xl">Description</span>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter description..."
                rows={4}
                className="w-full resize-y rounded-[10px] bg-gradient-to-l from-black to-zinc-600 px-4 py-3 text-white opacity-80 shadow-[0px_4px_4px_0px_rgba(0,0,0,1.00)] outline-none focus:opacity-100"
              />
            </div>

            {/* Custom Parameter */}
            {selectedZone === "Custom" && (
              <div className="mt-5 h-[64px] w-full">
                <span className="font-alexandria text-2xl">Parameter</span>
                <CustomInputBox />
              </div>
            )}

            {/* Priority */}
            <div className="mt-5 h-[64px] w-full">
              <span className="font-alexandria text-2xl">Priority</span>
              <PriorityRadioButton
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            {/* Alerts Toggle */}
            <div className="mt-[80px]">
              <div className="flex h-[64px] w-full items-center justify-between rounded-[10px] bg-gradient-to-l from-black to-zinc-600 px-4 py-3 text-white opacity-80 shadow-[0px_4px_4px_0px_rgba(0,0,0,1.00)]">
                <span>Set Alerts By Notification</span>
                <div
                  onClick={() =>
                    setIsAlertsNotificationOn(!isAlertsNotificationOn)
                  }
                  className={`relative h-6 w-11 cursor-pointer rounded-xl outline outline-1 outline-stone-300 ${
                    isAlertsNotificationOn ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white bg-white transition-transform duration-300 ${
                      isAlertsNotificationOn ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mb-[20px] mt-[60px] flex justify-between">
              <button
                className="inline-flex items-center justify-start gap-3 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50"
                onClick={handleReset}
              >
                {/* <Reste className="h-6 w-6 text-white" stroke="currentColor" /> */}
                <div className="justify-start font-alexandria text-xl font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]">
                  X Cancel{" "}
                </div>
              </button>
              <button
                className="inline-flex items-center justify-start gap-3 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50"
                onClick={handleReset}
              >
                {/* <Reste className="h-6 w-6 text-white" stroke="currentColor" /> */}
                <div className="justify-start font-alexandria text-xl font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]">
                  @ Reset{" "}
                </div>
              </button>
              <button
                className="inline-flex items-center justify-start gap-3 rounded-[10px] bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2 shadow-[3px_4px_8px_3px_rgba(0,0,0,1.00)] outline outline-1 outline-offset-[-0.50px] outline-white/50"
                onClick={handleSubmit}
              >
                <div className="justify-start font-alexandria text-xl font-normal text-white [text-shadow:_2px_3px_8px_rgb(0_0_0_/_1.00)]">
                  # Save
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL (MAP PLACEHOLDER) */}
          <div className="h-full w-[72.36%] rounded-xl">
            <MapComponent
              coordsArray={coordsArray}
              onCoordsChange={setCoordsArray}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomInputBox: React.FC = () => (
  <div className="flex h-16 w-96 items-center gap-3 rounded-[10px] bg-gradient-to-l from-black to-zinc-600 px-2 opacity-40 shadow-[0px_4px_4px_rgba(0,0,0,1.00)]">
    <div className="flex h-12 flex-1 items-center justify-between rounded-md bg-gradient-to-l from-black to-zinc-600 px-3 opacity-40">
      <span className="font-alexandria text-sm text-white"></span>
      <ChevronDown size={18} className="text-white" />
    </div>
    <div className="h-12 w-24 rounded-md border border-white bg-black opacity-50" />
    <div className="font-alexandria text-xs text-white">1 - 100</div>
  </div>
);

const ZoneRadioButton: React.FC<{
  selected: string;
  setSelected: (v: string) => void;
}> = ({ selected, setSelected }) => {
  const options = ["Permitted", "Restricted", "Custom"];
  return (
    <div className="flex h-full w-full items-center rounded-[10px] bg-gradient-to-br from-[#2F2F2F] to-[#1B1B1B] px-6 font-alexandria text-white opacity-90">
      <div className="flex w-full items-center justify-between">
        {options.map((option, index) => (
          <React.Fragment key={option}>
            <div
              onClick={() => setSelected(option as string)}
              className="flex cursor-pointer flex-col items-center px-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected === option ? "border-white" : "border-zinc-400"
                  }`}
                >
                  {selected === option && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`${selected === option ? "text-white" : "text-gray-400"}`}
                >
                  {option}
                </span>
              </div>
              {selected === option && (
                <div className="mt-1 h-0.5 w-20 rounded-lg bg-zinc-600" />
              )}
            </div>
            {index < options.length - 1 && (
              <div className="h-8 w-px bg-zinc-500 opacity-70" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const PriorityRadioButton: React.FC<{
  selected: string;
  setSelected: (v: any) => void;
}> = ({ selected, setSelected }) => {
  const options = [
    { label: "Low", border: "border-green-500", fill: "bg-green-500" },
    { label: "Medium", border: "border-yellow-500", fill: "bg-yellow-500" },
    { label: "High", border: "border-red-500", fill: "bg-red-500" }
  ];

  return (
    <div className="flex h-full w-full items-center rounded-[10px] bg-gradient-to-br from-[#2F2F2F] to-[#1B1B1B] px-6 font-alexandria text-white opacity-90">
      <div className="flex w-full items-center justify-between">
        {options.map(option => (
          <div
            key={option.label}
            onClick={() => setSelected(option.label)}
            className="flex cursor-pointer flex-col items-center px-2"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${option.border}`}
              >
                {selected === option.label && (
                  <div className={`h-2.5 w-2.5 rounded-full ${option.fill}`} />
                )}
              </div>
              <span
                className={`${selected === option.label ? "text-white" : "text-gray-400"}`}
              >
                {option.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
