import FooterGrid from "./footer-grid/FooterGrid";
import Social from "./social/Social";
import { FaRegCopyright, FaRegRegistered } from "react-icons/fa6";
import MotionDiv from "../general/framer-motion/MotionDiv";
import RideRentLogo from "./RideRentFooterLogo";

const Footer = () => {
  return (
    <footer className="bg-footer px-4 py-8 text-white md:px-8">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl">
        {/* Top Section with Logo and Language Selectors */}
        <div className="mb-14 flex items-center justify-between border-b border-[#303030]">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <RideRentLogo />
          </div>

          {/* Language/Country Selector - Right Side */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded border border-text-tertiary px-3 py-2">
              <span className="text-sm">🌐</span>
              <span className="text-sm">English</span>
            </div>
            <div className="flex items-center gap-2 rounded border border-text-tertiary px-3 py-2">
              <span className="text-sm">🇮🇳</span>
              <span className="text-sm">India</span>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <FooterGrid />

        {/* Find Us On Section */}
        <div className="py-8">
          <h3 className="mb-6 text-center text-lg font-medium text-yellow">
            Find Us On
          </h3>
          <Social />
        </div>

        {/* Bottom Description */}
        <MotionDiv className="notranslate border-t border-[#303030] pt-8 text-center font-light text-gray-400">
          <div className="text-sm leading-relaxed">
            {/* <p className="mb-6">
              Ride.Rent is an on-demand platform to rent cars, bikes, buses,
              yachts, and more at the most affordable prices, operating in
              selected cities worldwide.
            </p> */}

            <div className="text-xs text-gray-500">
              <p className="mb-4">
                All trademarks are property of their respective owners.
                Ride.Rent LD is licensed under Sharjah Media City, Sharjah, UAE,
                License Number: 2434340.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1 text-center">
                <span className="flex items-center gap-1 font-semibold">
                  <FaRegCopyright className="mt-[0.17rem]" />
                  <FaRegRegistered className="mt-[0.17rem]" />
                  FleetOrbita Internet Services/Ride Rent LLC
                </span>
                <span className="hidden sm:inline-block">|</span>
                <span>
                  ACJ-9769 | Ride Rent LLC (UAE) License Version: 2434340.01 |
                  All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </footer>
  );
};

export default Footer;