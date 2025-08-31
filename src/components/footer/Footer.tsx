import FooterGrid from './footer-grid/FooterGrid';
import Social from './social/Social';
import { FaRegCopyright, FaRegRegistered } from 'react-icons/fa6';
import MotionDiv from '../general/framer-motion/MotionDiv';
import RideRentFooterLogo from './RideRentFooterLogo';
import FooterSelectors from './FooterSelectors'; // Import the client component
import MadeWith from './MadeWith';

const Footer = () => {
  return (
    <div className="w-full bg-footer">
      <footer className="mx-auto max-w-7xl px-4 py-8 text-white md:px-8">
        <div>
          {/* Top Section with Logo and Selectors */}
          <div className="mb-6 flex w-full max-w-full flex-col items-center border-b border-[#303030] pb-2 md:flex-row md:justify-between lg:pb-5">
            {/* Logo - Left Side */}
            <div className="mb-3 sm:mb-0">
              <RideRentFooterLogo />
            </div>

            {/* Language and Country Selectors - Right Side */}
            <FooterSelectors />
          </div>

          {/* Footer Grid - Hidden on mobile */}
          <div className="hidden md:block">
            <FooterGrid />
          </div>

          {/* Find Us On Section */}
          <div className="py-6 md:py-8">
            <h3 className="mb-3 text-center text-lg font-medium text-yellow">
              Find Us On
            </h3>
            <Social />
          </div>

          {/* Bottom Description */}
          <MotionDiv className="notranslate border-t border-[#303030] pt-6 text-center font-light text-gray-400 md:pt-8">
            <div className="text-sm leading-relaxed">
              <div className="text-xs text-gray-500">
                <p className="mb-4 px-2">
                  All trademarks are property of their respective owners.
                  Ride.Rent LD is licensed under Sharjah Media City, Sharjah,
                  UAE, License Number: 2434340.
                </p>

                <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <FaRegCopyright className="mt-[0.17rem]" />
                    <FaRegRegistered className="mt-[0.17rem]" />
                    FleetOrbita Internet Services/Ride Rent LLC
                  </span>
                  <span className="hidden sm:inline-block">|</span>
                  <span className="text-center">
                    ACJ-9769 | Ride Rent LLC (UAE) License Version: 2434340.01 |
                    All Rights Reserved
                  </span>
                  <MadeWith />
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </footer>
    </div>
  );
};

export default Footer;