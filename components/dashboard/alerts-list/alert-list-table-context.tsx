"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { AlertStatus } from "@/types/alert-statut";
import { AlertTableModal } from "./alert-table-modal";

type AlertTableContext = {
  alertType: AlertStatus | null;
  setAlertType: (type: AlertStatus | null) => void;
  alertTabShow: boolean;
  setAlertTabShow: (alertTabShow: boolean) => void;
};

const AlertTableContext = createContext<AlertTableContext | undefined>(
  undefined
);

export const AlertTableContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [alertType, setAlertType] = useState<AlertStatus | null>(null);
  const [alertTabShow, setAlertTabShow] = useState<boolean>(false);
  return (
    <AlertTableContext.Provider
      value={{ alertType, setAlertType, alertTabShow, setAlertTabShow }}
    >
      {children}
      <AlertTableModal open={alertTabShow} onOpenChange={setAlertTabShow} />
    </AlertTableContext.Provider>
  );
};

export const useAlertTable = () => {
  const context = useContext(AlertTableContext);
  if (!context)
    throw new Error("useAlertTable must be used inside AlertTableContext");

  return context;
};
