export enum TagDataType {
  Float = "float",
  Bool = "bool"
}

export type TagAssign<T = undefined> = {
  actual_tag: string;
  tag_from_vessel: string;
  description: string;
  datatype: TagDataType;
  unit: string | null;
  minimum: number | null;
  maximum: number | null;
  showOnlyDescription: boolean;
} & (T extends undefined ? object : { response_type: T });
