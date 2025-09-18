import { useQuery } from "@tanstack/react-query";
import { getMLAlarmAnalyticsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";

export const getMLAlarmAnalyticsQueryKey = (
  ...rest: (string | number)[]
): readonly [string, ...(string | number)[]] => [
  "get-ml-alarm-analytics",
  ...rest
];

export const useMLAlarmAnalyticsQuery = ({
  id,
  tag,
  date
  // from_date,
  // to_date
  
}: {
  id: number;
  // from_date: string;
  date: string;
  // to_date: string;
  tag: string;
}) => {
  const { token } = useAuth();
  // const { vessel } = useVesselSelectionStore();
//   const intialMount =useRef(true)
//   useEffect(() =>{
//     if(intialMount.current){ 
//       intialMount.current=false
//     }
// },[])

  return useQuery({
    // queryKey: getMLAlarmAnalyticsQueryKey(id, from_date, to_date, tag,token?? ""),
    queryKey: getMLAlarmAnalyticsQueryKey(id, date, tag,token?? ""),
    queryFn: ({ signal }) =>
      fetchMLAlarmsAnalyticsDetails(
        id ?? null,
        date,
        // from_date,
        // to_date,
        tag,
        token,
        signal
      ),
    refetchOnWindowFocus: true,
    // refetchOnMount:intialMount.current,
    // enabled: !!id && !!from_date && !!to_date && !!token // only run if ID and token are available
    enabled: !!id && !!date && !!token // only run if ID and token are available
    // staleTime: 1000 * 60, // cache for 1 minute
  });
};

export const fetchMLAlarmsAnalyticsDetails = async (
  id: number | null,
  // from_date: string,
  // to_date: string,
  date: string,
  tag: string,
  token: string | null,
  signal: AbortSignal
) => {
  if (!id) throw new Error("Tag ID is required.");
  if (!token) throw new Error("Token is required.");
  if (!date) throw new Error("Date is required.");
  // if (!to_date) throw new Error("To Date is required.");
  // if (!from_date) throw new Error("From Date is required.");

  const res = await getMLAlarmAnalyticsApi(
    id,
    // from_date,
    // to_date,
    date,
    tag,
    token,
    signal
  );
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }

  return data;
};
