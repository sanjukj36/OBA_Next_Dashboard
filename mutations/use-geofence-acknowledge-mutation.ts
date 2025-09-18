import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateGeofenceAcknowledgeApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getGeofenceAlertsQueryKey } from "@/queries/use-get-geofence-alerts-query";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

export const useAcknowledgeGeofenceMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useMutation({
    mutationFn: (body: { id: number }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }
      return updateGeofenceAcknowledgeApi(
        {
          id: body.id
        },
        token
      );
    },
    onSuccess: data => {
      const res = data.data;
      if (res.success) {
        toast.success("Acknowledged.");
        queryClient.invalidateQueries({
          queryKey: getGeofenceAlertsQueryKey(vessel?.imo ?? "", token ?? "")
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
