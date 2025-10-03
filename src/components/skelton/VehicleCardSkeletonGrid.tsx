import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

export function VehicleCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="wrapper mx-auto grid w-full max-w-full grid-cols-1 place-content-center place-items-center !gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
}
