import Image from "next/image";
import alertIndicationCardBg from "@/assets/alert-indication-barcard-bg.png";
import { AlertStatusPushButtonComponent } from "./alert-status-push-button";

export function AlertIndicationBar() {
  return (
    <div className="relative flex h-[104px] w-full items-center justify-around">
      <Image
        src={alertIndicationCardBg}
        alt="Alert indication bar card bg"
        className="absolute inset-0 -z-10"
      />
      <CriticalAlertStatusCount />
      <ImportantAlertStatusCount />
      <NormalAlertStatusCount />
    </div>
  );
}

function CriticalAlertStatusCount() {
  return (
    <div className="flex items-center gap-4">
      <AlertStatusPushButtonComponent status="critical" alertsCount={10} />
      <p className="font-russo text-lg uppercase">Critical</p>
    </div>
  );
}
function ImportantAlertStatusCount() {
  return (
    <div className="flex items-center gap-4">
      <AlertStatusPushButtonComponent status="important" alertsCount={10} />
      <p className="font-russo text-lg uppercase">Important</p>
    </div>
  );
}
function NormalAlertStatusCount() {
  return (
    <div className="flex items-center gap-4">
      <AlertStatusPushButtonComponent status="normal" alertsCount={10} />
      <p className="font-russo text-lg uppercase">Normal</p>
    </div>
  );
}
