import React from 'react';
import Image from 'next/image';

const CarSection: React.FC = () => {
  return (
    // Main section container with responsive positioning and gradient background
    <section className="relative top-[0.125rem] h-[7.5rem] w-full overflow-hidden bg-gradient-to-b from-gray-50/20 to-white p-2 md:h-[14.25rem] lg:top-[0.5rem] lg:m-6">
      {/* Container wrapper for centering content */}
      <div className="relative flex h-full w-full items-end justify-center px-[0.25rem]">
        {/* Cars container with responsive max-width constraints */}
        <div className="relative flex h-full w-full max-w-[20rem] items-end justify-center md:max-w-[42.5rem]">
          {/* Left car - BMW with negative margin for overlap */}
          <div className="relative mr-[-1.25rem] flex h-full flex-shrink-0 items-end md:mr-[-3.75rem]">
            <div className="relative mb-[0.125rem] h-[2.875rem] w-[5.875rem] md:mb-[0.1875rem] md:h-[8.8125rem] md:w-[16.5625rem]">
              <Image
                src="/assets/cars/bmw.png"
                alt="BMW"
                width={265}
                height={141}
                className="h-full w-full object-contain object-bottom"
                priority
              />
            </div>
          </div>

          {/* Center car - Range Rover with highest z-index */}
          <div className="relative z-10 flex h-full flex-shrink-0 items-end">
            <div className="relative h-[5rem] w-[5.875rem] md:h-[14.25rem] md:w-[16.75rem]">
              <Image
                src="/assets/cars/rangerover.png"
                alt="Range Rover"
                width={268}
                height={228}
                className="h-full w-full object-contain object-bottom"
                priority
              />
            </div>
          </div>

          {/* Right car - Mercedes with negative margin for overlap */}
          <div className="relative ml-[-1.4375rem] flex h-full flex-shrink-0 items-end md:ml-[-5.625rem]">
            <div className="relative mb-[0.0625rem] h-[2.875rem] w-[5.875rem] md:mb-[0.1875rem] md:h-[8.8125rem] md:w-[19.125rem]">
              <Image
                src="/assets/cars/mercedes.png"
                alt="Mercedes"
                width={306}
                height={141}
                className="h-full w-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay for seamless blending */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[4rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default CarSection;