import axios from "axios";
import { id } from "zod/v4/locales";
import { GeofencingAlertItems } from "@/app/(bg-no-map-with-navbar)/voyage/geofencing/alerts/alarm-monitoring-table";
import { ApiResponse } from "@/types";
import {
  FuelMasterListItem,
  FuelMasterPagination
} from "@/types/alerts-fuelmaster";
import { AnalyticsChartResponse } from "@/types/analytics";
import {
  ChatBotAudio,
  ChatBotAudioToText,
  ChatBotText
} from "@/types/chat-bot";
import { CompanyResponse } from "@/types/company-type";
import { FleetResponse } from "@/types/fleet-type";
import { GeofenceCords } from "@/types/geofence";
import { LatestDataByLabelFromResponse } from "@/types/latest-data-by-label";
import { LatestDataByTagFromResponse } from "@/types/latest-data-by-tag";
import { PlaybackCord, PlaybackInitialCords } from "@/types/playback";
import { MlAlarmListType } from "@/types/realtime-alarm";
import { TagAssign } from "@/types/tag-assign";
import { TrendResponse } from "@/types/trend";
import { UserTypeResponse } from "@/types/user-type";
import { VesselListAllItem } from "@/types/vessel-selection";
import { VesselResponse } from "@/types/vessel-type";
import { VoyageCord } from "@/types/voyage";
import { VoyageDetailsResponse } from "@/types/voyage-details";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `${process.env.NEXT_PUBLIC_API}/api`
    : `/api`;
// const BASE_URL = `${process.env.NEXT_PUBLIC_API}/api`;

const client = axios.create({ baseURL: BASE_URL });
import { MlAlarmListType } from "@/types/realtime-alarm";
import { AnalyticsChartResponse } from "@/types/analytics";
import { UserTypeResponse } from "@/types/user-type";
import { CompanyResponse } from "@/types/company-type";
import { VesselResponse } from "@/types/vessel-type";
import { FleetResponse } from "@/types/fleet-type";
import {
  FuelMasterListItem,
  FuelMasterPagination
} from "@/types/alerts-fuelmaster";
import client from "./axios-client";

