export type FuelMasterListItem = {
  id: number;
  vesselTime: string;
  message: string;
}
export type FuelMasterPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number,
  limit: number
}
