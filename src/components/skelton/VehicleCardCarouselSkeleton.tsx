import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

export default function VehicleCardCarouselSkeleton({
  count = 5,
  layoutType = "carousel",
}: {
  count?: number;
  layoutType?: "grid" | "carousel";
}) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton
          key={index}
          index={index}
          layoutType={layoutType}
        />
      ))}
    </div>
  );
}
