import MotionMainCardDiv from "../general/framer-motion/MotionMainCardDiv";
import { Skeleton } from "../ui/skeleton";

export function VehicleCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <MotionMainCardDiv
      index={index}
      className="mx-auto flex !w-full min-w-[17.3rem] max-w-96 flex-col overflow-hidden rounded-2xl bg-white p-[0.3rem] shadow-lg"
    >
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-2xl bg-gray-300" />

      <div className="flex h-44 flex-grow flex-col p-2">
        {/* Title Skeleton */}
        <Skeleton className="mb-4 h-5 w-11/12 rounded-xl bg-gray-300" />

        {/* Description Skeleton */}
        <Skeleton className="mb-2 mt-3 h-4 w-3/4 rounded-xl bg-gray-300" />
        <Skeleton className="h-4 w-2/4 rounded-xl bg-gray-300" />

        <div className="mt-auto flex h-11 items-center gap-x-2">
          <Skeleton className="h-full w-full rounded-xl bg-gray-300" />
          <Skeleton className="h-full w-12 min-w-12 rounded-xl bg-gray-300" />
          <Skeleton className="h-full w-12 min-w-12 rounded-xl bg-gray-300" />
        </div>
      </div>
    </MotionMainCardDiv>
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

export function ListingVehicleCardSkeletonGrid({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="mx-auto grid w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
}
