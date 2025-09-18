import { useInfiniteQuery } from "@tanstack/react-query";
import { getRealtimeFuelMasterAlertsListApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { format } from "date-fns";
import { useFuelmasterAlertsStore } from "@/store/fulemaster-alerts-store";
import { useQueryState } from "nuqs";

export const getRealtimeFuelmasterListQueryKey = (
  ...rest: (string | number | Date)[]
): readonly [string, ...(string | number | Date)[]] => [
    "get-alarms-fuelmaster-realtime",
    ...rest
  ];

export const useRealtimeFuelmasterListQuery = ({ limit = 10, page = 1 }: { limit?: number; page?: number }) => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { from_date, to_date, sort } = useFuelmasterAlertsStore()
  const [search] = useQueryState("q")

  return useInfiniteQuery({
    queryKey: getRealtimeFuelmasterListQueryKey(
      token ?? "",
      vessel?.id ?? "",
      from_date ?? "",
      to_date ?? "",
      sort ?? "",
      limit ?? "",
      page ?? "",
      search ?? ""
    ),
    queryFn: () =>
      fetchRealtimeFuelmasterAlarmsList({ id: vessel?.id ?? null, from_date: from_date ?? null, to_date: to_date ?? null, sort, limit, page, search }, token),
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      if(lastPage.meta.currentPage >= lastPage.meta.totalPages) {
        return undefined;
      }
      return lastPage.meta.currentPage + 1;
    },
    enabled: !!token && !!vessel?.id && !!from_date && !!to_date
  });
};

const fetchRealtimeFuelmasterAlarmsList = async (
  {
    id,
    from_date,
    to_date,
    sort,
    limit,
    page,
    search
  }: { id: number | null; from_date: Date | null; to_date: Date | null, sort: string | null; limit: number; page: number; search: string | null },
  token: string | null
) => {
  if (!id) throw new Error("Vessel ID is required.");
  if (!token) throw new Error("Token is required.");
  if (!to_date) throw new Error("To Date is required.");
  if (!from_date) throw new Error("From Date is required.");
  if (from_date > to_date) throw new Error("Invalid Date range.");

  const res = await getRealtimeFuelMasterAlertsListApi(
    {
      id,
      from_date: format(from_date, "dd-MM-yyyy"),
      to_date: format(to_date, "dd-MM-yyyy"),
      sort,
      limit,
      page,
      search
    },
    token
  );
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }

  return {pages: data?.data ?? [], meta: data?.pagination ?? [] };
};
