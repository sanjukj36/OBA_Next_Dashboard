export type TrendResponse = {
  data: ChartDataItem[];
  tag: {
    tag1: string;
    tag2?: string;
    tag3?: string;
    tag4?: string;
  };
};

export type ChartDataItem = {
  time: string;
  value1?: number;
  value2?: number;
  value3?: number;
  value4?: number;
};
