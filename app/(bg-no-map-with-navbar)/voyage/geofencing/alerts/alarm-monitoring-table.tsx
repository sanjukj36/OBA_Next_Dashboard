import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAcknowledgeGeofenceMutation } from "@/mutations/use-geofence-acknowledge-mutation";
import { useGetAllGeofenceAlertsQuery } from "@/queries/use-get-geofence-alerts-query";
import { AlarmDataTable } from "./data-table";

export type GeofencingAlertItems = {
  id: number;
  fk_geofencepolygon: number;
  vesselTime: Date;
  coordsArray: {
    lat: number;
    lng: number;
  };
  geofencearray: {
    lat: number;
    lng: number;
  }[];
  vessel: string;
};

export const AlarmMonitoringTable = () => {
  const { data, isLoading } = useGetAllGeofenceAlertsQuery();
  const { mutate: acknowledge } = useAcknowledgeGeofenceMutation();

  const columns: ColumnDef<GeofencingAlertItems>[] = useMemo(
    () => [
      {
        accessorKey: "vessel",
        header: () => (
          <div className="max-w-[300px] text-center text-white">
            Vessel Name
          </div>
        ),
        cell: ({ row }) => row.getValue("vessel")
      },
      {
        accessorKey: "vesselTime",
        header: () => (
          <div className="min-w-[200px] text-center text-white">Parameters</div>
        ),
        cell: ({ row }) => {
          const dateStr = row.getValue<Date>("vesselTime");
          if (!dateStr) return "";
          const formatted = format(new Date(dateStr), "PPpp");
          return formatted;
        }
      },
      {
        accessorKey: "coordsArray",
        header: () => (
          <div className="min-w-[200px] text-center text-white">Value</div>
        ),
        cell: ({ row }) => {
          const cords = row.getValue<{ lat: number; lng: number }>(
            "coordsArray"
          );
          return `LAT: ${cords?.lat ?? "__"}, LONG: ${cords?.lng ?? "__"}`;
        }
      },
      {
        id: "acknowledge",
        header: () => (
          <div className="min-w-[150px] text-center text-white">
            Acknowledge
          </div>
        ),
        cell: ({ row }) => {
          const id = row.original.id; // assuming each row has a unique `id`
          return <Badge onClick={() => acknowledge({ id })}>Acknowledge</Badge>;
        }
      }
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-4 px-4 py-6 font-alexandria"
      style={{
        position: 'relative',
        isolation: 'isolate'
      }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/bgdisco.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          zIndex: -1,
          content: '""'
        }}
      />
      <div className="relative text-center">
        <div className="flex items-center justify-start gap-x-[388px] font-russo text-3xl text-input">
          <h2 className="ms-2 font-russo text-3xl uppercase text-input">
            Geofencing Alerts
          </h2>
        </div>
      </div>
      <div className="mx-auto w-[1480px] rounded-[25px] border-[2px] border-white/20 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-[5px]">
        {/* Middle layer: gradient background */}
        <div
          className="rounded-[23px] p-[1px]"
          style={{
            backgroundImage:
              "linear-gradient( to bottom, rgba(204, 204, 204, 0.8) 0%, #515151 25%, #CCCCCC 50%, #515151 75%, #CCCCCC 100%)"
          }}
        >
          {/* White/60 border with spacing- */}
          <div className="rounded-[14px] border-[1px] border-white/60 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-[5px] font-alexandria">
            {/* Inner Content */}
            <div className="rounded-[14px] border-[1px] border-white/30 bg-gradient-to-r from-[#0C0C0C] to-[#0C0C0C] p-10">
              {/* Table */}
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : data ? (
                <div className="mt-2">
                  <AlarmDataTable columns={columns} data={data} />
                </div>
              ) : (
                <p>No Date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
