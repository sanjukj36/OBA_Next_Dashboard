import { createTagList } from "@/lib/tag-list-generator";
import type { CreateTagListType } from "@/lib/tag-list-generator";

const totalNoOfTags = 291 as const;

const { tagList } = createTagList("GE", totalNoOfTags);

export type GETagList = CreateTagListType<"GE", typeof totalNoOfTags>;

export const GE = tagList;
