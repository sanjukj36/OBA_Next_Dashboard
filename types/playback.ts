export type PlaybackInitialVesselTimeTimeStamp = {
  timestamp: number;
  time: string;
};

export type PlaybackInitialCords = {
  responseData: {
    LAT: number;
    LONG: number;
    HDG: number;
  };
  timeInfo: {
    vessel_time: string;
    time_difference_seconds: bigint;
  };
  recordCount: number;
  vesselTimeToTimestampMap: PlaybackInitialVesselTimeTimeStamp[];
};

export type PlaybackCord = {
  time: string;
  timestamp: number;
  LAT: number;
  LON: number;
  HDG: number;
};
