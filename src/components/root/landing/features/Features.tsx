import FeaturesCard from '@/components/card/features-card/FeaturesCard';
import MotionSection from '@/components/general/framer-motion/MotionSection';
import { StateCategoryProps } from '@/types';
import { getHomePageFeatures } from '@/helpers/homepage-content.helper';

const Features = ({ state, category, country }: StateCategoryProps) => {
  // Generate dynamic feature cards based on state
  // const dynamicFeatureCards = createFeatureCards(convertToLabel(state));
  // const formattedCategory = convertToLabel(singularizeValue(category));

  const { heading, description, cards } = getHomePageFeatures({
    country,
    state,
    category,
  });

  return (
    // Main section container with responsive padding
    <MotionSection className="no-global-padding relative overflow-hidden py-[0.6875rem] pb-[8.125rem] lg:py-[1.75rem] lg:pb-[5.9375rem]">
      {/* Main background container */}
      <div className="absolute left-0 right-0 top-0 z-0 h-full"></div>

      {/* Desktop orange/yellow gradient overlay */}
      <div
        className="absolute bottom-0 top-0 hidden lg:block"
        style={{
          right: '0%',
          width: '60%',
          background:
            'linear-gradient(139.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)',
        }}
      ></div>

      {/* Mobile yellow gradient with different positioning */}
      <div
        className="absolute bottom-0 left-0 right-0 lg:hidden"
        style={{
          height: '80%',
          background:
            'linear-gradient(139.28deg, rgba(255, 255, 255, 0) 55%, rgba(249, 168, 37, 0.7) 100%)',
        }}
      ></div>

      {/* Background building images for desktop only */}
      <div className="z-1 absolute inset-0 hidden lg:block">
        <div
          className="absolute bottom-0 left-0"
          style={{ width: '78.5625rem', height: '33.4375rem' }}
        >
          <img
            src="/assets/img/bg/featuresWideBG.png"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        </div>

        <div
          className="absolute bottom-[0.875rem] right-0"
          style={{ width: '26.625rem', height: '39.5rem' }}
        >
          <img
            src="/assets/img/bg/featuresBG.png"
            alt=""
            className="h-full w-full object-cover pb-[0.875rem] opacity-30"
          />
        </div>
      </div>

      {/* Responsive car image positioned absolutely */}
      <div className="absolute bottom-0 right-0 z-10">
        <div className="relative flex items-end justify-end">
          <img
            src="/assets/cars/mustang.png"
            alt="Red Mustang Car"
            className="h-[8.8125rem] w-[14rem] object-contain drop-shadow-2xl sm:lg:max-h-[15.625rem] lg:h-[21.875rem] lg:max-h-[20.3125rem] lg:w-auto"
          />
        </div>
      </div>

      {/* Main content container with max width constraint */}
      <div className="relative z-10 mx-auto w-full lg:ml-14">
        {/* Text content section with responsive width */}
        <div className="w-full px-[2rem] sm:px-[1.5rem] lg:ml-[0.6875rem] lg:w-3/4 lg:px-[2rem] xl:w-2/3">
          {/* Header section with title and description */}
          <div className="mb-[1.5rem] w-full lg:mb-[3rem] lg:w-[58.375rem] lg:max-w-[58.375rem]">
            {/* Main title with responsive typography */}
            <h2 className="mb-[1rem] text-center text-[1.125rem] font-medium leading-[1] text-text-primary sm:text-left sm:text-[1.75rem] lg:mb-[1.5rem] lg:text-[2.2rem]">
              {heading}
            </h2>

            {/* Description paragraphs with responsive spacing */}
            <div className="mt-[1rem] space-y-[0.75rem] text-justify font-poppins text-[0.75rem] font-normal leading-[130%] tracking-[0%] text-text-tertiary sm:text-[0.875rem] lg:mt-[1.5rem] lg:w-[53.1875rem] lg:space-y-[1rem] lg:text-[0.9375rem] lg:leading-[120%]">
              {description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Feature cards grid section */}
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
