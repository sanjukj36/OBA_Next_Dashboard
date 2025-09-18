import { useQuery } from "@tanstack/react-query";
import { getGeofenceAlertsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchAllGeofenceAlerts = async (
  params: { id: number | null },
  token: string | null
) => {
  const { id } = params;
  if (!id || id === null) throw new Error("Vessel not found.");
  if (!token) throw new Error("Token not found.");
  const res = await getGeofenceAlertsApi({ id }, token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
};

export const getGeofenceAlertsQueryKey = (
  ...rest: string[]
): readonly [string, ...string[]] => ["get-geofence-alerts-query", ...rest];

export const useGetAllGeofenceAlertsQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: getGeofenceAlertsQueryKey(vessel?.imo ?? "", token ?? ""),
    queryFn: () => fetchAllGeofenceAlerts({ id: vessel?.id ?? null }, token),
    enabled: !!token
  });
};
