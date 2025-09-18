import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmClick: () => void;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  onConfirmClick
}: ConfirmationModalProps) {
  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded border border-primary/30 bg-black/90 backdrop-blur-sm sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogDescription>
            Are you sure you want to discard all the changes?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-1 sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline" className="border-input/50">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={onConfirmClick} variant="destructive">
              Discard
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
