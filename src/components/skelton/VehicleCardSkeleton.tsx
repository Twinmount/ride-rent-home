import { getVehicleCardStyle } from "@/helpers";
import { Skeleton } from "../ui/skeleton";

export function VehicleCardSkeleton({
  index = 0,
  layoutType = "grid",
}: {
  index?: number;
  layoutType?: "carousel" | "grid";
}) {
  const classes = getVehicleCardStyle(layoutType);
  const imageSkeletonHeight =
    layoutType === "carousel"
      ? "h-[8rem] lg:h-[8.3rem]"
      : "h-[6rem] lg:h-[7.5rem]";

  return (
    <div
      className={`flex w-full max-w-full flex-col gap-3 rounded border border-border-default bg-white p-2 ${classes}`}
    >
      {" "}
      <div className="space-y-3">
        <div className="relative">
          <Skeleton
            className={`w-full rounded bg-gray-300 ${imageSkeletonHeight}`}
          />
          <div className="absolute left-2 top-2 flex gap-1">
            <Skeleton className="h-6 w-12 rounded-full bg-white/80" />
            <Skeleton className="h-6 w-10 rounded-full bg-white/80" />
          </div>
        </div>

        <div className="flex justify-between gap-x-2">
          <Skeleton className="h-4 w-3/4 rounded bg-gray-300" />
          <Skeleton className="h-4 w-8 rounded bg-gray-300" />
        </div>
      </div>
      <div className="flex-between">
        {" "}
        <div className="flex items-center">
          <Skeleton className="h-4 w-10 rounded bg-gray-300" />
          <Skeleton className="ml-1 h-3 w-6 rounded bg-gray-300" />
        </div>
        <Skeleton className="h-7 w-16 rounded bg-gray-300" />
      </div>
    </div>
  );
}
