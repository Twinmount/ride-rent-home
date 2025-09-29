import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

export default function VehicleCardCarouselSkeleton({
  count = 6,
  layoutType = "carousel",
}: {
  count?: number;
  layoutType?: "grid" | "carousel";
}) {
  return (
    <div className="section-container">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen lg:relative lg:left-auto lg:right-auto lg:ml-0 lg:mr-0 lg:w-full">
        <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[90%] lg:px-1 xl:max-w-full [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <VehicleCardSkeleton index={index} layoutType={layoutType} />
            </div>
          ))}
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
