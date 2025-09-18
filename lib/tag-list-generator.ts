import { NumberRange } from "@/types/util-types";

export type CreateTagListType<T extends string, N extends number> = {
  [K in NumberRange<1, N> as `Tag${K}`]: `${T}-ALARM-${K}`;
};

export function createTagList<T extends string, N extends number>(
  prefix: T,
  totalNoOfTags: N
) {
  const tagList = Object.fromEntries(
    Array.from({ length: totalNoOfTags }, (_, i) => {
      const n = i + 1;
      return [`Tag${n}`, `${prefix}-ALARM-${n}` as const];
    })
  ) as CreateTagListType<T, N>;
  return {
    tagList,
    totalNoOfTags
  };
}

export type TagListType<F extends ReturnType<typeof createTagList>> =
  F extends { tagList: infer T } ? T : never;
