import { useQuery } from "@tanstack/react-query";
import { getVoyageDetails } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { VoyageDetailsData, VoyageDetailsItem } from "@/types/voyage-details";

const voyageDto = (data: VoyageDetailsData): VoyageDetailsItem => {
  return {
    id: data.vessel_id,
    vessel_name: data.vessel_name,
    vessel_type: data.vessel_type,
    label: data.vessel_name,
    value: data.vessel_name,
    imo: data.imo,
    fleet: data.fleet,
    company: data.company,
    flag: data.flag,
    from: data.from,
    to: data.to,
    ATD: data.ATD,
    ReportedETA: data.ReportedETA,
    position: {
      lat: data.data.LAT,
      long: data.data.LONG,
      heading: data.data.HDG
    },
    time_info: data.time_info
      ? {
          readable_utc: data.time_info.readable_utc,
          time_difference_seconds:data.time_info.time_difference_seconds
        }
      : undefined
  };
};

// Fetch function
const fetchVoyageDetail = async (
  params: { id: number },
  token: string | null
) => {
  if (!token) throw new Error("Token not provided.");
  const res = await getVoyageDetails(params, token);
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }

  return voyageDto(data.data);
};

// React Query hook
export const useVoyageDetailsQuery = (voyageId: number) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["voyageDetails", voyageId],
    queryFn: () => fetchVoyageDetail({ id: voyageId }, token),
    enabled: !!token && !!voyageId
  });
};
