import { LineChartCardBig } from "@/components/dashboard/overview-black/line-chart-card-big";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";

type TrendModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const TrendModal = (props: TrendModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="rounded-[70px] border-none bg-transparent p-0 ring-transparent lg:max-w-[984px] xl:max-w-[1200px] 3xl:max-w-[1560px]"
      >
        <DialogTitle className="sr-only">Trend Modal</DialogTitle>
        <LineChartCardBig />
      </DialogContent>
    </Dialog>
  );
};
