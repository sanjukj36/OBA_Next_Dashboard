import { createTagList } from "@/lib/tag-list-generator";
import type { CreateTagListType } from "@/lib/tag-list-generator";

const totalNoOfTags = 47 as const;

const { tagList } = createTagList("ME", totalNoOfTags);

export type METagList = CreateTagListType<"ME", typeof totalNoOfTags>;

export const ME = tagList;
