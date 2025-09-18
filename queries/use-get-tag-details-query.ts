import { useQuery } from "@tanstack/react-query";
import { getTagDetailsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const fetchCurrentTagDetails = async <T = undefined>(
  label: string,
  vesselId: number | null,
  token: string | null
) => {
  // if (!vesselId || !vesselId) throw new Error("Vessel not found.");
  console.log("I AM HERE 8");
  // if (!token) throw new Error("Token not found.");
  const res = await getTagDetailsApi<T>({ label: label, id: vesselId }, token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
};

export const getCurrentTagDetailsQueryKey = (...label: (string | number)[]) => [
  "get-current-tag-details-query",
  ...label
];

export const useGetTagDetailsQuery = <T = undefined>(label: string) => {
  // const { token } = useAuth();
  // const { vessel } = useVesselSelectionStore();
  const { token } = "";
  // const { vessel } = useVesselSelectionStore();
  const { vessel } = { id: 111111 };
  
  return useQuery({
    queryKey: getCurrentTagDetailsQueryKey(
      label,
      vessel?.id ?? "",
      token ?? ""
    ),
    queryFn: () => fetchCurrentTagDetails<T>(label, vessel?.id ?? null, token),
    // enabled: !!token
  });
};
