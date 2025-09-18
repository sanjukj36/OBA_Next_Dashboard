"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState
} from "react";
import { subDays } from "date-fns";
import { App } from "@/lib/constants";
import { TrendModal } from "./trend-modal";

type TagName = {
  tag1: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  tag1Label?: string;
  tag2Label?: string;
  tag3Label?: string;
  tag4Label?: string;
};

type TrendContextType = {
  trendTagName: TagName | null;
  setTrendTagName: Dispatch<React.SetStateAction<TagName | null>>;
  showTrendModal: boolean;
  setShowTrendModal: Dispatch<React.SetStateAction<boolean>>;
  from: Date;
  setFrom: Dispatch<React.SetStateAction<Date>>;
  to: Date;
  setTo: Dispatch<React.SetStateAction<Date>>;
};

const TrendContext = createContext<TrendContextType | undefined>(undefined);

export const TrendContextProvider = ({ children }: { children: ReactNode }) => {
  const [alertType, setAlertType] = useState<TagName | null>(null);
  const [alertTabShow, setAlertTabShow] = useState<boolean>(false);
  const [from, setFrom] = useState<Date>(
    subDays(new Date(), App.BigLineChartDefaultDuration)
  );
  const [to, setTo] = useState<Date>(new Date());
  return (
    <TrendContext.Provider
      value={{
        trendTagName: alertType,
        setTrendTagName: setAlertType,
        showTrendModal: alertTabShow,
        setShowTrendModal: setAlertTabShow,
        from,
        setFrom,
        to,
        setTo
      }}
    >
      {children}
      <TrendModal open={alertTabShow} onOpenChange={setAlertTabShow} />
    </TrendContext.Provider>
  );
};

export const useShowTrend = () => {
  const context = useContext(TrendContext);
  if (!context)
    throw new Error("useShowTrend must be used inside TrendContext");

  return context;
};
