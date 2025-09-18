import { useQuery } from "@tanstack/react-query";
import { getGeofenceList } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

export const getGeofencicngListQuery = (
  ...rest: (string | boolean)[]
): readonly [string, ...(string | boolean)[]] => [
  "get-geofencing-list",
  ...rest
];

export const useGeofencicngListQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useQuery({
    queryKey: getGeofencicngListQuery(String(vessel?.id) ?? "", String(token)),
    queryFn: () => fetchGeofencicngList(vessel?.id ?? null, token),
    enabled: !!vessel?.id && !!token // only run if ID and token are available
    // staleTime: 1000 * 60, // cache for 1 minute
  });
};

const fetchGeofencicngList = async (
  id: number | null,
  token: string | null
) => {
  if (!id) throw new Error("Vessel ID is required.");
  if (!token) throw new Error("Token is required.");

  const res = await getGeofenceList(id, token);
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }
  const resData = data.data;
  // ✅ Sort by id in descending order
  const sortedData = [...resData].sort((a, b) => b.id - a.id);

  return sortedData;
  return data.data
};
