import { useQuery } from "@tanstack/react-query";
import { getTrend } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { ChartDataItem, TrendResponse } from "@/types/trend";

const dto = <T extends TrendResponse>(data: T) => {
  const dtoTrend = data.data.map(item => {
    return {
      time: item.time,
      value1: item.value1,
      value2: item.value2,
      value3: item.value3,
      value4: item.value4
    } as ChartDataItem;
  });
  return { trend: dtoTrend };
};

const fetchTrend = async (
  token: string | null,
  {
    id,
    from_date,
    to_date,
    tag1,
    tag2,
    tag3,
    tag4
  }: {
    from_date: string;
    to_date: string;
    id?: number;
    tag1: string;
    tag2?: string;
    tag3?: string;
    tag4?: string;
  }
) => {
  if (!token) throw new Error("Token not provided.");
  if (!id) throw new Error("Vessel not provided.");
  if (!tag1) throw new Error("Tags not provided.");

  const res = await getTrend(token, {
    id,
    tag1,
    from_date,
    to_date,
    tag2,
    tag3,
    tag4
  });
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }
  const dtoData = dto(data.data);
  return dtoData;
};

export const useTrend = ({
  tag1,
  tag2,
  tag3,
  tag4,
  from_date,
  to_date
}: {
  from_date: string;
  to_date: string;
  tag1: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
}) => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: ["trend-data", tag1, tag2, tag3, tag4, from_date, to_date],
    queryFn: () =>
      fetchTrend(token, {
        from_date,
        to_date,
        id: vessel?.id,
        tag1,
        tag2,
        tag3,
        tag4
      }),
    enabled: !!token && !!vessel && !!from_date && !!to_date && !!tag1,
    staleTime: 0,
    refetchInterval: 60 * 1000, // ← Revalidate every 10 seconds
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
};
