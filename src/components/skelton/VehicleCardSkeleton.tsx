import { Skeleton } from "../ui/skeleton";

export default function VehicleCardSkeleton({ count = 6 }: { count?: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm mx-auto w-full min-w-56 flex flex-col"
    >
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48 bg-gray-300" />

      <div className="p-4 h-36 flex-grow">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-2/3 bg-gray-300 mb-4" />

        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full bg-gray-300 mb-2" />
        <Skeleton className="h-4 w-5/6 bg-gray-300" />
      </div>
    </div>
  ));
}