// Alarm Apis
export const getAlarmsListApi = async (
  id: number,
  from_date: string,
  to_date: string,
  sort: "asc" | "desc",
  page: number,
  limit: number,
  token: string
) => {
  return await client.get<ApiResponse<MlAlarmListType[]>>(`ml-alarm/list`, {
    params: {
      id,
      from_date,
      to_date,
      sort,
      page,
      limit
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getHistoricAlarmsListApi = async (
  id: number,
  from_date: string,
  to_date: string,
  sort: "asc" | "desc",
  page: number,
  limit: number,
  token: string
) => {
  return await client.get<ApiResponse<MlAlarmListType[]>>(
    `ml-alarm/historic/list`,
    // `ml-alarm/list?id=${id}&from_date=${from_date}&to_date=${to_date}&sort=${sort}&page=${page}&limit=${limit}`,
    {
      params: {
        id,
        from_date,
        to_date,
        sort,
        page,
        limit
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const getSingleAlarmsDetailsApi = async (
  id: number,
  token: string,
  signal: AbortSignal
) => {
  return await client.get(`ml-alarm/get-alarm`, {
    params: {
      id
    },
    headers: {
      Authorization: `Bearer ${token}`
    },
    signal
  });
};

export const updateRealTimeAcknowledgeApi = async (
  params: { id: number },
  token: string
) => {
  return await client.post("ml-alarm/acknowledge", "", {
    params: {
      id: params.id
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

export const getMLAlarmAnalyticsApi = async (
  id: number,
  // from_date: string,
  // to_date: string,
  date: string,
  tag: string,
  token: string,
  signal: AbortSignal
) => {
  return await client.get(`ml-alarm/analytics`, {
    params: {
      id,
      // from_date,
      // to_date,
      date,
      tag
    },
    headers: {
      Authorization: `Bearer ${token}`
    },
    signal
  });
};
// End Alarm Apis

export const loginApi = async (body: { email: string; password: string }) => {
  return await client.post("/user/login", body);
};

export const addUserTypeApi = async (
  body: {
    name: string;
    entity_type: string;
    pages: string[];
  },
  token: string
) => {
  return await client.post("/user/usertype/configure", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const listUserTypeApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  return await client.get<UserTypeResponse>(
    `user/usertype/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateUserTypeApi = async (
  body: {
    name: string;
    entity_type: string;
    pages: string[];
  },
  id: number,
  token: string
) => {
  return await client.put(`/user/usertype/update?id=${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteUserTypeApi = async (id: number, token: string) => {
  return await client.delete(`/user/usertype/delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// company

export const addCompanyApi = async (
  body: {
    name: string;
    email: string;
  },
  token: string
) => {
  return await client.post("/master/company/create", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const listCompanyApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  // `master/company/list?page=${page}&limit=${limit}&search=${search}`,

  return await client.get<CompanyResponse>(
    `master/company/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateComapnyApi = async (
  body: {
    name: string;
    email: string;
  },
  id: number,
  token: string
) => {
  return await client.put(`/master/company/update?id=${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteCompanyApi = async (id: number, token: string) => {
  return await client.delete(`/master/company/delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// fleet

export const addFleetApi = async (
  body: {
    name?: string;
    email?: string;
    fleet_director?: string;
    fleet_dir_email?: string;
    no_of_vessels?: number;
  },
  token: string
) => {
  return await client.post("/master/fleet/create", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const listFleetApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  // `master/company/list?page=${page}&limit=${limit}&search=${search}`,

  return await client.get<FleetResponse>(
    `master/fleet/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateFleetApi = async (
  body: {
    name?: string;
    email?: string;
    fleet_director?: string;
    fleet_dir_email?: string;
    no_of_vessels?: number;
  },
  id: number,
  token: string
) => {
  return await client.put(`/master/fleet/update?id=${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteFleetApi = async (id: number, token: string) => {
  return await client.delete(`/master/fleet/delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// veesel

export const addVesselApi = async (
  body: {
    name?: string;
    imo?: string;
    email?: string;
    vessel_type?: string;
    hull_no?: string;
    flag?: string;
    port_of_regd?: string;
    year_built?: string;
    no_of_dg?: string;
    dg_capacity_indvidual?: number[];
    dg_maker?: string;
    dg_model?: string;
    me_maker?: string;
    me_model?: string;
    power?: string;
    mcr?: number;
    geared_or_gearless?: boolean;
  },
  token: string
) => {
  return await client.post("/master/vessel/create", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const listVesselApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  // `master/company/list?page=${page}&limit=${limit}&search=${search}`,

  return await client.get<VesselResponse>(
    `master/vessel/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateVesselApi = async (
  body: {
    name?: string;
    email?: string;
    fleet_director?: string;
    fleet_dir_email?: string;
    no_of_vessels?: number;
  },
  id: number,
  token: string
) => {
  return await client.put(`/master/vessel/update?id=${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteVesselApi = async (id: number, token: string) => {
  return await client.delete(`/master/vessel/delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

//flag in vessel list
export const listFlagApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  return await client.get(
    `master/vessel/flag/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

//UserAdd api

// export const addUserApi = async (
//   body: {
//     email: string;
//     password: string;
//     user_type_id: number;
//     entity: string[];
//     expiry: string;
//   },
//   token: string
// ) => {
//   return await client.post("/user/add", body, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });
// };

export const addUserApi = async (formData: FormData, token: string) => {
  return await client.post("/user/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//update userAdd api
// export const updateUserAddApi = async (
//   body: {
//     email: string;
//     name: string;
//     password: string;
//     user_type_id: number;
//     entity: string[];
//     expiry: string;
//   },
//   id: number,
//   token: string
// ) => {
//   return await client.put(`user/update?id=${id}`, body, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });
// };

export const updateUserAddApi = async (
  formData: FormData,
  id: number,
  token: string
) => {
  return await client.put(`/user/update?id=${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//userList api

export const listUserAddApi = async (
  page: number,
  limit: number,
  search: string,
  token: string
) => {
  return await client.get(
    `user/list?page=${page}&limit=${limit}&search=${search}`,
    {
      params: "",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

//disable useradd api
export const userAddDisableApi = async (
  id: number,
  token: string,
  body: { id: number }
) => {
  return await client.post(`user/disable?id=${id}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

//get value in edit
export const getUserByIdApi = async (id: string | number, token: string) => {
  return await client.get(`user/get?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//update password api

export const changeUserPasswordApi = async (
  body: {
    email: string;
    current_password: string;
    new_password: string;
  },
  token: string
) => {
  return await client.post("/user/change/password", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/* Get All Vessel list */
export const getAllVesselList = async (token: string) => {
  return await client.get<{
    data: VesselListAllItem[];
    success: boolean;
    error?: string;
    message?: string;
  }>("/master/vessel/list", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/* Get All Vessel list */
export const getLatestDataByTag = async (
  token: string,
  { tag, id }: { tag: string; id: number }
) => {
  return await client.get<ApiResponse<LatestDataByTagFromResponse>>(
    "/dashboard/latest-values",
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        tag,
        id
      }
    }
  );
};

/* Get Trend chart */
export const getTrend = async (
  token: string,
  {
    from_date,
    to_date,
    tag1,
    id,
    tag2,
    tag3,
    tag4
  }: {
    from_date: string;
    to_date: string;
    tag1: string;
    id: number;
    tag2?: string;
    tag3?: string;
    tag4?: string;
  }
) => {
  return await client.get<ApiResponse<TrendResponse>>(
    "/dashboard/historical-values",
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        tag1,
        tag2: tag2 || undefined,
        tag3: tag3 || undefined,
        tag4: tag4 || undefined,
        id,
        from_date,
        to_date
      }
    }
  );
};

/* Send the audio */
export const sendAudio = async (body: FormData, token: string) => {
  return await client.post<ApiResponse<ChatBotAudio>>(
    "ai/chatbot/audio",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/* Send the audio */
export const sendChatText = async (body: { chat: string }, token: string) => {
  return await client.post<ApiResponse<ChatBotText>>("ai/chatbot/text", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/* Audio to Text */
export const audioToTextApi = async (body: FormData, token: string) => {
  return await client.post<ApiResponse<ChatBotAudioToText>>(
    "ai/chatbot/transcribe",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/* Tag Assign */
export const updateTagApi = async (
  body: {
    vesselId: number;
    data: TagAssign[];
    label: string;
  },
  token: string
) => {
  return await client.post<
    ApiResponse<{
      id: number;
      tag_data: TagAssign[];
      label: string;
      fk_vessel: number;
    }>
  >("master/vessel/tag-master/manual-add/", body, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

// /* Tag Assign */
// export const updateTagApi = async (
//   body: {
//     vesselId: number;
//     data: TagAssign[];
//     label: string;
//   },
//   token: string
// ) => {
//   return await client.post<
//     ApiResponse<{
//       id: number;
//       tag_data: TagAssign[];
//       label: string;
//       fk_vessel: number;
//     }>
//   >("master/vessel/tag-master/manual-add", body, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     }
//   });
// };

/* Tag Assign */
export const getTagDetailsApi = async <T = undefined>(
  params: { label: string; id: number },
  token: string
) => {
  return await client.get<ApiResponse<TagAssign<T>[]>>(
    "master/vessel/tag-master/get-tag",
    {
      params: {
        label: params.label,
        fk_vessel: params.id
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

/* Get All Taglist */
export const getAllTagApi = async () => {
  return await client.get<ApiResponse<string[]>>(
    "tags/",
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};
// export const getAllTagApi = async (params: { id: number }, token: string) => {
//   return await client.get<ApiResponse<string[]>>(
//     "master/vessel/tag-master/all",
//     {
//       params: {
//         fk_vessel: params.id
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );
// };

/* Get latest data by label.*/
export const getLatestValueByLabelApi = async <T = undefined, D = undefined>(
  params: { id: number; label: string },
  token: string,
  signal?: AbortSignal
) => {
  return await client.get<ApiResponse<LatestDataByLabelFromResponse<T, D>>>(
    "master/vessel/tag-master/fetch/batch/",
    {
      params: {
        // fk_vessel: params.id,
        label: params.label
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      signal
    }
  );
};

/* Get vessel cords.*/
export const getVoyageCordsApi = async (token: string) => {
  return await client.get<ApiResponse<VoyageCord[]>>("voyage/cords", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

/* Register Geofence cords.*/
export const registerGeofencesApi = async (
  body: {
    name: string;
    description: string;
    priority: string;
    alert_send: boolean;
    fence_type: string;
    coords_array: { lat: number; lng: number }[];
    fk_vessel: number;
  },
  token: string
) => {
  return await client.post<ApiResponse<VoyageCord[]>>(
    "geofence/register",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

/* Get vessel cords.*/
export const getGeofenceCordsApi = async (id: number, token: string) => {
  return await client.get<ApiResponse<GeofenceCords>>("geofence/get-coords", {
    params: {
      id: id
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

/* Get all Geofencing alerts.*/
export const getGeofenceAlertsApi = async (
  params: { id: number },
  token: string
) => {
  return await client.get<ApiResponse<GeofencingAlertItems[]>>(
    "geofence/alert-list",
    {
      params: {
        id: params.id
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

/* Get all Geofencing alerts.*/
export const updateGeofenceAcknowledgeApi = async (
  params: { id: number },
  token: string
) => {
  return await client.post<
    ApiResponse<GeofencingAlertItems & { isAcknowledged: boolean }>
  >("geofence/acknowledge", "", {
    params: {
      id: params.id
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

/* Delete Geofencing Coords.*/
export const deleteGeofenceCoordsApi = async (
  params: { id: number },
  token: string
) => {
  return await client.delete<ApiResponse<undefined>>("geofence/delete-coords", {
    params: {
      id: params.id
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

/* Get Initial Cords of playback.*/
export const getInitialPlaybackApi = async (
  params: { id: number; from_date: string; to_date: string },
  token: string
) => {
  return await client.get<ApiResponse<PlaybackInitialCords>>(
    "voyage/initialcord",
    {
      params: {
        id: params.id,
        from_date: params.from_date,
        to_date: params.to_date
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

/* Get Initial Cords of playback.*/
export const getPlaybackCordsApi = async (
  params: { id: number; from_date: number; to_date: number },
  token: string,
  signal: AbortSignal
) => {
  return await client.get<ApiResponse<PlaybackCord[]>>("voyage/playback", {
    params: {
      id: params.id,
      from_date: params.from_date,
      to_date: params.to_date
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    signal
  });
};

/* Get Voyage Details by ID */
export const getVoyageDetails = async (
  params: { id: number },
  token: string
) => {
  return await client.get<VoyageDetailsResponse>("/voyage/detail", {
    params: {
      id: params.id
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const downloadAnalyticsExcelAPI = async (
  {
    id,
    from_date,
    to_date,
    data
  }: {
    id: number;
    from_date: string;
    to_date: string;
    data: Record<string, number>;
  },
  token: string
) => {
  return await client.post("/dashboard/analytics/report", data, {
    params: {
      id,
      from_date,
      to_date
    },
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: "blob"
  });
};

export const downloadAnalyticsAllExcelAPI = async (
  {
    id,
    from_date,
    to_date
  }: { id: number; from_date: string; to_date: string },
  token: string
) => {
  return await client.post("/dashboard/analytics/all-report", "", {
    params: {
      id,
      from_date,
      to_date
    },
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: "blob"
  });
};

export const getAnaylyticsDataPostAPI = async (
  {
    id,
    from_date,
    to_date,
    data
  }: {
    id: number;
    from_date: string;
    to_date: string;
    data: Record<string, number>;
  },
  token: string
) => {
  return await client.post<ApiResponse<AnalyticsChartResponse>>(
    "/dashboard/analytics/chart",
    data,
    {
      params: {
        id,
        from_date,
        to_date
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

export const getRealtimeFuelMasterAlertsListApi = async (
  {
    id,
    from_date,
    to_date,
    sort,
    limit,
    page,
    search
  }: {
    id: number;
    from_date: string;
    to_date: string;
    sort: string | null;
    limit: number;
    page: number;
    search: string | null;
  },
  token: string
) => {
  return await client.get<
    ApiResponse<FuelMasterListItem[]> & { pagination: FuelMasterPagination }
  >("fuelmaster/list", {
    params: {
      id,
      from_date,
      to_date,
      sort,
      limit,
      page,
      search
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateAcknowledgeFuelmasterApi = async (
  { id }: { id: number },
  token: string
) => {
  return await client.post<ApiResponse<unknown>>("fuelmaster/acknowledge", "", {
    params: {
      id
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getHistoricalFuelMasterAlertsListApi = async (
  {
    id,
    from_date,
    to_date,
    sort,
    limit,
    page,
    search
  }: {
    id: number;
    from_date: string;
    to_date: string;
    sort: string | null;
    limit: number;
    page: number;
    search: string | null;
  },
  token: string
) => {
  return await client.get<
    ApiResponse<FuelMasterListItem[]> & { pagination: FuelMasterPagination }
  >("fuelmaster/historic", {
    params: {
      id,
      from_date,
      to_date,
      sort,
      limit,
      page,
      search
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/* Get Geofence List Details by ID */
export const getGeofenceList = async (
  // params: { id: number },
  id: number,
  token: string
) => {
  return await client.get<VoyageDetailsResponse>("/geofence/list", {
    params: {
      id: id
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/* Delete Geofencing*/
export const deleteGeofenceApi = async (
  params: { id: number },
  token: string
) => {
  return await client.delete<ApiResponse<undefined>>("geofence/delete", {
    params: {
      id: params.id
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

/* Is Active Geofencing*/
export const isActiveGeofenceApi = async (
  params: { id: number; isActive: boolean },
  token: string
) => {
  return await client.post<
    ApiResponse<GeofencingAlertItems & { isAcknowledged: boolean }>
  >("geofence/is-active", "", {
    params: {
      id: params.id,
      isActive: params.isActive
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};
