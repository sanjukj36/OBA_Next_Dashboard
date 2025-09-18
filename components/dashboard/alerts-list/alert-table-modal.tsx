import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertsListTable } from "./alerts-list-table";

type AlertTableModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const AlertTableModal = (props: AlertTableModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[1480px] bg-none p-0"
      >
        <DialogTitle className="sr-only">Alert Table</DialogTitle>
        <AlertsListTable />
      </DialogContent>
    </Dialog>
  );
};
