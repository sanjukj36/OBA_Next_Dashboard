import { twMerge } from "tailwind-merge";
import { AlertStatus } from "@/types/alert-statut";
import { useAlertTable } from "./alert-list-table-context";

export function AlertsListTableTab() {
  const { alertType } = useAlertTable();

  const borderStyles: Record<AlertStatus, string> & { default: string } = {
    critical: "border-2 border-[#FF2525] bg-[#FF00001A] shadow-alert-critical",
    normal: "border-2 border-[#00FFACB2] bg-[#0B85151A] shadow-alert-normal",
    important:
      "border-2 border-[#FFF90BB2] bg-[#D7AC001A] shadow-alert-important",
    default:
      "border-2 border-transparent before:absolute before:content-[''] before:-inset-[0px] before:rounded-[25px]  before:bg-black before:z-10 after:absolute after:content-[''] after:-inset-[2px] after:rounded-[25px]  after:bg-gradient-to-br after:from-[#919191] after:via-[#2B2B2B] after:to-[#5E5E5E] after:z-0  "
  };

  return (
    <div
      style={{ boxShadow: "0px 0px 3.6px 0px #FFFFFF" }}
      className="rounded-[30px] bg-black p-1.5"
    >
      <div
        className={twMerge(
          "relative isolate rounded-[25px] p-1.5 transition-all duration-300",
          borderStyles[alertType ?? "default"]
        )}
      >
        <div className="relative z-20 flex justify-evenly rounded-[15px] border border-white/50 px-2 py-4">
          <AlertListTableTabItem alertCount={10} alertType="critical" />
          <AlertListTableTabItem alertCount={0} alertType="important" />
          <AlertListTableTabItem alertCount={0} alertType="normal" />
        </div>
      </div>
    </div>
  );
}

type AlertListTableTabItemProps = {
  alertCount: number;
  alertType: AlertStatus;
};
function AlertListTableTabItem({
  alertCount,
  alertType
}: AlertListTableTabItemProps) {
  const alertTitles: Record<AlertStatus, string> = {
    critical: "CRITICAL",
    normal: "NORMAL",
    important: "IMPORTANT"
  };
  const buttonStyles: Record<AlertStatus, string> = {
    critical:
      "shadow-[0_0_8px_2px_#FF0000] ring-2 ring-[#FF2525] text-shadow-critical bg-[#FF00001A]",
    normal:
      "shadow-[0_0_8px_2px_#00FF00] ring-2 ring-[#00FFAC] text-shadow-normal bg-[#0B85151A]",
    important:
      "shadow-[0_0_8px_2px_#D7AC00] ring-2 ring-[#FFF90B] text-shadow-important  bg-[#D7AC001A]"
  };

  const underlineStyles: Record<AlertStatus, string> = {
    critical: "#FF0000",
    normal: "#00FF00",
    important: "#D7AC00"
  };

  const { setAlertType, alertType: storeAlertType } = useAlertTable();

  return (
    <button
      onClick={() => {
        setAlertType(alertType === storeAlertType ? null : alertType);
      }}
      className={twMerge(
        "flex items-center gap-6 opacity-70",
        (alertType === storeAlertType || storeAlertType === null) &&
          "opacity-100"
      )}
    >
      <span
        className={twMerge(
          "rounded-md px-6 py-1 font-russo text-2xl text-input",
          buttonStyles[alertType]
        )}
      >
        {alertCount}
      </span>
      <span className="relative font-russo text-2xl text-white">
        {alertTitles[alertType]}
        <span
          style={
            {
              "--alert-shadow-color": underlineStyles[alertType]
            } as React.CSSProperties
          }
          className={twMerge(
            "absolute bottom-0 left-1/2 right-1/2 h-0.5 rounded-lg bg-white opacity-0 shadow-[0px_2px_4px_0px_var(--alert-shadow-color)] transition-all duration-300",
            storeAlertType === alertType && "left-0 right-0 opacity-100"
          )}
        />
      </span>
    </button>
  );
}
