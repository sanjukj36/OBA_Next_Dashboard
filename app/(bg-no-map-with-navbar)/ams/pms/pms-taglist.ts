import { createTagList } from "@/lib/tag-list-generator";
import type { CreateTagListType } from "@/lib/tag-list-generator";

const totalNoOfTags = 57 as const;

const { tagList } = createTagList("PMS", totalNoOfTags);

export type PmsTagListType = CreateTagListType<"PMS", typeof totalNoOfTags>;

export const PMS = tagList;
