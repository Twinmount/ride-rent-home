import FooterGrid from "./footer-grid/FooterGrid";
import "./Footer.scss";
import Social from "./social/Social";
import { FaRegCopyright } from "react-icons/fa6";
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
          ride.rent
          <br />
          <br />
          All trademarks utilized within this portal for representation are the
          property fo their respective owners
          <br />
          <br />
          Ride.Rent is a brand owned and operated by{" "}
          <span className="bold">FleetOrbita Group</span>
          <br />
          <br />
          <span className="copyright">
            <FaRegCopyright />

            <span>
              2024 FleetOrbita Internet Services LLP | ACJ-9769. All Rights
              Reserved.
            </span>
          </span>
        </p>
      </MotionDiv>
    </footer>
  );
};
export default Footer;
