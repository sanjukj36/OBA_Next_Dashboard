import { useQuery } from "@tanstack/react-query";
import { getVoyageCordsApi } from "@/lib/api";
import { App } from "@/lib/constants";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchAllVoyageCords = async (token: string | null) => {
  if (!token) throw new Error("Token not found.");
  const res = await getVoyageCordsApi(token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
};

export const getVoyageCordsQueryKey = (...rest: string[]) => [
  "get-voyage-cords-query",
  ...rest
];

export const useGetAllVoyageCordsQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: getVoyageCordsQueryKey(vessel?.imo ?? "", token ?? ""),
    queryFn: () => fetchAllVoyageCords(token),
    enabled: !!token,
    staleTime: 0,
    refetchInterval: App.RefetchInterval,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
};
