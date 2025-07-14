import React from 'react';
import Image from 'next/image';

const CarSection: React.FC = () => {
  return (
    <section className="relative w-full top-2 lg:top-8 h-[120px] md:h-[228px] bg-gradient-to-b from-gray-50/20 to-white overflow-hidden">
      {/* Container */}
      <div className="relative w-full h-full flex items-end justify-center px-4">
        
        {/* Cars Container - Responsive for both desktop and mobile */}
        <div className="relative flex items-end justify-center w-full max-w-[320px] md:max-w-[680px] h-full">
          
          {/* Left Car - BMW */}
          <div className="relative flex-shrink-0 mr-[-20px] md:mr-[-60px] flex items-end h-full">
            <div className="relative w-[94px] h-[46px] md:w-[265px] md:h-[141px] md:mb-3 mb-1">
              <Image
                src="/assets/cars/bmw.png"
                alt="BMW"
                width={265}
                height={141}
                className="w-full h-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
          
          {/* Center Car - Range Rover */}
          <div className="relative z-10 flex-shrink-0 flex items-end h-full">
            <div className="relative w-[94px] h-[80px] md:w-[268px] md:h-[228px]">
              <Image
                src="/assets/cars/rangerover.png"
                alt="Range Rover"
                width={268}
                height={228}
                className="w-full h-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
          
          {/* Right Car - Mercedes */}
          <div className="relative  flex-shrink-0 ml-[-23px] md:ml-[-90px] flex items-end h-full">
            <div className="relative w-[94px] h-[46px] md:w-[306px] md:h-[141px] md:mb-3 mb-1">
              <Image
                src="/assets/cars/mercedes.png"
                alt="Mercedes"
                width={306}
                height={141}
                className="w-full h-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>

        {/* Enhanced Gradient Overlay - Mobile Friendly */}
         <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default CarSection;