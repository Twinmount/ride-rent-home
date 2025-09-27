import FeaturesCard from '@/components/card/features-card/FeaturesCard';
import MotionSection from '@/components/general/framer-motion/MotionSection';
import { StateCategoryProps } from '@/types';
import { getHomePageFeatures } from '@/helpers/homepage-content.helper';
import Image from "next/image";

const Features = ({ state, category, country }: StateCategoryProps) => {
  const { heading, description, cards } = getHomePageFeatures({
    country,
    state,
    category,
  });

  return (
    <MotionSection className="no-global-padding relative overflow-hidden py-[0.6875rem] pb-[8.125rem] lg:py-[1.75rem] lg:pb-[5.9375rem]">
      {/* Main background container */}
      <div className="absolute left-0 right-0 top-0 z-0 h-full"></div>

      {/* Desktop gradient overlay */}
      <div
        className="absolute bottom-0 top-0 hidden lg:block"
        style={{
          right: "0%",
          width: "60%",
          background:
            "linear-gradient(139.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)",
        }}
      ></div>

      {/* Mobile gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 lg:hidden"
        style={{
          height: "80%",
          background:
            "linear-gradient(139.28deg, rgba(255, 255, 255, 0) 55%, rgba(249, 168, 37, 0.7) 100%)",
        }}
      ></div>

      {/* ✅ Optimized background images with Next.js Image */}
      <div className="z-1 absolute inset-0 hidden lg:block">
        <div
          className="absolute bottom-0 left-0"
          style={{ width: "78.5625rem", height: "33.4375rem" }}
        >
          <Image
            src="/assets/img/bg/featuresWideBG.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            loading="lazy" // ✅ Not critical for LCP
            quality={75} // ✅ Lower quality for background
            sizes="1258px"
          />
        </div>

        <div
          className="absolute bottom-[0.875rem] right-0"
          style={{ width: "26.625rem", height: "39.5rem" }}
        >
          <Image
            src="/assets/img/bg/featuresBG.webp"
            alt=""
            fill
            className="object-cover pb-[0.875rem] opacity-30"
            loading="lazy"
            quality={75}
            sizes="426px"
          />
        </div>
      </div>

      {/* ✅ Optimized Mustang car image */}
      <div className="absolute bottom-0 right-0 z-10">
        <div className="relative flex items-end justify-end">
          <Image
            src="/assets/cars/mustang.webp"
            alt="Red Mustang Car"
            width={350} // ✅ Set proper dimensions
            height={350}
            className="h-[8.8125rem] w-[14rem] object-contain drop-shadow-2xl sm:lg:max-h-[15.625rem] lg:h-[21.875rem] lg:max-h-[20.3125rem] lg:w-auto"
            priority={false} // ✅ Not critical for LCP
            loading="eager" // ✅ Visible above fold
            quality={85}
            sizes="(max-width: 1024px) 224px, 350px"
          />
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 mx-auto w-full lg:ml-14">
        <div className="w-full px-[2rem] sm:px-[1.5rem] lg:ml-[0.6875rem] lg:w-3/4 lg:px-[2rem] xl:w-2/3">
          <div className="mb-[1.5rem] w-full lg:mb-[3rem] lg:w-[58.375rem] lg:max-w-[58.375rem]">
            {/* ✅ Optimized heading with proper semantic HTML */}
            <h2 className="mb-[1rem] text-center text-[1.125rem] font-medium leading-[1] text-text-primary sm:text-left sm:text-[1.75rem] lg:mb-[1.5rem] lg:text-[2.2rem]">
              {heading}
            </h2>

            {/* ✅ Optimized description rendering */}
            <div className="mt-[1rem] space-y-[0.75rem] text-justify font-poppins text-[0.75rem] font-normal leading-[130%] tracking-[0%] text-text-tertiary sm:text-[0.875rem] lg:mt-[1.5rem] lg:w-[62.18rem] lg:space-y-[1rem] lg:text-[0.9375rem] lg:leading-[120%]">
              {description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* ✅ Optimized feature cards grid */}
          <div className="w-full lg:max-w-[69.5rem]">
            <div className="grid grid-cols-1 gap-[1rem] lg:grid-cols-2 lg:gap-[2rem]">
              {cards.map((feature) => (
                <FeaturesCard
                  key={feature.key}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

export default Features;
