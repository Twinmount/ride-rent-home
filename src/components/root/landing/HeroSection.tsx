import { SearchDialog } from "@/components/navbar/SearchDialog";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { convertToLabel } from "@/helpers";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type HeroSectionProps = {
  state: string;
  category: string;
};

// Helper function to generate the words array
const generateWordsArray = (state: string, category: string) => {
  const splitIntoWords = (text: string, className: string) => {
    return text.split(" ").map((word) => ({
      text: word,
      className,
    }));
  };

  return [
    { text: "Rent", className: "text-slate-800" },
    ...splitIntoWords(convertToLabel(category), "text-slate-850"),
    { text: "In", className: "text-slate-800" },
    ...splitIntoWords(convertToLabel(state), "text-slate-850"),
  ];
};

export default function HeroSection({ state, category }: HeroSectionProps) {
  const words = generateWordsArray(state, category);

  return (
    <div className="relative overflow-hidden border-b bg-bgGray pb-5 bg-grid-small-black/[0.3]">
      {/* radial gradient for the faded look over the edges */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bgGray [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10">
        <div className="container py-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="">Discover the best options in Ride.Rent</p>

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
          <SearchDialog isHero={true} />
        </div>
      </div>
    </div>
  );
}
