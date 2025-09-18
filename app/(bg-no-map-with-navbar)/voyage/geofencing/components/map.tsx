"use client";

import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import { LIVE_STATUS_DARK_MAP_URL } from "@/lib/map-urls";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import { EditControl } from "react-leaflet-draw";
import { DrawEvents } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import { toast } from "sonner";
import Loader from "@/components/loader/Loader";
import { deleteGeofenceCoordsApi } from "@/lib/api";
import { useRegisterGeofenceMutation } from "@/mutations/use-register-geofence-mutation";
import { useAuth } from "@/provider/auth-provider";
import {
  getGeofenceCordsQueryKey,
  useGetAllGeofenceCordsQuery
} from "@/queries/use-get-geofence-cords-query";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";

function LiveStatusMapComponent() {
  return (
    <div className="relative isolate m-[6px] flex-1 rounded-[12px] p-[14px] shadow-[0px_0px_3.6px_0px_#FFFFFF]">
      <MapContainer
        center={[21.505, -0.09]}
        zoom={3}
        minZoom={2.3}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        scrollWheelZoom={true}
        attributionControl={false}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={false}
        className="z-0 h-full w-full overflow-hidden rounded-[8px] bg-black"
      >
        <TileLayer url={LIVE_STATUS_DARK_MAP_URL} />
        <DrawRestrictedArea />
      </MapContainer>
    </div>
  );
}

export default LiveStatusMapComponent;

function DrawRestrictedArea() {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const { mutate: registerGeofence } = useRegisterGeofenceMutation();
  const { data, isLoading } = useGetAllGeofenceCordsQuery();
  const queryClient = useQueryClient();

  const _onEdited = (e: DrawEvents.Edited) => {
    e.layers.eachLayer(layer => {
      if (layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs();

        const coordinates = (latlngs[0] as L.LatLng[]).map(point => ({
          lat: point.lat,
          lng: point.lng
        }));

        registerGeofence({
          coords_array: coordinates
        });
      }
    });
  };

  const _onCreated = (e: DrawEvents.Created) => {
    const type = e.layerType;
    const layer = e.layer;
    if (type === "polygon") {
      const latlngs = (layer as L.Polygon).getLatLngs();
      const coordinates = (latlngs[0] as L.LatLng[]).map(point => ({
        lat: point.lat,
        lng: point.lng
      }));
      registerGeofence({
        coords_array: coordinates
      });
    }
  };

  const _onDeleted = async () => {
    if (vessel === null || !vessel.id || !token) return;
    try {
      const response = await deleteGeofenceCoordsApi({ id: vessel.id }, token);
      if (response.status === 200 && response.data.success) {
        toast.success("Deleted cordinate");
        queryClient.invalidateQueries({
          queryKey: getGeofenceCordsQueryKey(vessel?.imo ?? "", token ?? "")
        });
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loader className="absolute inset-0 bg-black/50" />;
  }

  return (
    <FeatureGroup>
      {data && (
        <Polygon
          key={data.id}
          positions={data.coordsArray.map(coord => [coord.lat, coord.lng])}
          pathOptions={{ color: "cyan", weight: 3 }}
        />
      )}
      <EditControl
        position="topright"
        onEdited={_onEdited}
        onCreated={_onCreated}
        onDeleted={_onDeleted}
        draw={{
          /*
              polyline: {
                icon: new L.DivIcon({
                  iconSize: new L.Point(8, 8),
                  className: "leaflet-div-icon leaflet-editing-icon"
                }),
                shapeOptions: {
                  color: "cyan",
                  weight: 3
                }
              },
              */
          polyline: false,
          rectangle: false,
          circlemarker: false,
          marker: false,
          circle: false,
          polygon: {
            shapeOptions: {
              color: "cyan",
              weight: 3
            }
          }
        }}
      />
    </FeatureGroup>
  );
}
