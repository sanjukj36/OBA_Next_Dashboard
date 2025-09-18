import { useQuery } from "@tanstack/react-query";
import { getAllVesselList } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { VesselListAllItem, VesselListItem } from "@/types/vessel-selection";

const dto = <T extends VesselListAllItem[]>(data: T): VesselListItem[] => {
  return data.map(item => {
    return {
      id: item.id,
      label: item.name,
      value: item.name,
      imo: item.imo,
      fleet: item.fleet.name,
      company: item.company.name,
      flag: item.flag
    };
  });
};

const fetchAllVesselList = async (token: string | null) => {
  if (!token) throw new Error("Token not provided.");
  const res = await getAllVesselList(token);
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }
  const dtoData = dto(data.data);
  return dtoData;
};

export const useAllVesselList = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["allVesselList"],
    queryFn: () => fetchAllVesselList(token),
    enabled: !!token
  });
};
