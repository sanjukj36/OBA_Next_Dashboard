import { AnalyticsChartData } from "@/types/analytics";
import { create } from "zustand";

interface AnalyticsStoreState {
  chartData: AnalyticsChartData;
  setChartData: (chartData: AnalyticsChartData) => void;
}

export const useAnalyticStore = create<AnalyticsStoreState>(set => ({
  chartData: [],
  setChartData: chartData => set({ chartData })
}));
