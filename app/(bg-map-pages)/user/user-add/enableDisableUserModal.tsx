import React from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export const EnableDisableUserModal = ({
  open,
  onClose,
  onConfirm,
  isActive
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isActive: boolean;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[708px] rounded-xl bg-primary pb-7 pt-7 text-center shadow-lg [&>button.absolute]:hidden"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xm flex items-center gap-2 font-bold text-foreground">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer text-black"
              onClick={onClose}
            />
            <p className="text-black"> User Access</p>
          </div>
          <X className="h-5 w-5 cursor-pointer text-black" onClick={onClose} />
        </div>

        <DialogHeader>
          <DialogTitle className="mb-2 flex justify-center text-lg font-normal text-black">
            {isActive ? "Disable User" : "Enable User"}
          </DialogTitle>
        </DialogHeader>

        <p className="mb-6 text-lg text-black">
          Are you sure you want to {isActive ? "disable" : "enable"} this user?
        </p>

        <div className="flex justify-end gap-4">
          <Button variant="destructive" onClick={onConfirm}>
            Yes
          </Button>
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
