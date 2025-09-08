import { getVehicleCardStyle } from "@/helpers";
import MotionStaggeredDiv from "../general/framer-motion/MotionStaggeredDiv";

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
    <MotionStaggeredDiv
      index={index}
      className={`flex w-full max-w-full flex-col gap-3 rounded border border-border-default bg-white p-2 ${classes}`}
    >
      {/* Image Skeleton */}
      <Skeleton
        className={`w-full rounded-[0.3rem] bg-gray-300 ${imageSkeletonHeight}`}
      />

      <div className="flex flex-grow flex-col">
        {/* Title Skeleton */}
        <Skeleton className="mb-2 h-5 w-11/12 rounded-[0.3rem] bg-gray-300" />

        <div className="mt-auto flex h-9 items-center gap-x-2">
          <Skeleton className="h-full w-10 min-w-12 rounded-[0.3rem] bg-gray-300" />
          <Skeleton className="h-full w-8 min-w-12 rounded-[0.3rem] bg-gray-300" />

          <Skeleton className="h-full w-full rounded-[0.3rem] bg-gray-300" />
        </div>
      </div>
    </MotionStaggeredDiv>
  );
}

export default function VehicleCardSkeletonGrid({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="wrapper mx-auto grid w-full max-w-full grid-cols-1 place-content-center place-items-center !gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
}
