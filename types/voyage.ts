export type VoyageCord = {
  imo: string;
  vessel_id: number;
  vessel_name: string;
  data: {
    LAT: number;
    LONG: number;
    HDG: number;
  };
  time_info: {
    payload_time: number;
    readable_utc: string;
    time_difference_seconds: number;
  };
};
