import { NumberRange } from "@/types/util-types";

const totalNoOfTags = 33 as const;

type NoOfTags = NumberRange<1, typeof totalNoOfTags>;
type DgType = "DG1" | "DG2" | "DG3" | "DG4";

export type DGLabelList = {
  [N in NoOfTags as `Tag${N}`]: `${DgType}-ALARM-${N}`;
};

export const DG = (type: DgType): DGLabelList =>
  Object.fromEntries(
    Array.from({ length: totalNoOfTags }, (_, i) => {
      const n = i + 1;
      return [`Tag${n}`, `${type}-ALARM-${n}`];
    })
  ) as DGLabelList;
