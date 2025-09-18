"use client";

import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import { LIVE_STATUS_DARK_MAP_URL } from "@/lib/map-urls";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import { EditControl } from "react-leaflet-draw";
import { DrawEvents } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

interface MapComponentProps {
  coordsArray: { lat: number; lng: number }[];
  onCoordsChange: (coords: { lat: number; lng: number }[]) => void;
}

function MapComponent({ coordsArray, onCoordsChange }: MapComponentProps) {
  return (
    <div className="relative isolate m-[4px] flex-1 rounded-[12px] p-[4px] shadow-[0px_0px_3.6px_0px_#FFFFFF]">
      <MapContainer
        center={[21.505, -0.09]}
        zoom={3}
        minZoom={2.3}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        scrollWheelZoom
        attributionControl={false}
        doubleClickZoom
        dragging
        zoomControl={false}
        className="z-0 h-[calc(100vh-150px)] w-full overflow-hidden rounded-[8px] bg-black"
      >
        <TileLayer url={LIVE_STATUS_DARK_MAP_URL} />

        <DrawRestrictedArea
          coordsArray={coordsArray}
          onCoordsChange={onCoordsChange}
        />
      </MapContainer>
    </div>
  );
}

export default MapComponent;

function DrawRestrictedArea({
  coordsArray,
  onCoordsChange
}: {
  coordsArray: { lat: number; lng: number }[];
  onCoordsChange: (coords: { lat: number; lng: number }[]) => void;
}) {
  const _onEdited = (e: DrawEvents.Edited) => {
    e.layers.eachLayer(layer => {
      if (layer instanceof L.Polygon) {
        const coordinates = (layer.getLatLngs()[0] as L.LatLng[]).map(p => ({
          lat: p.lat,
          lng: p.lng
        }));
        onCoordsChange(coordinates);
      }
    });
  };

  const _onCreated = (e: DrawEvents.Created) => {
    if (e.layerType === "polygon") {
      const latlngs = (e.layer as L.Polygon).getLatLngs();
      const coordinates = (latlngs[0] as L.LatLng[]).map(p => ({
        lat: p.lat,
        lng: p.lng
      }));

      // ✅ remove the auto-added layer so only React renders it
      e.layer.remove();

      // ✅ only keep latest polygon in state
      onCoordsChange(coordinates);
    }
  };

  const _onDeleted = () => {
    onCoordsChange([]);
  };

  return (
    <FeatureGroup>
      {coordsArray.length > 0 && (
        <Polygon
          key="drawn"
          positions={coordsArray.map(c => [c.lat, c.lng])}
          pathOptions={{ color: "cyan", weight: 3 }}
        />
      )}
      <EditControl
        position="topright"
        onEdited={_onEdited}
        onCreated={_onCreated}
        onDeleted={_onDeleted}
        draw={{
          polyline: false,
          rectangle: false,
          circlemarker: false,
          marker: false,
          circle: false,
          polygon: { shapeOptions: { color: "cyan", weight: 3 } }
        }}
      />
    </FeatureGroup>
  );
}
