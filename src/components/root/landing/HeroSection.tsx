import { SectionHeading } from "@/components/common/SectionHeading";
import { convertToLabel, singularizeValue } from "@/helpers";

type HeroSectionProps = {
  state: string;
  category: string;
};

export default function HeroSection({ state, category }: HeroSectionProps) {
  const formattedState = convertToLabel(state);
  const formattedCategory = singularizeValue(convertToLabel(category));
  return (
    <SectionHeading
      title={`Rent a ${formattedCategory} in ${formattedState}`}
      subtitle="Explore 1000+ options & pick your favorite, from the Toyota Yaris to the Ferrari 296 GTB."
      isHero
    />
  );
}
