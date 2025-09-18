import { ReactNode } from "react";
import { LocationPlaybackContextProvider } from "./location-playback-context";

const LocationPlaybackLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LocationPlaybackContextProvider>
      {children}
    </LocationPlaybackContextProvider>
  );
};

export default LocationPlaybackLayout;
