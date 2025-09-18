import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface DeleteConformModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  subTitle: string;
  description: string;
}

export function DeleteConformModal({
  open,
  onClose,
  onDelete,
  title,
  subTitle,
  description
}: DeleteConformModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-lg rounded-xl bg-primary pb-7 pt-7 text-center font-alexandria shadow-lg [&>button.absolute]:hidden"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[20px] font-medium text-black xl:text-[20px]">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer text-black"
              onClick={onClose}
            />
            {title}
          </div>
          <X className="h-5 w-5 cursor-pointer text-black" onClick={onClose} />
        </div>

        <DialogHeader>
          <DialogTitle className="mb-2 flex justify-center text-lg font-normal text-black">
            {subTitle}
          </DialogTitle>
        </DialogHeader>

        <p className="mb-6 text-lg text-black">{description}</p>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
