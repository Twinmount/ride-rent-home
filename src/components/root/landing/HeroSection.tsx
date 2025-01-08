import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { convertToLabel } from "@/helpers";

type HeroSectionProps = {
  state: string;
  category: string;
};

export default function HeroSection({ state, category }: HeroSectionProps) {
  const words = [
    {
      text: "Rent",
      className: "text-slate-800",
    },

    {
      text: convertToLabel(category),
      className: "text-slate-850",
    },
    {
      text: "In",
      className: "text-slate-800",
    },
    {
      text: convertToLabel(state),
      className: "text-slate-850",
    },
  ];

  return (
    <div className="bg-grid-small-black/[0.2] relative overflow-hidden border-b pb-5">
      {/* radial gradient for the faded look over the edges */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bgGray [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative z-10">
        <div className="container py-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="">
              Discover the best options in {convertToLabel(state)}
            </p>

            <div className="mt-4 max-w-2xl">
              <TypewriterEffect words={words} />
            </div>
            <div className="mt-5 max-w-3xl">
              <p className="text-xl text-muted-foreground">
                Whether you're in {convertToLabel(state)} or exploring beyond,
                find the perfect {convertToLabel(category)} that fits your
                journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
