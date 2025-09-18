import { X } from "lucide-react";
import { useAlertTable } from "./alert-list-table-context";

export function AlertsListTableTitle() {
  const { setAlertTabShow } = useAlertTable();
  const totalAlertCount = 40;
  return (
    <div className="relative text-center">
      <div className="flex items-center justify-start gap-x-[388px] font-russo text-3xl text-input">
        <h2 className="ms-2 font-russo text-3xl text-input">ALERTS</h2>
        <span>
          TOTAL NO OF ALERTS : <span>{totalAlertCount}</span>
        </span>
        <button onClick={() => setAlertTabShow(false)}>
          <X className="absolute right-4 top-0 h-8 w-8 cursor-pointer text-input" />
        </button>
      </div>
    </div>
  );
}
