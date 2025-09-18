import { ApiResponse } from ".";

export type VesselType = {
  id: number;
  name: string;
  imo: string;
  email: string;
  vessel_type: string;
  hull_no: string;
  flag: string;
  port_of_regd: string;
  year_built: number;
  no_of_dg: number;
  dg_capacity_indvidual: number[];
  dg_maker: string;
  dg_model: string;
  me_maker: string;
  me_model: string;
  power: number;
  mcr: number;
  geared_or_gearless: boolean;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean;
  fk_company: number;
  fk_fleet: number;
  fk_created_by: number | null;
  company: {
    name: string;
  };
  fleet: {
    name: string;
  };
};

export type VesselMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
};

export type VesselResponse = ApiResponse<VesselType[]> & {
  meta: VesselMeta;
};
