import MotionSection from "../general/framer-motion/MotionSection";
import { Skeleton } from "../ui/skeleton";

export default function StatesGridSkeleton() {
  return (
    <MotionSection className="wrapper section-container">
      <h2 className="section-heading">
        Find Vehicle Rental Offers In Other States
      </h2>

      <div className="mx-auto mb-[1.5rem] grid w-fit auto-rows-auto grid-cols-2 justify-items-center gap-[1.4rem] md:grid-cols-3 lg:grid-cols-4">
        {/* Map through states and render each one */}
        {Array.from({ length: 8 }).map((_, index) => (
          <StateCardSkeleton key={index} />
        ))}
      </div>
    </MotionSection>
  );
}

export function StateCardSkeleton() {
  return (
    <Skeleton className="aspect-square h-[7rem] w-full min-w-[10rem] max-w-[12rem] rounded-[2rem] bg-gray-200 shadow-sm" />
  );
}
