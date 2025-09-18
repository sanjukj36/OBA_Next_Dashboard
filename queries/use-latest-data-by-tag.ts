import { useQuery } from "@tanstack/react-query";
import { getLatestDataByTag } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import {
  LatestDataByTag,
  LatestDataByTagFromResponse
} from "@/types/latest-data-by-tag";

const dto = <T extends LatestDataByTagFromResponse>(
  data: T
): LatestDataByTag => {
  return {
    value: data.value,
    min: data.tag_obj.min,
    max: data.tag_obj.max,
    description: data.tag_obj.description,
    datatype: data.tag_obj.datatype,
    tag_from_vessel: data.tag_obj.tag_from_vessel,
    unit: data.tag_obj.unit
  };
};

const fetchLatestDataByTag = async (
  token: string | null,
  { id, tag }: { id?: number; tag: string }
) => {
  if (!token) throw new Error("Token not provided.");
  if (!id) throw new Error("Vessel not provided.");

  const res = await getLatestDataByTag(token, { id, tag });
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }
  const dtoData = dto(data.data);
  return dtoData;
};

export const useLatestDataByTag = (tag: string) => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: ["latestData", tag],
    queryFn: () => fetchLatestDataByTag(token, { id: vessel?.id, tag }),
    enabled: !!token && !!vessel,
    staleTime: 0,
    refetchInterval: 60 * 1000, // ← Revalidate every 10 seconds
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
};
