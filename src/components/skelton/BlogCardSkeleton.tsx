import { Skeleton } from "../ui/skeleton";

export default function BlogCardSkeleton({ count = 6 }: { count?: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="mx-auto flex w-full min-w-56 max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-lg"
    >
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full bg-gray-300" />

      <div className="h-36 flex-grow p-4">
        {/* Title Skeleton */}
        <Skeleton className="mb-4 h-6 w-2/3 bg-gray-300" />

        {/* Description Skeleton */}
        <Skeleton className="mb-2 h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-5/6 bg-gray-300" />
      </div>
    </div>
  ));
}
