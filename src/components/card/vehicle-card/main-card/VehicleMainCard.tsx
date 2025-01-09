import "./MainCard.scss";
import Link from "next/link";
import { VehicleCardType } from "@/types/vehicle-types";
import { IoLocationOutline } from "react-icons/io5";
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";
import SpecsGrid from "./specs-grid/SpecsGrid";
import ZeroDeposit from "../ZeroDeposit";

import CompanyLogo from "../CompanyLogo";
import VehicleThumbnail from "../VehicleThumbnail";
import HourlyRentalBadge from "./hourly-rental-badge/HourlyRentalBadge";
import RentalDetails from "../RentalDetails";

import MotionMainCardDiv from "@/components/general/framer-motion/MotionMainCardDiv";

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

  // whatsapp url
  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: vehicle.whatsappPhone,
    whatsappCountryCode: vehicle.whatsappCountryCode,
    model: vehicle.model,
    vehicleDetailsPageLink,
  });

  return (
    <MotionMainCardDiv
      index={index}
      className="main-card-container slide-visible"
    >
      {/* card top */}
      <Link href={vehicleDetailsPageLink} target="_blank" className="card-top">
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

          {/* Hourly Rentals Slanted Badge */}
          <HourlyRentalBadge
            isHourlyRental={vehicle?.rentalDetails?.hour?.enabled}
          />
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsPageLink} target="_blank">
          {/* title */}
          <div className="model-name">{vehicle.model}</div>

          {/* vehicle specs grid */}
          <SpecsGrid vehicle={vehicle} />

          {/* location and rental details */}
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={18} />{" "}
              <span className="state">
                {convertToLabel(vehicle.state) || "N/A"}
              </span>
            </div>

            {/* rental details */}
            <RentalDetails rentalDetails={vehicle.rentalDetails} />
          </div>
        </Link>
        <div className="bottom-box">
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
    </MotionMainCardDiv>
  );
};

export default VehicleMainCard;
