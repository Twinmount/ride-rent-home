import "./VerticalCard.scss";
import { IoLocationOutline } from "react-icons/io5";
import { FC } from "react";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { VehicleCardType } from "@/types/vehicle-types";
import {
  convertToLabel,
  formatKeyForIcon,
  formatPhoneNumber,
  generateModelDetailsUrl,
  getRentalPeriodDetails,
} from "@/helpers";
import Link from "next/link";
import Image from "next/image";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import Specifications from "@/components/root/listing/specifications/Specifications";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";

type VerticalCardProps = {
  vehicle: VehicleCardType;
  isHourlyRental?: boolean;
};

const VerticalCard: FC<VerticalCardProps> = ({
  vehicle,
  isHourlyRental = false,
}) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null;

  // generating dynamic url for the vehicle details page
  const modelDetails = generateModelDetailsUrl(vehicle);

  // link for the vehicle details page
  const vehicleDetailsPageLink = `/${vehicle.state}/${vehicle.vehicleCategory}/${modelDetails}/${vehicle.vehicleId}`;

  // page link required for whatsapp share
  const whatsappPageLink = `https://ride.rent/${vehicleDetailsPageLink}`;

  // Compose the message with the page link included
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  // whatsapp url
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null; // Handle null WhatsApp details

  // Determine which rental period to display
  const rentalPeriod = getRentalPeriodDetails(
    vehicle.rentalDetails,
    isHourlyRental
  );

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <MotionDivElm
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="vertical-card-container slide-visible"
    >
      {/* card top */}
      <Link href={vehicleDetailsPageLink}>
        <div className="card-top">
          <div className="image-box">
            {/* Thumbnail Image */}
            {vehicle.thumbnail ? (
              <Image
                src={vehicle.thumbnail}
                alt={vehicle.model || "Vehicle Image"}
                width={400}
                height={400}
                className="vehicle-image"
              />
            ) : (
              <img
                src={vehicle.thumbnail} // Fallback or invalid URL handling
                alt="Vehicle Image"
                className="vehicle-image"
              />
            )}

            {/* Company Logo */}
            {vehicle.companyLogo ? (
              <Image
                width={40}
                height={40}
                src={vehicle.companyLogo}
                alt="Company Logo"
                className="profile-icon"
              />
            ) : (
              <img
                src={"/assets/img/blur-profile.webp"} // Fallback for logo
                alt="Company Logo"
                width={40}
                height={40}
                className="profile-icon"
              />
            )}
            <span className="brand">{vehicle.brandName}</span>

            {/* zero deposit */}
            {!vehicle?.securityDeposit?.enabled && (
              <div className="absolute left-2 bottom-2 inline-flex py-[0.3rem] animate-shimmer border border-slate-500 items-center justify-center rounded-[0.5rem] shadow bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] px-2 font-medium text-yellow-300 transition-colors focus:outline-none text-xs">
                Zero Deposit
              </div>
            )}

            {/* Hourly Rental */}
            {vehicle?.rentalDetails.hour?.enabled && (
              <div className="absolute right-2 top-2 inline-flex py-[0.3rem] border border-slate-700 items-center justify-center rounded-[0.5rem] shadow bg-slate-900 bg-[length:200%_100%] px-2 font-medium text-yellow-300 transition-colors focus:outline-none text-xs text-yellow">
                Hourly Rental
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsPageLink}>
          <div className="model-name">{vehicle.model}</div>
        </Link>

        {/* vehicle specs grid */}
        <Link href={vehicleDetailsPageLink}>
          <div className="specs-grid">
            {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => (
              <TooltipProvider delayDuration={200} key={key}>
                <Tooltip>
                  <TooltipTrigger className="spec">
                    <img
                      src={`${baseAssetsUrl}/icons/vehicle-specifications/${
                        vehicle.vehicleCategory
                      }/${formatKeyForIcon(key)}.svg`}
                      alt={`${spec.name} icon`}
                      className="spec-icon"
                    />
                    <div className="each-spec-value">
                      {/* Conditional display for Mileage */}
                      {key === "Mileage" && spec.value
                        ? `${spec.value} mileage range`
                        : spec.name || "N/A"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
                    <p>
                      {/* Conditional display for Mileage in TooltipContent */}
                      {key === "Mileage" && spec.value
                        ? `${spec.value} mileage range`
                        : spec.name || "N/A"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </Link>
        <Link href={vehicleDetailsPageLink}>
          <Specifications
            isCryptoAccepted={vehicle.isCryptoAccepted}
            isSpotDeliverySupported={vehicle.isSpotDeliverySupported}
            rentalDetails={vehicle.rentalDetails}
          />
        </Link>
        {/* location and price */}
        <Link href={vehicleDetailsPageLink}>
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={17} />{" "}
              <span className="state">
                {convertToLabel(vehicle.state) || "N/A"}
              </span>
            </div>
            {rentalPeriod ? (
              <div className="price">
                <span className="rental-amount">
                  {rentalPeriod.rentInAED || "N/A"} AED
                </span>
                <span className="rental-period">
                  &nbsp;{rentalPeriod.label}
                </span>
              </div>
            ) : (
              <div className="price">Rental Details N/A</div>
            )}
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
