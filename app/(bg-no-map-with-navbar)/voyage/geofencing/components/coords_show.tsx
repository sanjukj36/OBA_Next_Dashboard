import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LIVE_STATUS_DARK_MAP_URL } from "@/lib/map-urls";

type CoordsShowProps = {
  coordsArray: { lat: number; lng: number }[];
  priority:string;
  uiView:string;
  isModel?:boolean;
};

const CoordsShow: React.FC<CoordsShowProps> = ({ coordsArray,priority,uiView,isModel }) => {

    const lineColor= priority=="Medium"?"yellow": priority=="Low"?"green":"red"
    const zoom = uiView === "card"?2:0
  return (
    <MapContainer
      center={
        coordsArray.length > 0
          ? [coordsArray[0].lat, coordsArray[0].lng]
          : [0, 0]
      }
      zoom={zoom}
      scrollWheelZoom={isModel?true:false}
      dragging={isModel?true:false}
      doubleClickZoom={false}
      attributionControl={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer url={LIVE_STATUS_DARK_MAP_URL} />

      {coordsArray.length > 0 && (
        <Polygon
          positions={coordsArray.map(c => [c.lat, c.lng])}
        //   pathOptions={{ color: "cyan", weight: 2 }}
          pathOptions={{ color: lineColor, weight: 1 }}
        />
      )}
    </MapContainer>
  );
};

export default CoordsShow;
