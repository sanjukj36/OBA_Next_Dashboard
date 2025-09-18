import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/provider/auth-provider";
import { useTagAssignStore } from "@/store/tag-assign-form-store";

export function TagAssignToggle() {
  const { showTagAssign, setShowTagAssign } = useTagAssignStore();
  const { user } = useAuth();
  // if (!user?.is_superuser) {
  //   return null;
  // }
  return (
    <div className="flex h-auto items-center">
      <Switch
        checked={showTagAssign}
        onCheckedChange={setShowTagAssign}
        className="relative h-4 w-7 rotate-90 border border-white/90 data-[state=checked]:bg-slate-950 data-[state=unchecked]:bg-slate-950 2xl:h-5 2xl:w-9"
        thumbClassName="data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:2xl:translate-x-[17px] h-2.5 w-2.5 2xl:h-3.5 2xl:w-3.5"
      />
    </div>
  );
}
