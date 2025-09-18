import { twMerge } from "tailwind-merge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/provider/auth-provider";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

const UserIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 2.08301C11.4699 2.08301 10.4629 2.38847 9.6064 2.96077C8.7499 3.53307 8.08233 4.3465 7.68813 5.2982C7.29392 6.2499 7.19078 7.29712 7.39174 8.30744C7.59271 9.31775 8.08875 10.2458 8.81715 10.9742C9.54555 11.7026 10.4736 12.1986 11.4839 12.3996C12.4942 12.6006 13.5414 12.4974 14.4931 12.1032C15.4448 11.709 16.2583 11.0414 16.8306 10.1849C17.4029 9.32843 17.7083 8.32145 17.7083 7.29134C17.7083 5.91001 17.1596 4.58525 16.1828 3.60849C15.2061 2.63174 13.8813 2.08301 12.5 2.08301ZM12.5 10.4163C11.8819 10.4163 11.2777 10.2331 10.7638 9.88968C10.2499 9.5463 9.8494 9.05825 9.61288 8.48723C9.37635 7.91621 9.31447 7.28787 9.43505 6.68168C9.55562 6.07549 9.85325 5.51867 10.2903 5.08163C10.7273 4.64459 11.2842 4.34697 11.8903 4.22639C12.4965 4.10581 13.1249 4.16769 13.6959 4.40422C14.2669 4.64074 14.755 5.04128 15.0983 5.55518C15.4417 6.06909 15.625 6.67327 15.625 7.29134C15.625 8.12014 15.2958 8.915 14.7097 9.50105C14.1237 10.0871 13.3288 10.4163 12.5 10.4163ZM21.875 21.8747V20.833C21.875 18.8991 21.1068 17.0445 19.7393 15.677C18.3719 14.3096 16.5172 13.5413 14.5833 13.5413H10.4167C8.4828 13.5413 6.62813 14.3096 5.26068 15.677C3.89323 17.0445 3.125 18.8991 3.125 20.833V21.8747H5.20833V20.833C5.20833 19.4517 5.75707 18.1269 6.73382 17.1502C7.71057 16.1734 9.03533 15.6247 10.4167 15.6247H14.5833C15.9647 15.6247 17.2894 16.1734 18.2662 17.1502C19.2429 18.1269 19.7917 19.4517 19.7917 20.833V21.8747H21.875Z"
      fill="white"
    />
  </svg>
);

const CloseDoorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
      fill="white"
    />
  </svg>
);

export const LogoutUser = ({ className }: { className?: string }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div
        className={twMerge(
          "flex items-center px-2 lg:mt-[2px] xl:mt-[2px] 3xl:mt-0 font-alexandria",
          className
        )}
      >
        <div className="h-50 font-alexandria flex items-center gap-2 rounded-lg border border-secondary/50 px-1.5 py-1 lg:left-[-19px] xl:left-[-19px] 3xl:left-0">
          <div className="grid size-[40px] place-items-center rounded-[10px] border border-[#CECECE80]">
            <UserIcon />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="text-[10px] text-muted-foreground">Logged in as</p>
            <p
              title={user?.email ?? "Unkown user"}
              className="max-w-[16ch] truncate text-[11px] 3xl:text-[18px]"
            >
              {user?.email ?? "____"}
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="h-auto self-stretch bg-[#FFFFFF]/50"
          />
          <button
            onClick={handleLogoutClick}
            className="grid size-[40px] place-items-center rounded border transition-colors hover:bg-accent/70"
          >
            <CloseDoorIcon />
          </button>
        </div>
      </div>
      
      {/* logout alert modal */}

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-[523px]  h-[200px] font-alexandria">
          <DialogHeader className="gap-4">
            <DialogTitle className="flex items-center gap-3">
              <TriangleAlert className="text-destructive" /> Confirm Logout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelLogout}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
