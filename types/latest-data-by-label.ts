import { TagAssign } from "./tag-assign";

export type LatestDataByLabelFromResponse<T = undefined, D = undefined> = {
  label: string;
  data: (Omit<TagAssign<T>, "actual_tag"> & {
    value: D extends undefined ? number : D;
  })[];
};

export type LatestDataByLabel<T = undefined, D = undefined> = Pick<
  LatestDataByLabelFromResponse<T, D>,
  "data"
>["data"][number];
