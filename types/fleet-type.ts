import { ApiResponse } from ".";

export type FleetType = {
  id: number;
  name: string;
  email: string;
  fleet_director: string;
  fleet_dir_email: string;
  no_of_vessels: number;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean;
};

export type FleetMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
};

export type FleetResponse = ApiResponse <FleetType[]> & {
  meta: FleetMeta;
}