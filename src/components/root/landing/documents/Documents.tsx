import MotionSection from '@/components/general/framer-motion/MotionSection';
import DocumentsRequired from './DocumentsRequired';
import { convertToLabel, singularizeValue } from '@/helpers';
import { StateCategoryProps } from '@/types';
import Image from 'next/image';
import { SectionHeading } from '@/components/common/SectionHeading';

const Documents = ({ state, category }: StateCategoryProps) => {
  // Format category for display
  const formattedCategory = singularizeValue(convertToLabel(category));

  return (
    // Main section with gradient background and responsive margins - removed default padding
    <MotionSection className="no-global-padding relative overflow-hidden bg-gradient-to-b from-[#f8f6f6] to-white pt-1">
      {/* Container with proper max-width constraints - removed min-height */}
      <div className="global-padding mx-auto w-full pb-4 lg:flex">
        {/* Yellow gradient overlay for desktop */}
        <div
          className="absolute bottom-0 left-0 right-0 top-0 z-0"
          style={{
            background:
              'linear-gradient(220.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)',
          }}
        ></div>

        {/* Background building image for desktop only */}
        <div className="absolute inset-0 z-0 hidden lg:block">
          <div
            className="absolute bottom-0 right-0"
            style={{ width: '78.5625rem', height: '33.4375rem' }}
          >
            <img
              src="/assets/img/bg/featuresWideBG.png"
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
          </div>
        </div>

        {/* Left image section - hidden on mobile, fixed width on desktop */}
        <div className="z-1 relative hidden pt-[8rem] lg:block lg:h-full lg:w-[45%] lg:overflow-hidden lg:pl-[1.5rem]">
          <div className="relative flex h-full items-center justify-center lg:justify-between">
            <div className="relative">
              <Image
                src="/assets/img/home-images/document-section-img.png"
                alt="Toyota Fortuner"
                width={600}
                height={500}
                className="relative max-w-none object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right content section with responsive width - added pb-0 to eliminate bottom padding */}
        <div className="z-1 relative right-0 space-y-[1rem] pb-0 sm:space-y-[1.5rem] sm:text-[0.17rem] lg:w-[55%] lg:space-y-[2rem] lg:py-[2rem] lg:pb-0 lg:text-[2.2rem]">
          {/* Main content area with heading and description */}
          <div className="space-y-[1rem] sm:space-y-[1.5rem]">
            <SectionHeading
              title={`Ride.Rent is getting you the best ${formattedCategory} for rental in ${convertToLabel(state)}`}
              align="left"
            />

            <div className="space-y-[0.75rem] pr-1 text-justify font-poppins text-[0.75rem] font-normal leading-[130%] tracking-[0%] text-text-tertiary sm:text-[0.875rem] sm:leading-[125%] lg:space-y-[1rem] lg:text-[0.9375rem] lg:leading-[120%]">
              <p>
                As the fastest-growing vehicle rental portal, we pride ourselves
                on offering an extensive range of vehicles available for rent in
                the UAE, from luxurious cars and sports cars to thrilling
                motorbikes and sport bikes. But that&apos;s not all - we also
                cater to those seeking adventure on the water with our selection
                of speed boats and yachts for rent. For those looking to soar
                high, we provide charter planes for rent at affordable rates for
                your convenience.
              </p>

              <p>
                At Ride.Rent, we understand the importance of convenience and
                choice, which is why our services span across prominent areas in
                the UAE, including Abu Dhabi, Dubai, Sharjah, Ajman, Umm Quwain,
                Ras AL Khaimah, and Fujairah. Whether you&apos;re cruising along
                the stunning coastline or exploring the vibrant cityscape,
                we&apos;ve got the perfect ride for every occasion.
              </p>

              <p>
                With a commitment to providing exceptional service and an
                unbeatable selection, Ride.Rent is your go-to destination for
                all your vehicle rental needs in the UAE.
              </p>

              <p>
                Book your dream ride today and elevate your journey with
                Ride.Rent!
              </p>
            </div>
          </div>

          {/* Documents required section */}
          <DocumentsRequired category={formattedCategory} />
        </div>
      </div>
    </MotionSection>
  );
};

export default Documents;