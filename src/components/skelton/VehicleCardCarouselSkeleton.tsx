import CarouselWrapper from "../common/carousel-wrapper/CarouselWrapper";
import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

export default function VehicleCardCarouselSkeleton({
  count = 5,
  layoutType = "grid",
}: {
  count?: number;
  layoutType: "grid" | "carousel";
}) {
  return (
    <CarouselWrapper>
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton
          key={index}
          index={index}
          layoutType={layoutType}
        />
      ))}
    </CarouselWrapper>
  );
}
