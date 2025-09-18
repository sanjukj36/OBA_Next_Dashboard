import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ExampleWrapper from "./ExampleWrapper";
import XMLTableDataShow from "./XMLTableDataShow";

type Vessel = {
  id: string;
  name: string;
};

const ImportXML = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [vesselDetails] = useState<Vessel[]>([
    { id: "1", name: "Vessel 1" },
    { id: "2", name: "Vessel 2" }
  ]);
  const [selectedVesselId, setSelectedVesselId] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (fileUpload && selectedVesselId) {
      const formData = new FormData();
      formData.append("file", fileUpload);
      formData.append("VesselId", selectedVesselId);

      try {
        setIsOpen(true);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      alert("Please select a file and a vessel.");
    }
  };

  const handleVesselChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVesselId(e.target.value);
  };

  return (
    <div className="mt-10 space-y-6 rounded-xl bg-white p-6 shadow-sm">
      {/* Vessel Select */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="mb-4 flex">
          <label
            htmlFor="vessel-select"
            className="m-2 block text-sm font-medium text-gray-700"
          >
            Select Vessel:
          </label>
          <select
            id="vessel-select"
            value={selectedVesselId}
            onChange={handleVesselChange}
            className="w-60 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-black focus:outline-none focus:ring-2"
          >
            <option value="">-- Select Vessel --</option>
            {vesselDetails.map(vessel => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-center transition-all duration-200 hover:border-black hover:shadow-md sm:w-auto">
            <svg
              className="mb-2 h-8 w-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {fileName || "Click to Upload XML File"}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              className="hidden"
            />
          </label>

          <Button
            onClick={handleSubmit}
            className="w-full bg-black text-white transition-all duration-200 hover:bg-gray-800 sm:w-auto"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Display Table */}
      <XMLTableDataShow
        selectedVesselId={selectedVesselId}
        handleCancel={handleSubmit}
      />

      {/* Modal / Wrapper */}
      {isOpen && (
        <ExampleWrapper
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedVesselId={selectedVesselId}
        />
      )}
    </div>
  );
};

export default ImportXML;
