import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAcknowledgeFuelmasterApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getRealtimeFuelmasterListQueryKey } from "@/queries/use-get-realtime-fuelmaster-query";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { useFuelmasterAlertsStore } from "@/store/fulemaster-alerts-store";

export const useAcknowledgeRealtimeFuelmasterAlarmMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { from_date, to_date } = useFuelmasterAlertsStore()

  return useMutation({
    mutationFn: (body: { id: number }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }
      return updateAcknowledgeFuelmasterApi({ id: body.id }, token);
    },
    onSuccess: data => {
      const res = data.data;

      if (res.success) {
        toast.success(res.message ?? "Acknowledged.");

        queryClient.invalidateQueries({
          queryKey: getRealtimeFuelmasterListQueryKey(
            token ?? "",
            vessel?.id ?? "",
            from_date ?? "",
            to_date ?? ""
          )
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
