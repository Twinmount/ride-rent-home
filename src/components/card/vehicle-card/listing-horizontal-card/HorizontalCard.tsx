import "./HorizontalCard.scss";
import Specifications from "../../../root/listing/specifications/Specifications";
import { FC } from "react";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { VehicleCardType } from "@/types/vehicle-types";
import {
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import Link from "next/link";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import ZeroDeposit from "../ZeroDeposit";
import HourlyRental from "../HourlyRental";
import VehicleThumbnail from "../VehicleThumbnail";
import CompanyLogo from "../CompanyLogo";
import RentalDetails from "../RentalDetails";
import VehicleSpecs from "./VehicleSpecs";
import VehicleLocation from "./VehicleLocation";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";

type HorizontalCardProps = {
  vehicle: VehicleCardType;
};

const HorizontalCard: FC<HorizontalCardProps> = ({ vehicle }) => {
  // Inside HorizontalCard
  const formattedPhoneNumber = getFormattedPhoneNumber(
    vehicle.countryCode,
    vehicle.phoneNumber
  );

  // dynamic link to navigate to vehicle details page
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
      initial={{ scale: 0.95, opacity: 0, y: 15 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="horizontal-card-container slide-visible"
    >
      {/* card left */}
      <div className="card-left">
        <Link
          href={vehicleDetailsPageLink}
          target="_blank"
          className="image-box"
        >
          {/* Thumbnail Image */}
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={vehicle.model || "Vehicle Image"}
            width={400}
            height={400}
            className="vehicle-image"
          />

          <span className="brand">{vehicle.brandName}</span>

          {/* zero deposit */}
          <ZeroDeposit enabled={vehicle?.securityDeposit.enabled} />

          {/* Hourly Rental */}
          <HourlyRental enabled={vehicle?.rentalDetails?.hour?.enabled} />
        </Link>
      </div>

      {/* card right */}
      <div className="card-right">
        {/* title and features */}
        <Link
          href={vehicleDetailsPageLink}
          target="_blank"
          className="right-top-container "
        >
          <div className="truncate">{vehicle.model}</div>
        </Link>

        {/* Dynamic Vehicle specs */}
        <Link href={vehicleDetailsPageLink} target="_blank">
          <VehicleSpecs
            vehicleSpecs={vehicle.vehicleSpecs}
            vehicleCategory={vehicle.vehicleCategory}
          />
        </Link>

        {/* Specifications */}
        <Link href={vehicleDetailsPageLink} target="_blank">
          <Specifications
            isCryptoAccepted={vehicle.isCryptoAccepted}
            isSpotDeliverySupported={vehicle.isSpotDeliverySupported}
            rentalDetails={vehicle.rentalDetails}
          />
        </Link>

        <div className="bottom-box">
          <div className="bottom-left">
            <Link
              href={vehicleDetailsPageLink}
              target="_blank"
              className="profile"
            >
              {/* Company Logo */}
              <CompanyLogo
                src={vehicle.companyLogo}
                width={40}
                height={40}
                className="profile-icon"
              />
            </Link>

            <VehicleLocation
              state={vehicle.state}
              vehicleDetailsPageLink={vehicleDetailsPageLink}
            />
          </div>

          {/* rental details */}
          <RentalDetails rentalDetails={vehicle.rentalDetails} />
          <div className="bottom-right">
            {/* Rent Now button */}
            <RentNowButton
              vehicleDetailsPageLink={vehicleDetailsPageLink}
              companyLogo={vehicle.companyLogo}
            />

            {/* Icons for WhatsApp and email */}
            <ContactIcons
              vehicleId={vehicle.vehicleId}
              whatsappUrl={whatsappUrl}
              email={vehicle.email}
              phoneNumber={formattedPhoneNumber}
            />
          </div>
        </div>
      </div>
    </MotionDivElm>
  );
};

export default HorizontalCard;
