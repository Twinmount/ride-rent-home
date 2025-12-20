import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

export default function FeaturedVehiclesSkeleton({
  layoutType = "carousel",
}: {
  layoutType?: "grid" | "carousel";
}) {
  return (
    <div className="section-container">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen lg:relative lg:left-auto lg:right-auto lg:ml-0 lg:mr-0 lg:w-full">
        <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[90%] lg:px-1 xl:max-w-full [&::-webkit-scrollbar]:hidden">
          {/* 5 Vehicle Card Skeletons */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <VehicleCardSkeleton index={index} layoutType={layoutType} />
            </div>
          ))}

          {/* ViewAllGrid Skeleton */}
          <div className="flex flex-shrink-0 items-center">
            <ViewAllGridSkeleton />
          </div>
        </div>
        <div
          className="mx-2 md:hidden"
          style={{ minHeight: "76px", paddingTop: "16px" }}
        />{" "}
        {/* Spacer for mobile view */}
      </div>
    </div>
  );
}

// Skeleton for ViewAllGridCard component
function ViewAllGridSkeleton() {
  return (
    <div className="flex items-center">
      <div className="relative flex h-[12rem] w-[10rem] min-w-[10rem] animate-pulse flex-col gap-2 rounded border border-border-default bg-white p-2 md:w-[10.5rem] md:min-w-[10.5rem] lg:w-[11rem] lg:min-w-[11rem]">
        {/* Thumbnail grid skeleton */}
        <div className="relative grid h-auto min-h-[75%] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg border">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-[0.2rem] bg-gray-200"
            />
          ))}

          {/* Center badge skeleton */}
          <div className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300" />
        </div>

        {/* Text skeletons */}
        <div className="text-center">
          <div className="mx-auto mb-1 h-3 w-16 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
