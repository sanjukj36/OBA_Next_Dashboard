export type VesselListAllItem = {
  id: number;
  name: string;
  imo: string;
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
  geared_or_gearless: false;
  company: {
    name: string;
  };
  fleet: {
    name: string;
  };
};

export type VesselListItem = {
  id: number;
  label: VesselListAllItem["name"];
  value: VesselListAllItem["name"];
  imo: VesselListAllItem["imo"];
  fleet: VesselListAllItem["fleet"]["name"];
  company: VesselListAllItem["company"]["name"];
  flag: VesselListAllItem["flag"];
};
