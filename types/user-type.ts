import { ApiResponse } from ".";

export type UserType = {
  id: number;
  name: string;
  fk_company: number;
  fk_fleet: number;
  fk_vessel: number;
  pages: Pages;
  entity_type: Entity;
  isDeleted: boolean;
};

type Pages = string[];
type Entity = "company" | "fleet" | "vessel";
export type UserTypeMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
};

export type UserTypeResponse = ApiResponse <UserType[]> & {
  meta: UserTypeMeta;
}