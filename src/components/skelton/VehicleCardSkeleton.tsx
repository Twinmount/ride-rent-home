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
      {/* Top Section */}
      <div className="h-full w-full space-y-3">
        {/* Image with Badges */}
        <div className="relative">
          <Skeleton
            className={`w-full rounded bg-gray-300 ${imageSkeletonHeight}`}
          />

          {/* Simple Badges */}
          <div className="absolute left-2 top-2 flex gap-1">
            <Skeleton className="h-6 w-12 rounded-full bg-white/80" />
            <Skeleton className="h-6 w-10 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-between gap-x-2">
          <Skeleton className="h-4 w-3/4 rounded bg-gray-300" />
          <Skeleton className="h-4 w-8 rounded bg-gray-300" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Price */}
        <div className="flex items-center">
          <Skeleton className="h-4 w-10 rounded bg-gray-300" />
          <Skeleton className="ml-1 h-3 w-6 rounded bg-gray-300" />
        </div>

        {/* Button - FIXED THE CLASS ORDER */}
        <Skeleton
          className={`rounded bg-gray-300 ${
            layoutType === "carousel" ? "h-6 w-16" : "w-18 h-7"
          }`}
        />
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
