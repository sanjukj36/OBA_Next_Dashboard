import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateRealTimeAcknowledgeApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getAlarmsListQueryKey } from "@/queries/use-get-realtime-alarms-query";
import { useRealtimeAlarmStore } from "@/store/realtime-alarm-store";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

export const useAcknowledgeRealtimeAlarmMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { from_date, to_date, page, sort, limit } = useRealtimeAlarmStore();

  return useMutation({
    mutationFn: (body: { id: number }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }
      return updateRealTimeAcknowledgeApi(
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
          queryKey: getAlarmsListQueryKey(
            String(vessel?.id) ?? "",
            String(sort) ?? "",
            String(format(to_date, "dd-MM-yyyy")),
            String(format(from_date, "dd-MM-yyyy")),
            String(page) ?? "",
            String(limit) ?? ""
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
