import FooterGrid from "./footer-grid/FooterGrid";
import Social from "./social/Social";
import { FaRegCopyright, FaRegRegistered } from "react-icons/fa6";
import MotionDiv from "../general/framer-motion/MotionDiv";
import RideRentLogo from "./RideRentLogo";

const Footer = () => {
  return (
    <footer className="wrapper bg-black p-8 text-white">
      {/* Footer Grid */}
      <FooterGrid />

      {/* Social Section */}
      <Social />

      {/* Logo Section */}
      <MotionDiv className="mx-auto mb-8 w-fit">
        <RideRentLogo />
      </MotionDiv>

      {/* Bottom Section */}
      <MotionDiv className="mx-auto w-full text-center font-light text-gray-400 md:w-[90%] lg:w-[80%]">
        <div>
          Get unbeatable deals on car rentals, chauffeur services, and car with
          driver, alongside bike, yacht, and private Charter/ helicopter
          rentals. Our offerings span a range of options, from budget-friendly
          to premium rentals, in cars, bicycles, motorbikes, speed boats,
          yachts, and charter planes. Operating from Dubai, our services extend
          to selected cities worldwide. Experience convenience and luxury with
          ride.rent.
          <br />
          <br />
          All trademarks utilized within this portal for representation are the
          property of their respective owners.
          <br />
          <br />
          <div>
            Ride.Rent is a brand owned and operated by{" "}
            <span className="font-semibold">FleetOrbita Group</span>
            <p className="mt-3">
              <span>
                Operating as Ride Rent LLC in the UAE, licensed under Sharjah
                Media City, Sharjah, UAE, License Number: 2434340.
              </span>
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-center sm:text-sm">
            <span className="flex items-start gap-1 font-semibold">
              <FaRegCopyright className="mt-[0.17rem]" />
              <FaRegRegistered className="mt-[0.17rem]" />
              FleetOrbita Internet Services/Ride Rent LLC
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span>
              ACJ-9769 | Ride Rent LLC (UAE) License Version: 2434340.01 | All
              Rights Reserved
            </span>
          </div>
        </div>
      </MotionDiv>
    </footer>
  );
};

export default Footer;
