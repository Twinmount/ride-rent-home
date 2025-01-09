import FeaturesCard from "@/components/card/features-card/FeaturesCard";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps } from "@/types";
import { convertToLabel, createFeatureCards, singularizeType } from "@/helpers";

const Features = ({ state, category }: StateCategoryProps) => {
  const dynamicFeatureCards = createFeatureCards(convertToLabel(state));

  return (
    <MotionSection className="wrapper h-auto pb-12 pt-4">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Enjoy ease and peace of mind when renting a{" "}
        {convertToLabel(singularizeType(category)).toLowerCase()} in{" "}
        {convertToLabel(state)}
      </h2>

      <p className="text-center font-normal">
        Discover the best of Dubai with our affordable and reliable car rental
        service.
        <br /> Whether you&apos;re visiting the main locations or exploring
        hidden gems, our diverse fleet offers the perfect match for your travel
        needs. <br /> Experience hassle-free car rental with transparent pricing
        and no hidden fees.
      </p>
      <br />
      <p className="mx-auto my-0 text-center xl:max-w-[80%]">
        Our commitment to reliability means your vehicle will be ready and
        waiting, wherever and whenever you need it. Choose us for a stress-free
        car rental experience in Dubai, and drive away with confidence and
        comfort.
      </p>

      <div className="m-4 mt-8 grid grid-cols-1 gap-5 p-4 md:grid-cols-2 lg:grid-cols-3">
        {dynamicFeatureCards.map((feature: any) => (
          <FeaturesCard key={feature.key} data={feature} />
        ))}
      </div>
    </MotionSection>
  );
};
export default Features;
