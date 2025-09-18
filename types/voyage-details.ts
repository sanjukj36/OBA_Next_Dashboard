export interface VoyageDetailsResponse {
  success: boolean;
  data: VoyageDetailsData;
  error?: string;
  message?: string;
}

export interface VoyageDetailsData {
  vessel_id: number;
  imo: string;
  vessel_name: string;
  flag: string;
  vessel_type: string;
  readable_utc: string;
  company: string;
  fleet: string;
  from: string;
  to: string;
  ATD: string;
  ReportedETA: string;
  data: {
    LAT: number;
    LONG: number;
    HDG: number;
  };
  time_info?: {
    readable_utc: string;
    time_difference_seconds?: number;
  };
}

export interface VoyageDetailsItem {
  id: number;
  vessel_name: string;
  vessel_type: string;
  label: string;
  value: string;
  imo: string;
  fleet: string;
  company: string;
  flag: string;
  from: string;
  to: string;
  ATD: string;
  ReportedETA: string;
  position: {
    lat: number;
    long: number;
    heading: number;
  };
  time_info?: {
    readable_utc: string;
    time_difference_seconds?: number;
  };
}
