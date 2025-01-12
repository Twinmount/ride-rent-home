import { SearchDialog } from "@/components/navbar/SearchDialog";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { convertToLabel } from "@/helpers";

type HeroSectionProps = {
  state: string;
  category: string;
};

export default function HeroSection({ state, category }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b pb-5 bg-grid-small-black/[0.3]">
      {/* radial gradient for the faded look over the edges */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bgGray [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10">
        <div className="container py-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="">Discover the best options in Ride.Rent</p>

            <div className="mt-4 max-w-2xl">
              <TypewriterEffect state={state} category={category} />
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-base text-muted-foreground lg:text-lg">
                Whether you&apos;re in {convertToLabel(state)} or exploring
                beyond, find the perfect {convertToLabel(category)} that fits
                your journey.
              </p>
            </div>
          </div>
          <SearchDialog isHero={true} />
        </div>
      </div>
    </section>
  );
}
