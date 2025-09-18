export type LatestDataByTagFromResponse = {
  value: number;
  tag_obj: {
    unit: string;
    description: string;
    tag_from_vessel: string;
    min: number;
    max: number;
    datatype: "float";
  };
};

export type LatestDataByTag = Pick<LatestDataByTagFromResponse, "value"> &
  LatestDataByTagFromResponse["tag_obj"];
