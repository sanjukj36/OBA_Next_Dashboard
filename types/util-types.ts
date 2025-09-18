import { AxiosResponse } from "axios";
import { ApiResponse } from ".";

type BuildRange<
  Start extends number,
  End extends number,
  Acc extends number[] = [],
  Result extends number = never
> = Acc["length"] extends End
  ? Result | End
  : Acc["length"] extends Start
    ? BuildRange<Start, End, [...Acc, 0], Acc["length"]>
    : BuildRange<Start, End, [...Acc, 0], Result | Acc["length"]>;

export type NumberRange<From extends number, To extends number> = BuildRange<
  From,
  To
>;

export type ExtractApiResponsePayload<T> =
  T extends AxiosResponse<ApiResponse<infer U>> ? U : never;
