import { useQuery } from "@tanstack/react-query";
import { getSingleAlarmsDetailsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";


export const getSingleAlarmsDetailsQueryKey = (...rest: (string | number)[]): readonly[string, ...(string | number)[]] => [
  "get-single-alerts-details",
  ...rest
];

export const useSingleAlarmsDetailsQuery = ({ id }: { id: number }) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: getSingleAlarmsDetailsQueryKey(id,token?? ""),
    queryFn: ({signal}) => fetchSingleAlarmsDetails(id,token,signal),
    enabled: !!id && !!token, // only run if ID and token are available
  });
};





const fetchSingleAlarmsDetails = async (
  id: number,
  token: string | null,
  signal: AbortSignal
) => {
  if (!id) throw new Error("Vessel ID is required.");
  if (!token) throw new Error("Token is required.");

  const res = await getSingleAlarmsDetailsApi(id,token,signal);
  const data = res.data;

  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unknown error occurred.");
  }

  return data.data;
};
