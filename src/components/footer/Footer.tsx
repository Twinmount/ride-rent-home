import FooterGrid from "./footer-grid/FooterGrid";
import "./Footer.scss";
import Social from "./social/Social";
import { FaRegCopyright, FaRegRegistered } from "react-icons/fa6";
import MotionDiv from "../general/framer-motion/MotionDiv";
import RideRentLogo from "./RideRentLogo";

const Footer = () => {
  return (
    <footer>
      <FooterGrid />
      <Social />

      {/* logo */}
      <MotionDiv className="footer-logo-container">
        <RideRentLogo />
      </MotionDiv>
      <MotionDiv className="bottom-container">
        <p>
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
          property fo their respective owners.
          <br />
          <br />
          <div className="bottom-container">
          Ride.Rent is a brand owned and operated by {" "}
        <span className="bold ">FleetOrbita Group</span>       
          <p className="mt-3">
            <span>Operating as Ride Rent LLC in the UAE, licensed under Sharjah Media City,     Sharjah, UAE, License Number:
            2434340.
            </span>
          </p>
      </div>
      <div className="flex-center gap-x-1 sm:text-sm flex-wrap text-center mt-3">
      <span className="bold flex justify-center items-start gap-x-1">
          <FaRegCopyright className="mt-[.17rem]"/>
          <FaRegRegistered className="mt-[.17rem]"/>
          FleetOrbita Internet Services/Ride Rent LLC</span>
          <span className="max-sm:hidden">|</span> ACJ-9769 | Ride Rent LLC (UAE) License Version: 2434340.01 | All Rights
          Reserved    
      </div>
        </p>
      </MotionDiv>
    </footer>
  );
};
export default Footer;