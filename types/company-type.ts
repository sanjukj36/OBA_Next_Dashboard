import { ApiResponse } from ".";

export type CompanyType = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  fk_created_by: number;
  user_owner: user_owner;
};

type user_owner = {
  id: number;
  email: string;
};
export type CompanyMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
};

export type CompanyResponse = ApiResponse<CompanyType[]> & {
  meta: CompanyMeta;
};
