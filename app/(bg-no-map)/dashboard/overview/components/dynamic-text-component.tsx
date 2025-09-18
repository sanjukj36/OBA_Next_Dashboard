import { twMerge } from "tailwind-merge";
import { TagAssignComponent } from "@/components/tag-assign";
import { useAuth } from "@/provider/auth-provider";
import { useLatestDataByLabel } from "@/queries/use-latest-data-by-label";

export function DynamicTextComponent({
  label,
  defaultTitle,
  className,
  hideForUser
}: {
  label: string;
  defaultTitle: string;
  className?: string;
  hideForUser?: boolean;
}) {
  const { data: latestData, isError } = useLatestDataByLabel(label);
  const { data: dataArray } = latestData || {};
  const [data] = dataArray || [];
  const { description } = data || {};

  const { user } = useAuth();

  if (hideForUser && !user?.is_superuser && (isError || !description)) {
    return null;
  }

  return (
    <div className={twMerge("relative", className)}>
      {description ?? defaultTitle}
      <TagAssignComponent type="single" tag={label} />
    </div>
  );
}
