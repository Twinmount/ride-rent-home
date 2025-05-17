import { Skeleton } from "../ui/skeleton";

export default function BlogsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="wrapper my-4 py-8">
      <h2 className="custom-heading w-fit text-center text-2xl font-bold max-md:ml-8 max-md:mr-auto md:mx-auto lg:text-3xl">
        YOU MIGHT ALSO LIKE
      </h2>

      <div className="grid grid-cols-1 gap-2 text-sm max-md:pl-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Generate skeleton items */}
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex w-full items-center gap-1">
            <Skeleton className="h-1 w-1 rounded-full bg-gray-300" />{" "}
            {/* Dot Skeleton */}
            <Skeleton className="h-4 w-11/12 rounded-md bg-gray-300" />{" "}
            {/* Title Skeleton */}
          </div>
        ))}
      </div>
    </div>
  );
}
