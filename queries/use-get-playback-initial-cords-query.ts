import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocationPlayback } from "@/app/(bg-no-map-with-navbar)/voyage/location-playback/location-playback-context";
import { getInitialPlaybackApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchInitialPlaybackCords = async (
  paylod: {
    id: number | null;
    from_date: string | null;
    to_date: string | null;
  },
  token: string | null
) => {
  const { id, from_date, to_date } = paylod;
  if (!id) throw new Error("Vessel not found.");
  if (!from_date || !to_date) throw new Error("Date not found.");
  if (!token) throw new Error("Token not found.");
  const res = await getInitialPlaybackApi({ id, from_date, to_date }, token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
};

export const getInitialPlaybackCordsQueryKey = (
  ...rest: (string | number | Date)[]
): readonly [string, ...(string | number | Date)[]] => [
    "get-initial-playback-cords-query",
    ...rest
  ];

export const useInitialPlaybackCordsQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { from_date, to_date  } = useLocationPlayback();

  return useQuery({
    queryKey: getInitialPlaybackCordsQueryKey(vessel?.id ?? "", token ?? "", from_date ?? "", to_date ?? ""),
    queryFn: async () => {
      const data = await fetchInitialPlaybackCords(
        {
          id: vessel?.id ?? null,
          from_date: format(from_date ?? "", "dd-MM-yyyy") ?? null,
          to_date: format(to_date ?? "", "dd-MM-yyyy") ?? null
        },
        token
      )
      return data;
    },
    enabled: !!token && !!vessel?.id && !!from_date && !!to_date,
  });
};
