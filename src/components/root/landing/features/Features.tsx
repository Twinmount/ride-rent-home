import FeaturesCard from "@/components/card/features-card/FeaturesCard";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps } from "@/types";
import {
  convertToLabel,
  createFeatureCards,
  singularizeValue,
} from "@/helpers";

const Features = ({ state, category }: StateCategoryProps) => {
  const dynamicFeatureCards = createFeatureCards(convertToLabel(state));
  const formattedCategory = convertToLabel(singularizeValue(category));

  return (
    <MotionSection className="relative overflow-hidden py-11 lg:py-28  pb-[130px] lg:pb-[95px]">
      {/* Main background - darker white/gray gradient covering only top half */}
      <div 
        className="absolute top-0 left-0 right-0 h-full z-0"

      ></div>

      {/* Orange/Yellow Gradient Overlay - Responsive */}
      <div 
        className="absolute top-0 bottom-0 hidden lg:block"
        style={{
          right: '0%',
          width: '60%',
          background: 'linear-gradient(139.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)'
        }}
      ></div>

      {/* Mobile Yellow Gradient - Smaller and positioned differently */}
      <div 
        className="absolute bottom-0 left-0 right-0 lg:hidden"
        style={{
          height: '80%',
          background: 'linear-gradient(139.28deg, rgba(255, 255, 255, 0) 55%, rgba(249, 168, 37, 0.7) 100%)'
        }}
      ></div>
      
      {/* Background Images - Desktop Only */}
      <div className="absolute inset-0 hidden lg:block z-1">
        {/* Left Background Building - Wide image (1257x535) */}
        <div className="absolute left-0 bottom-0" style={{ width: '1257px', height: '535px' }}>
          <img
            src="/assets/img/bg/featuresWideBG.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Right Background Building - Tall image (426x632) */}
        <div className="absolute right-0 bottom-14" style={{ width: '426px', height: '632px' }}>
          <img
            src="/assets/img/bg/featuresBG.png"
            alt=""
            className="w-full h-full object-cover opacity-30 pb-14"
          />
        </div>
      </div>

      {/* Car Image - Responsive, positioned absolutely for all screen sizes */}
      <div className="absolute right-0 bottom-0 z-10 ">
        <div className="relative flex items-end justify-end">
          <img
            src="/assets/cars/mustang.png"
            alt="Red Mustang Car"
            className="drop-shadow-2xl w-[224px] h-[141px] lg:w-auto lg:h-[350px] sm:lg:max-h-[250px] lg:max-h-[325px] object-contain"
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto">
        
        {/* Text Content Section - Takes 3/4 of width on desktop, full width on mobile */}
        <div className="w-full lg:w-3/4 xl:w-2/3 px-[2rem] sm:px-6 lg:px-8 lg:ml-11">
          
          {/* Header Section */}
          <div className="w-full lg:max-w-[934px] mb-6 lg:mb-12 lg:w-[934px]">
            {/* Custom Title with responsive text sizes */}
            <h2 className="text-[#2E3A44] font-medium text-[16px] sm:text-[28px] lg:text-[40px] leading-[110%]  mb-4 lg:mb-6 text-center sm:text-left">
              Enjoy ease and peace of mind
              <br />
              when renting a {formattedCategory.toLowerCase()} in {convertToLabel(state)}
            </h2>

            
            {/* Description Text with responsive typography */}
            <div className="mt-4 lg:mt-6 font-poppins space-y-3 lg:space-y-4 lg:w-[851px] text-[#7D8487] font-normal text-[10px] sm:text-[16px] lg:text-[15px] leading-[130%] lg:leading-[120%] tracking-[0%] ">
              <p className=" lg:w-[855px]">
                Discover the best of {convertToLabel(state)} with our affordable and reliable car rental service. Whether you're visiting the main locations or exploring hidden gems, our diverse fleet offers the perfect match for your travel needs. Experience hassle-free car rental with transparent pricing and no hidden fees.
              </p>
              
              <p className=" lg:w-[851px]">
                Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. Choose us for a stress-free car rental experience in {convertToLabel(state)}, and drive away with confidence and comfort.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="w-full lg:max-w-[1112px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              {dynamicFeatureCards.map((feature: any) => (
                <div key={feature.key} className="w-full">
                  <FeaturesCard data={feature} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MotionSection>
  );
};

export default Features;