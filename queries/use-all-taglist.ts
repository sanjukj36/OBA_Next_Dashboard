import { useQuery } from "@tanstack/react-query";
import { getAllTagApi } from "@/lib/api";
// import { useAuth } from "@/provider/auth-provider";
// import { useVesselSelectionStore } from "@/store/vessel-selection-store";

const dto = (data: string[]) => {
  return (
    data.filter(item => item).map(item => ({ label: item, value: item })) ?? []
  );
};

const fetchAllTagList = async (
  // vesselId: number | null,
  // token: string | null
) => {
  // if (!vesselId || !vesselId) throw new Error("Vessel not found.");
  // if (!token) throw new Error("Token not found.");
  // const res = await getAllTagApi({ id: vesselId }, token);
  const res = await getAllTagApi();
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return dto(data.data);
};

export const getAllTagListQueryKey = (...rest: (string | number)[]) => ["get-all-tag-list", ...rest];

export const useGetAllTagDetailsQuery = () => {
  // const { token } = useAuth();
  // const { vessel } = useVesselSelectionStore();
  return useQuery({
    queryKey: getAllTagListQueryKey(),
    queryFn: () => fetchAllTagList(),
  });
};
