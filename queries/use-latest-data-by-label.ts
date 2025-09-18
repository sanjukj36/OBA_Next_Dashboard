import { useQuery } from "@tanstack/react-query";
import { getLatestValueByLabelApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchLatestDataByTag = async <T = undefined, D = undefined>(
  token: string | null,
  { id, label }: { id?: number; label: string },
  signal: AbortSignal
) => {
  // if (!token) throw new Error("Token not provided.");
  // if (!id) throw new Error("Vessel not provided.");

  const res = await getLatestValueByLabelApi<T, D>({ id, label }, token, signal);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }
  const dtoData = data.data;
  return dtoData;
};

export const getLatestDataByLabelQueryKey = (...label: (string | number)[]) => [
  "latest-data-by-label",
  ...label
];

export const useLatestDataByLabel = <T = undefined, D = undefined>(
  label: string
) => {
  // const { token } = useAuth();
  const { token } = "SSS";
  // const { vessel } = useVesselSelectionStore();
  const { vessel } = { id: 111111 };
  return useQuery({
    queryKey: getLatestDataByLabelQueryKey(
      label,
      vessel?.id ?? "",
      token ?? ""
    ),
    queryFn: ({ signal }) => fetchLatestDataByTag<T, D>(token, { id: vessel?.id, label }, signal),
    // enabled: !!token && !!vessel,
    staleTime: 0,
    refetchInterval: 60 * 1000, // ← Revalidate every 10 seconds
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

};
