import FeaturesCard from "@/components/card/features-card/FeaturesCard";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps } from "@/types";
import { getHomePageFeatures } from "@/helpers/homepage-content.helper";
import SafeImage from "@/components/common/SafeImage";

const RideRentFeatures = ({ state, category, country }: StateCategoryProps) => {
  const { heading, description, cards } = getHomePageFeatures({
    country,
    state,
    category,
  });

  return (
    <MotionSection className="no-global-padding relative overflow-hidden py-[0.6875rem] pb-[8.125rem] lg:py-[1.75rem] lg:pb-[5.9375rem]">
      {/* Background gradients */}
      <div
        className="absolute bottom-0 top-0 hidden lg:block"
        style={{
          right: "0%",
          width: "60%",
          background:
            "linear-gradient(139.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 lg:hidden"
        style={{
          height: "80%",
          background:
            "linear-gradient(139.28deg, rgba(255, 255, 255, 0) 55%, rgba(249, 168, 37, 0.7) 100%)",
        }}
      />

      {/* Desktop background images */}
      <div className="absolute inset-0 hidden lg:block">
        <div
          className="absolute bottom-0 left-0"
          style={{ width: "78.5625rem", height: "33.4375rem" }}
        >
          <SafeImage
            src="/assets/img/bg/featuresWideBG.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            loading="lazy"
            quality={75}
            sizes="1258px"
          />
        </div>
        <div
          className="absolute bottom-[0.875rem] right-0"
          style={{ width: "26.625rem", height: "39.5rem" }}
        >
          <SafeImage
            src="/assets/img/bg/featuresBG.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            loading="lazy"
            quality={75}
            sizes="426px"
          />
        </div>
      </div>

      {/* Mustang car decoration */}
      <div className="absolute bottom-0 right-0 z-10">
        <SafeImage
          src="/assets/cars/mustang.webp"
          alt="Red Mustang Car"
          width={350}
          height={350}
          className="h-[8.8125rem] w-[14rem] object-contain drop-shadow-2xl lg:h-[21.875rem] lg:w-auto"
          loading="lazy"
          quality={85}
          sizes="(max-width: 1024px) 224px, 350px"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full lg:ml-14">
        <div className="w-full px-8 sm:px-6 lg:ml-3 lg:w-3/4 lg:px-8 xl:w-2/3">
          {/* Header section */}
          <div className="mb-6 w-full lg:mb-12">
            <h2 className="mb-4 text-center text-lg font-medium text-text-primary sm:text-left sm:text-3xl lg:mb-6 lg:text-4xl">
              {heading}
            </h2>
            <div className="mt-4 space-y-3 text-justify text-xs font-normal text-text-tertiary sm:text-sm lg:mt-6 lg:space-y-4 lg:text-base">
              {description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            {cards.map((feature) => (
              <FeaturesCard
                key={feature.key}
                iconNumber={feature.iconNumber}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

export default RideRentFeatures;
