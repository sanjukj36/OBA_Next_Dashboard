export type AnalyticsChartDataItem = {
  time: string;
} & Record<string, number>

export type AnalyticsChartData = AnalyticsChartDataItem[]

export type AnalyticsChartResponse = {
  from_date: string;
  to_date: string;
  data: AnalyticsChartData;
  tags: Record<string, number>
}
