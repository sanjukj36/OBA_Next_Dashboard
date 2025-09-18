import { useQuery } from "@tanstack/react-query";
import { getAlarmsListApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

export const getAlarmsListQueryKey = (
  ...rest: (string | boolean)[]
): readonly [string, ...(string | boolean)[]] => ["get-alarms-list-sdfdsfdsf", ...rest];

export const useAlarmsListQuery = ({
  // id,
  page = 1,
  limit = 10,
  from_date,
  to_date,
  sort = "desc",
  enabled 
}: {
  // id: number;
  from_date: string;
  to_date: string;
  sort: string | "asc" | "desc";
  page: number;
  limit: number;
  enabled:boolean;
}) => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useQuery({
    queryKey: getAlarmsListQueryKey(
      String(vessel?.id) ?? "",
      String(sort),
      String(to_date),
      String(from_date),
      String(page),
      String(limit),
      String(token),
      enabled
    ),
    queryFn: () =>
      fetchAlarmsList(
        vessel?.id ?? null,
        from_date,
        to_date,
        sort === "asc" ? "asc" : "desc",
        page,
        limit,
        token
      ),
    enabled: !!vessel?.id && !!from_date && !!to_date && !!token && !!enabled // only run if ID and token are available
    // staleTime: 1000 * 60, // cache for 1 minute
  });
};

const fetchAlarmsList = async (
  id: number | null,
  from_date: string,
  to_date: string,
  sort: "asc" | "desc",
  page: number,
  limit: number,
  token: string | null
) => {
  if (!id) throw new Error("Vessel ID is required.");
  if (!token) throw new Error("Token is required.");
  if (!to_date) throw new Error("To Date is required.");
  if (!from_date) throw new Error("From Date is required.");

  const res = await getAlarmsListApi(
    id,
    from_date,
    to_date,
    sort,
    page,
    limit,
    token
  );
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }

  return data.data;
};
