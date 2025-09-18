export type ApiResponse<T> = {
  success: boolean;
  error?: string;
  message?: string;
  data: T;
};

export type ClientUser = {
  id: string;
  token: string;
  email: string;
  company_entity: string[];
  fleet_entity: string[];
  vessel_entity: string[];
  is_superuser: boolean;
};

export type DateMode = "UTC" | "LT";
