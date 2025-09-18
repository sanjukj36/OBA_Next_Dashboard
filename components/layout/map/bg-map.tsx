import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const url =
  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

function BgMapComponent() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <MapContainer
        center={[21.505, -0.09]}
        zoom={3}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        scrollWheelZoom={true}
        attributionControl={false}
        doubleClickZoom={false}
        dragging={false}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url={url} />
      </MapContainer>
    </div>
  );
}

export default BgMapComponent;
