import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { downloadAnalyticsExcelAPI, getAnaylyticsDataPostAPI, downloadAnalyticsAllExcelAPI } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { saveAs } from "file-saver";
import { useAnalyticStore } from "@/store/analytics-store";

export const useDownloadAnalyticeAllExcelMutation = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useMutation({
    mutationFn: ({ from_date, to_date }: { from_date: Date, to_date: Date }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }

      return downloadAnalyticsAllExcelAPI(
        {
          id: vessel.id,
          from_date: format(from_date, "dd-MM-yyyy"),
          to_date: format(to_date, "dd-MM-yyyy"),
        },
        token
      );
    },
    onSuccess: res => {
      const disposition = res.headers['content-disposition'];
      let filename = ' "ANALYTICS-ALL-TAGS.xlsx"';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }

      const fileBlob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(fileBlob, filename);

      toast.success("Download completed.");
    },
    onError: error => {
      toast.error(error.message ?? "Unkown error occured");
    }
  });
};
export const useDownloadAnalyticeExcelMutation = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();

  return useMutation({
    mutationFn: ({ from_date, to_date, data }: { from_date: Date, to_date: Date, data: Record<string, number> }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }

      return downloadAnalyticsExcelAPI(
        {
          id: vessel.id,
          from_date: format(from_date, "dd-MM-yyyy"),
          to_date: format(to_date, "dd-MM-yyyy"),
          data
        },
        token
      );
    },
    onSuccess: res => {
      const disposition = res.headers['content-disposition'];
      let filename = 'ANALYTICS.xlsx';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }


      const fileBlob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(fileBlob, filename);

      toast.success("Download completed.");
    },
    onError: error => {
      toast.error(error.message ?? "Unkown error occured");
    }
  });
};

export const useGetAnalyticsMutation = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { setChartData } = useAnalyticStore();

  return useMutation({
    mutationFn: async ({ from_date, to_date, data }: { from_date: Date, to_date: Date, data: Record<string, number> }) => {
      if (!token || !vessel?.id) {
        throw new Error("Missing token or vessel ID");
      }

      const res = await getAnaylyticsDataPostAPI(
        {
          id: vessel.id,
          from_date: format(from_date, "dd-MM-yyyy"),
          to_date: format(to_date, "dd-MM-yyyy"),
          data
        },
        token
      );
      const resData = res.data.data;
      return { chartData: resData.data }
    },
    onSuccess: (data) => {
      setChartData(data.chartData)
    },
    onError: error => {
      toast.error(error.message ?? "Unkown error occured");
    }
  });
};
