import { useQuery } from "@tanstack/react-query";
import { getGeofenceCordsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchAllGeofenceCords = async (
  id: number | null,
  token: string | null
) => {
  if (!id) throw new Error("Vessel not found.");
  if (!token) throw new Error("Token not found.");
  const res = await getGeofenceCordsApi(id, token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
};

export const getGeofenceCordsQueryKey = (
  ...rest: string[]
): readonly [string, ...string[]] => ["get-geofence-cords-query", ...rest];

export const useGetAllGeofenceCordsQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: getGeofenceCordsQueryKey(vessel?.imo ?? "", token ?? ""),
    queryFn: () => fetchAllGeofenceCords(vessel?.id ?? null, token),
    enabled: !!token
  });
};
