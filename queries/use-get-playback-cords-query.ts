import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LatLngExpression } from "leaflet";
import { useLocationPlayback } from "@/app/(bg-no-map-with-navbar)/voyage/location-playback/location-playback-context";
import { getPlaybackCordsApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { PlaybackCord } from "@/types/playback";
import { ExtractApiResponsePayload } from "@/types/util-types";
import { VesselListItem } from "@/types/vessel-selection";
import { App } from "@/lib/constants";
import axios, { AxiosError, CanceledError } from "axios";

const payloadCordsSessionKey = App.PayloadCordsSessionKey;
const MAX_REALISTIC_DISTANCE_KM = App.MaxRealisticDistanceKM;

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
export function splitIntoSegments(data: DtoType): DtoType[] {
  const segments: DtoType[] = [];
  let currentSegment: DtoType = [];

  for (let i = 0; i < data.length; ++i) {
    const point = data[i];

    if (i === 0) {
      currentSegment.push(point);
      continue;
    }

    const prev = data[i - 1];
    const timeDiffSec = point.timestamp - prev.timestamp;
    const dist = getDistanceInKm(prev.LAT, prev.LON, point.LAT, point.LON);
    const speedKmPerMin = dist / (timeDiffSec / 60);

    if (speedKmPerMin > MAX_REALISTIC_DISTANCE_KM) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }
      currentSegment = [point];
    } else {
      currentSegment.push(point);
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

export type CachePlaybackRange = {
  vesselId: number | null;
  from: number;
  to: number;
  data: DtoType
}

type DtoType = ExtractApiResponsePayload<
  Awaited<ReturnType<typeof getPlaybackCordsApi>>
>;

const dto = (
  data: DtoType
): {
  paths: LatLngExpression[][];
  missPaths: LatLngExpression[][];
  lastCords: PlaybackCord | null;
} => {
  if (!data || data.length === 0) {
    return {
      paths: [],
      missPaths: [],
      lastCords: null
    };
  };

  const slicedData = splitIntoSegments(data)

  const missPaths: LatLngExpression[][] = [];

  const lastCords = data[data.length - 1]

  const paths = slicedData.map(item => {
    const pathSegments = item.map(x => [x.LAT, x.LON] as LatLngExpression);
    return pathSegments;
  });

  if (paths.length > 1) {
    for (let i = 0; i < paths.length; ++i) {
      if (i !== 0) {
        const prevPath = paths[i - 1];
        const currentPath = paths[i];
        const missPath = [
          prevPath[prevPath.length - 1],
          currentPath[0]
        ] as LatLngExpression[];
        missPaths.push(missPath);
      }
    }
  }

  return {
    paths: paths,
    lastCords,
    missPaths
  };
};

async function fetchPlaybackCords(
  paylod: {
    id: number | null;
    from_date: number | null;
    to_date: number | null;
  },
  token: string | null,
  signal: AbortSignal
) {
  const { id, from_date, to_date } = paylod;
  if (!id) throw new Error("Vessel not found.");
  if (!from_date || !to_date) throw new Error("Date not found.");
  if (!token) throw new Error("Token not found.");
  const res = await getPlaybackCordsApi(
    { id, from_date, to_date },
    token,
    signal
  );
  const data = res.data;
  if (!data.success) {
    throw new Error(data?.error || data?.message || "Unkown Error occured.");
  }

  return data.data;
}

export const getPlaybackCordsQueryKey = (
  ...rest: (string | number | CachePlaybackRange | null)[]
): readonly [string, ...(string | number | CachePlaybackRange | null)[]] => [
    "get-playback-cords-query",
    ...rest
  ];

export const usePlaybackCordsQuery = () => {
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const vesselRef = useRef<VesselListItem>(vessel);
  const prevTimeRef = useRef<number | null>(null)

  const { selectedDate, prevSelectedDate, initialDate } = useLocationPlayback();

  const from_date = prevSelectedDate?.timestamp ?? 0;
  const to_date = selectedDate?.timestamp ?? 0;
  const ini_date = initialDate?.timestamp ?? 0;

  return useQuery({
    queryKey: getPlaybackCordsQueryKey(
      vessel?.id ?? "",
      token ?? "",
      from_date ?? "",
      to_date ?? "",
    ),
    queryFn: async ({ signal }) => {
      // - Slice the data if the cache and given date-range is in the cache-data.
      const cached = sessionStorage.getItem(payloadCordsSessionKey)
      if (cached) {
        const parsedCache = JSON.parse(cached) as CachePlaybackRange;
        const { vesselId: cacheVesselId, data: cacheData, from: cacheFrom, to: cacheTo } = parsedCache

        if (cacheVesselId === vessel?.id && ini_date >= cacheFrom && to_date <= cacheTo) {
          const newData = cacheData.filter(item => item.timestamp >= ini_date && item.timestamp <= to_date)
          return newData;
        }
      }

      try {
        // - Fetch the data if the range is not in the cache.
        const newFromDate = ((vesselRef?.current?.id && vessel?.id) && (vessel.id !== vesselRef.current.id))
          ? from_date
          : prevTimeRef?.current ? prevTimeRef?.current : from_date
        const data = await fetchPlaybackCords(
          {
            id: vessel?.id ?? null,
            from_date: newFromDate,
            to_date: to_date ?? null
          },
          token,
          signal
        )
        prevTimeRef.current = null;

        // - If not cached then freshly store the data.
        if (!cached) {
          const newCacheData: CachePlaybackRange = {
            vesselId: vessel?.id ?? null,
            from: from_date,
            to: to_date,
            data
          }
          sessionStorage.setItem(payloadCordsSessionKey, JSON.stringify(newCacheData))
          return data
        }

        const { vesselId: cacheVesselId, data: cacheData, from: cacheFrom } = JSON.parse(cached) as CachePlaybackRange;

        // - If cached and vessel change(reset the entire cache.).
        if (cacheVesselId !== vessel?.id) {
          const newCacheData: CachePlaybackRange = {
            vesselId: vessel?.id ?? null,
            from: from_date,
            to: to_date,
            data
          }
          sessionStorage.setItem(payloadCordsSessionKey, JSON.stringify(newCacheData))
          return data
        }
        const newData = [...cacheData, ...data]

        const updatedCache: CachePlaybackRange = {
          vesselId: vessel?.id ?? null,
          from: cacheFrom,
          to: to_date,
          data: newData
        }

        sessionStorage.setItem(payloadCordsSessionKey, JSON.stringify(updatedCache))
        return newData
      } catch (err) {
        if ((err instanceof CanceledError || err instanceof AxiosError) && axios.isCancel(err)) {
          const params: { id: number, from_date: number } = err.config?.params
          if (!prevTimeRef.current) {
            prevTimeRef.current = params?.from_date ?? null
          }
        }
        throw err;
      }
    },
    enabled: !!token && !!vessel?.id && !!from_date && !!to_date,
    select: (data) => dto(data),
    placeholderData: prev => {
      if (vesselRef?.current?.imo !== vessel?.imo) return undefined
      return prev;
    }
  });
};
