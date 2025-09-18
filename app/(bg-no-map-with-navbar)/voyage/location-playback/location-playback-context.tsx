"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  LocationPlaybackStoreState,
  useLocationPlaybackStore
} from "@/store/location-playback-store";
import { App } from "@/lib/constants";

type LocationPlaybackContextType = Omit<
  LocationPlaybackStoreState,
  "setFilteredNavList" | "hydrated" | "setHydrated"
>;

const LocationPlaybackContext = createContext<
  LocationPlaybackContextType | undefined
>(undefined);

export const LocationPlaybackContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const {
    currentNavList,
    setCurrentNavList,
    filteredNavList,
    setFilteredNavList,
    from_date,
    to_date,
    setFrom,
    setTo,
    setSelectedDate,
    selectedDate,
    prevSelectedDate,
    setPrevSelectedDate,
    cachePlaybackData,
    setCachePlaybackData,
    initialDate,
    setInitialDate
  } = useLocationPlaybackStore();

  useEffect(() => {
    const selecteIds = currentNavList.map(item => item.id);
    const filteredItem = locationPlaybackNavlistItem.filter(
      item => !selecteIds.includes(item.id)
    );
    setFilteredNavList(filteredItem);
  }, [currentNavList, setFilteredNavList]);

  useEffect(() => {
    sessionStorage.removeItem(App.PayloadCordsSessionKey)
  }, [from_date, to_date])

  return (
    <LocationPlaybackContext.Provider
      value={{
        currentNavList,
        setCurrentNavList,
        filteredNavList,
        from_date,
        setFrom,
        to_date,
        setTo,
        setSelectedDate,
        selectedDate,
        prevSelectedDate,
        setPrevSelectedDate,
        cachePlaybackData,
        setCachePlaybackData,
        initialDate,
        setInitialDate
      }}
    >
      {children}
    </LocationPlaybackContext.Provider>
  );
};

export const useLocationPlayback = () => {
  const context = useContext(LocationPlaybackContext);
  if (!context)
    throw new Error(
      "`useLocationPlayback` must be used inside `LocationPlaybackContext`"
    );

  return context;
};

export type LocationPlaybackNavlistItem = {
  name: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  id: string;
};

export const locationPlaybackNavlistItem: LocationPlaybackNavlistItem[] = [
  { name: "Main Engines", icon: NIMainEnginesIcon, id: "main-engines" },
  {
    name: "Diesel Generators",
    icon: NIDieselGeneratorIcon,
    id: "diesel-generators"
  },
  {
    name: "Configured Parameters",
    icon: NIConfParamIcon,
    id: "configured-parameters"
  },
  {
    name: "Speed",
    icon: NISpeedIcon,
    id: "speed"
  }
];

function NIMainEnginesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.5 9.75H21.3103L18 6.43969C17.8612 6.29979 17.696 6.18888 17.514 6.1134C17.332 6.03792 17.1367 5.99937 16.9397 6H13.125V3.75H15.375C15.5739 3.75 15.7647 3.67098 15.9053 3.53033C16.046 3.38968 16.125 3.19891 16.125 3C16.125 2.80109 16.046 2.61032 15.9053 2.46967C15.7647 2.32902 15.5739 2.25 15.375 2.25H9.375C9.17609 2.25 8.98532 2.32902 8.84467 2.46967C8.70402 2.61032 8.625 2.80109 8.625 3C8.625 3.19891 8.70402 3.38968 8.84467 3.53033C8.98532 3.67098 9.17609 3.75 9.375 3.75H11.625V6H6C5.60218 6 5.22064 6.15804 4.93934 6.43934C4.65804 6.72064 4.5 7.10218 4.5 7.5V12.375H2.25V10.125C2.25 9.92609 2.17098 9.73532 2.03033 9.59467C1.88968 9.45402 1.69891 9.375 1.5 9.375C1.30109 9.375 1.11032 9.45402 0.96967 9.59467C0.829018 9.73532 0.75 9.92609 0.75 10.125V16.125C0.75 16.3239 0.829018 16.5147 0.96967 16.6553C1.11032 16.796 1.30109 16.875 1.5 16.875C1.69891 16.875 1.88968 16.796 2.03033 16.6553C2.17098 16.5147 2.25 16.3239 2.25 16.125V13.875H4.5V15.8147C4.49937 16.0117 4.53792 16.207 4.6134 16.389C4.68888 16.571 4.79979 16.7362 4.93969 16.875L8.625 20.5603C8.76378 20.7002 8.92899 20.8111 9.11102 20.8866C9.29304 20.9621 9.48826 21.0006 9.68531 21H16.9397C17.1367 21.0006 17.332 20.9621 17.514 20.8866C17.696 20.8111 17.8612 20.7002 18 20.5603L21.3103 17.25H22.5C22.8978 17.25 23.2794 17.092 23.5607 16.8107C23.842 16.5294 24 16.1478 24 15.75V11.25C24 10.8522 23.842 10.4706 23.5607 10.1893C23.2794 9.90804 22.8978 9.75 22.5 9.75ZM22.5 15.75H21C20.9015 15.7499 20.8039 15.7693 20.7129 15.8069C20.6218 15.8445 20.5391 15.8997 20.4694 15.9694L16.9397 19.5H9.68531L6 15.8147V7.5H16.9397L20.4694 11.0306C20.5391 11.1003 20.6218 11.1555 20.7129 11.1931C20.8039 11.2307 20.9015 11.2501 21 11.25H22.5V15.75Z"
        fill="white"
      />
    </svg>
  );
}
function NIDieselGeneratorIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V19H0.5V2C0.5 1.17157 1.17157 0.5 2 0.5Z"
        stroke="white"
      />
      <path
        d="M10.5 4.5H5.9184L3 10.5H5.9184L3.4197 16.5L10.0822 9H6.75L10.5 4.5Z"
        fill="white"
      />
      <rect x="12" y="4.5" width="9" height="3" rx="1.5" fill="white" />
      <rect x="12" y="12" width="9" height="3" rx="1.5" fill="white" />
    </svg>
  );
}
function NIConfParamIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.66536 1.83398V18.334H20.1654V20.1673H1.83203V1.83398H3.66536ZM14.6654 5.50065H20.1654V11.0007H18.332V8.6384L16.8846 10.0822L14.3968 12.5645L13.7487 13.2126L10.082 9.5459L5.4987 14.1292L4.20253 12.834L10.082 6.95357L13.7487 10.6202L15.5903 8.78415L17.0432 7.33398H14.6654V5.50065Z"
        fill="white"
      />
    </svg>
  );
}
function NISpeedIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.45 15.5C10.85 15.9 11.3667 16.096 12 16.088C12.6333 16.08 13.1 15.8507 13.4 15.4L19 7L10.6 12.6C10.15 12.9 9.91267 13.3583 9.888 13.975C9.86333 14.5917 10.0507 15.1 10.45 15.5ZM12 4C12.9833 4 13.9293 4.13733 14.838 4.412C15.7467 4.68667 16.6007 5.09933 17.4 5.65L15.5 6.85C14.95 6.56667 14.3793 6.35433 13.788 6.213C13.1967 6.07167 12.6007 6.00067 12 6C9.78333 6 7.89567 6.77933 6.337 8.338C4.77833 9.89667 3.99933 11.784 4 14C4 14.7 4.096 15.3917 4.288 16.075C4.48 16.7583 4.75067 17.4 5.1 18H18.9C19.2833 17.3667 19.5627 16.7083 19.738 16.025C19.9133 15.3417 20.0007 14.6333 20 13.9C20 13.3 19.929 12.7167 19.787 12.15C19.645 11.5833 19.4327 11.0333 19.15 10.5L20.35 8.6C20.85 9.38333 21.246 10.2167 21.538 11.1C21.83 11.9833 21.984 12.9 22 13.85C22.016 14.8 21.9077 15.7083 21.675 16.575C21.4423 17.4417 21.1007 18.2667 20.65 19.05C20.4667 19.35 20.2167 19.5833 19.9 19.75C19.5833 19.9167 19.25 20 18.9 20H5.1C4.75 20 4.41667 19.9167 4.1 19.75C3.78333 19.5833 3.53333 19.35 3.35 19.05C2.91667 18.3 2.58333 17.5043 2.35 16.663C2.11667 15.8217 2 14.934 2 14C2 12.6167 2.26267 11.321 2.788 10.113C3.31333 8.905 4.03 7.84667 4.938 6.938C5.846 6.02933 6.90833 5.31267 8.125 4.788C9.34167 4.26333 10.6333 4.00067 12 4Z"
        fill="white"
      />
    </svg>
  );
}
