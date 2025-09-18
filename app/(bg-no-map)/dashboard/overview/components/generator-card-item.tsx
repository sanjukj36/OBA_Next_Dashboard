import { GSNumberTitleCard, GSStatusPushButtonComponent, GSValueBoxComponent } from "@/components/dashboard/overview-black/generators-status-card";
import { useAuth } from "@/provider/auth-provider";
import { useGetTagDetailsQuery } from "@/queries/use-get-tag-details-query";

export function GeneratorsCardItem({ l1, l2, l3 }: { l1: string; l2: string; l3: string; }) {
  const { status: l1S } = useGetTagDetailsQuery(l1);
  const { status: l2S } = useGetTagDetailsQuery(l2);
  const { status: l3S } = useGetTagDetailsQuery(l3);

  const { user } = useAuth();

  function isError(l1s: typeof l1S, l2s: typeof l2S, l3s: typeof l3S) {
    if (l1s === "error" && l2s === "error" && l3s === "error") return true;
    return false;
  }

  if (!user?.is_superuser && isError(l1S, l2S, l3S)) {
    return null;
  }

  return (
    <div className="relative isolate flex h-full flex-col items-center justify-between">
      <GSStatusPushButtonComponent label={l1} />
      <GSNumberTitleCard label={l2} />
      <GSValueBoxComponent label={l3} />
    </div>
  );
}
