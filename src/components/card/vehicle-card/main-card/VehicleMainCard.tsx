import "./VehicleMainCard.scss";
import { VehicleCardType } from "@/types/vehicle-types";
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import SpecsGrid from "../SpecsGrid";
import ZeroDeposit from "../ZeroDeposit";

import CompanyLogo from "../CompanyLogo";
import VehicleThumbnail from "../VehicleThumbnail";
import HourlyRentalBadge from "./hourly-rental-badge/HourlyRentalBadge";
import RentalDetails from "../RentalDetails";

import MotionStaggeredDiv from "@/components/general/framer-motion/MotionStaggeredDiv";
// import EnquireBestPrice from "../EnquireBestPrice";
import { MapPin } from "lucide-react";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";
import LinkWrapper from "../LinkWrapper";

type VehicleMainCardProps = {
  vehicle: VehicleCardType;
  index: number;
};

const VehicleMainCard = ({ vehicle, index }: VehicleMainCardProps) => {
  const formattedPhoneNumber = getFormattedPhoneNumber(
    vehicle.countryCode,
    vehicle.phoneNumber,
  );

  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleCode: vehicle.vehicleCode,
  });

  // whatsapp url with dynamic message attached
  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: vehicle.whatsappPhone,
    whatsappCountryCode: vehicle.whatsappCountryCode,
    model: vehicle.model,
    vehicleDetailsPageLink,
  });

  return (
    <MotionStaggeredDiv index={index} className="main-card-container">
      {/* card top */}
      <LinkWrapper href={vehicleDetailsPageLink} className="card-top">
        <div className="image-container">
          {/* Thumbnail Image */}
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={vehicle.vehicleTitle || "Vehicle Image"}
            width={350}
            height={250}
            className="vehicle-image"
          />

          {/* Company Logo */}
          <CompanyLogo
            src={vehicle.companyLogo}
            width={40}
            height={40}
            className="profile-icon"
          />

          <span className="brand notranslate">{vehicle.brandName}</span>

          {/* zero deposit */}
          <ZeroDeposit enabled={vehicle?.securityDeposit.enabled} />

          {/* Hourly Rentals Slanted Badge */}
          <HourlyRentalBadge
            isHourlyRental={vehicle?.rentalDetails?.hour?.enabled}
          />
        </div>
      </LinkWrapper>

      {/* card bottom */}
      <div className="card-bottom">
        <LinkWrapper href={vehicleDetailsPageLink}>
          {/* title */}
          <div className="model-name">{vehicle.model}</div>

          {/* vehicle specs grid */}
          <SpecsGrid vehicle={vehicle} />

          {/* location and rental details */}
          <div className="location-box">
            <div className="location">
              <MapPin strokeWidth={1.5} size={18} />{" "}
              <span className="state">
                {convertToLabel(vehicle.state) || "N/A"}
              </span>
            </div>

            {/* rental details */}
            <RentalDetails rentalDetails={vehicle.rentalDetails} />
          </div>
        </LinkWrapper>
        <div className="bottom-box">
          {/* client component which handles the dialog logic via context */}
          {/* <EnquireBestPrice vehicle={vehicle} /> */}
          <LinkWrapper href={vehicleDetailsPageLink}>
            <RentNowButton
              vehicleDetailsPageLink={vehicleDetailsPageLink}
              companyLogo={vehicle.companyLogo}
            />
          </LinkWrapper>

          <ContactIcons
            vehicleId={vehicle.vehicleId}
            whatsappUrl={whatsappUrl}
            email={vehicle.email}
            phoneNumber={formattedPhoneNumber}
          />
        </div>
      </div>
    </MotionStaggeredDiv>
  );
};

export default VehicleMainCard;
