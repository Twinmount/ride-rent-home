import { Skeleton } from "../ui/skeleton";

export default function PopularCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full rounded-xl bg-white p-2 shadow-lg md:min-w-[17rem] md:max-w-[20rem]">
      <h2 className="custom-heading font-semibold text-gray-700 max-md:ml-2">
        Popular
      </h2>
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="mb-1 flex items-center gap-2 border-b border-gray-200 p-0"
          >
            {/* Image Skeleton */}
            <Skeleton className="h-20 w-20 rounded-md bg-gray-300" />

            {/* Text Info Skeleton */}
            <div className="flex-grow py-1 pl-1">
              {/* Title Skeleton */}
              <Skeleton className="mb-2 h-4 w-3/4 bg-gray-300" />

              {/* Description Skeleton */}
              <Skeleton className="mb-1 h-3 w-full bg-gray-300" />
              <Skeleton className="h-3 w-5/6 bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
