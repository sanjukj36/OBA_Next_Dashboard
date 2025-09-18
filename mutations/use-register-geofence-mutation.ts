import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerGeofencesApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getGeofenceCordsQueryKey } from "@/queries/use-get-geofence-cords-query";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

type GeofenceBody = {
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  alert_send: boolean;
  fence_type: "Permitted" | "Restricted";
  coords_array: { lat: number; lng: number }[];
};

export const useRegisterGeofenceMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useMutation({
    mutationFn: (body: GeofenceBody) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }
      return registerGeofencesApi(
        {
          ...body,
          fk_vessel: vessel.id
        },
        token
      );
    },
    onSuccess: data => {
      const res = data.data;
      if (res.success) {
        toast.success("Updated");
        queryClient.invalidateQueries({
          queryKey: getGeofenceCordsQueryKey(vessel?.imo ?? "", token ?? "")
        });
      } else {
        toast.error(res.message ?? "Unkown error occured");
      }
    },
    onError: error => {
      toast.error(error.message ?? "Unkown error occured");
    }
  });
};
