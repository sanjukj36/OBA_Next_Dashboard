export type GeofenceCords = {
  id: number;
  fk_vessel: number;
  coordsArray: { lat: number; lng: number }[];
  vesselName: string;
};
