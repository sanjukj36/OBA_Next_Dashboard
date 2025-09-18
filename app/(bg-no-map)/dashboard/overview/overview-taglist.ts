import { createTagList } from "@/lib/tag-list-generator";
import type { CreateTagListType } from "@/lib/tag-list-generator";

const totalNoOfTags = 60 as const;

const { tagList } = createTagList("OVERVIEW", totalNoOfTags);

export type GETagList = CreateTagListType<"OVERVIEW", typeof totalNoOfTags>;

export const OVERVIEW = tagList;
