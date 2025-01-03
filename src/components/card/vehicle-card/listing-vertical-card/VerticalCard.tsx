import "./VerticalCard.scss";
import { IoLocationOutline } from "react-icons/io5";
import { FC } from "react";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { VehicleCardType } from "@/types/vehicle-types";
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import Link from "next/link";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import Specifications from "@/components/root/listing/specifications/Specifications";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";
import ZeroDeposit from "../ZeroDeposit";
import HourlyRental from "../HourlyRental";
import VehicleThumbnail from "../VehicleThumbnail";
import CompanyLogo from "../CompanyLogo";
import VehicleSpecsGrid from "./VehicleSpecsGrid";
import RentalDetails from "../RentalDetails";

type VerticalCardProps = {
  vehicle: VehicleCardType;
};

const VerticalCard: FC<VerticalCardProps> = ({ vehicle }) => {
  // Helper function calls
  const formattedPhoneNumber = getFormattedPhoneNumber(
    vehicle.countryCode,
    vehicle.phoneNumber
  );

  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleId: vehicle.vehicleId,
  });

  // whatsapp url
  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: vehicle.whatsappPhone,
    whatsappCountryCode: vehicle.whatsappCountryCode,
    model: vehicle.model,
    vehicleDetailsPageLink,
  });
  return (
    <MotionDivElm
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="vertical-card-container slide-visible"
    >
      {/* card top */}
      <Link href={vehicleDetailsPageLink} target="_blank">
        <div className="card-top">
          <div className="image-box">
            {/* Thumbnail Image */}
            <VehicleThumbnail
              src={vehicle.thumbnail}
              alt={vehicle.model || "Vehicle Image"}
              width={400}
              height={400}
              className="vehicle-image"
            />

            {/* Company Logo */}
            <CompanyLogo
              src={vehicle.companyLogo}
              width={40}
              height={40}
              className="profile-icon"
            />

            <span className="brand">{vehicle.brandName}</span>

            {/* zero deposit */}
            <ZeroDeposit enabled={vehicle?.securityDeposit.enabled} />

            {/* Hourly Rental */}
            <HourlyRental enabled={vehicle?.rentalDetails.hour?.enabled} />
          </div>
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsPageLink} target="_blank">
          <div className="model-name">{vehicle.model}</div>
        </Link>

        {/* vehicle specs grid */}
        <Link href={vehicleDetailsPageLink} target="_blank">
          <VehicleSpecsGrid
            vehicleSpecs={vehicle.vehicleSpecs}
            vehicleCategory={vehicle.vehicleCategory}
          />
        </Link>

        {/* specifications */}
        <Link href={vehicleDetailsPageLink} target="_blank">
          <Specifications
            isCryptoAccepted={vehicle.isCryptoAccepted}
            isSpotDeliverySupported={vehicle.isSpotDeliverySupported}
            rentalDetails={vehicle.rentalDetails}
          />
        </Link>

        {/* location and price */}
        <Link href={vehicleDetailsPageLink} target="_blank">
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={17} />{" "}
              <span className="state">
                {convertToLabel(vehicle.state) || "N/A"}
              </span>
            </div>

            {/* rental details */}
            <RentalDetails rentalDetails={vehicle.rentalDetails} />
          </div>
        </Link>
        <div className="bottom-rent-box">
          <RentNowButton
            vehicleDetailsPageLink={vehicleDetailsPageLink}
            companyLogo={vehicle.companyLogo}
          />
          <ContactIcons
            vehicleId={vehicle.vehicleId}
            whatsappUrl={whatsappUrl}
            email={vehicle.email}
            phoneNumber={formattedPhoneNumber}
          />
        </div>
      </div>
    </MotionDivElm>
  );
};

export default VerticalCard;
