"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState
} from "react";

type ChartRange = { left: number; right: number };

type LineChartBigContextType = {
  range: ChartRange;
  setRange: Dispatch<React.SetStateAction<ChartRange>>;
  showZoom: boolean;
  setShowZoom: Dispatch<React.SetStateAction<boolean>>;
};

const LineChartBigContext = createContext<LineChartBigContextType | undefined>(
  undefined
);

export const LineChartBigContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [showZoom, setShowZoom] = useState<boolean>(false);
  const [range, setRange] = useState<ChartRange>({ left: 0, right: 0 });
  return (
    <LineChartBigContext.Provider
      value={{
        showZoom,
        setShowZoom,
        range,
        setRange
      }}
    >
      {children}
    </LineChartBigContext.Provider>
  );
};

export const useLineChartBig = () => {
  const context = useContext(LineChartBigContext);
  if (!context)
    throw new Error("useLineChartBig must be used inside LineChartBigContext");

  return context;
};
