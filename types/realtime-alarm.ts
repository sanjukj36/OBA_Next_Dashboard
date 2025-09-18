export type MlResponseType = {
  alarm_name: string;
  possible_reasons: string;
  corrective_actions: string;
};
export type MlAlarmListType = {
  id: number;
  alarm_name: string;
  MlResponse: MlResponseType;
  vessel_time: string;
};
