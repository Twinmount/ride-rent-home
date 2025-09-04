import { convertToLabel } from '@/helpers';
import MotionSection from '../general/framer-motion/MotionSection';
import CarouselWrapper from '../common/carousel-wrapper/CarouselWrapper';
import { Skeleton } from '../ui/skeleton';

export default function BrandsCarouselSkeleton({ state }: { state: string }) {
  return (
    <MotionSection className="section-container wrapper">
      <h2 className="section-heading">
        Rent from top brands in{' '}
        <span className="rounded-xl bg-theme-gradient px-2 capitalize">
          {convertToLabel(state as string)}
        </span>
      </h2>

      <CarouselWrapper>
        {Array.from({ length: 10 }).map((_, index) => (
          <BrandsCardSkeleton key={index} />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}

function BrandsCardSkeleton() {
  return (
    <Skeleton className="aspect-square h-32 min-h-32 w-32 min-w-32 rounded-2xl bg-gray-200 shadow-sm" />
  );
}
