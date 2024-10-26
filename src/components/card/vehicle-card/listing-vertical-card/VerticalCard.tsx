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

type VerticalCardProps = {
  vehicle: VehicleCardType;
  category: string;
  state: string;
};

const VerticalCard: FC<VerticalCardProps> = ({ vehicle, category, state }) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null;

  const message = `Hello, I am interested in the ${vehicle.model}. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null; // Handle null WhatsApp details

  // Determine which rental period to display
  const rentalPeriod = getRentalPeriodDetails(vehicle.rentalDetails);

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  // generating dynamic url for the vehicle details page
  const modelDetails = generateModelDetailsUrl(vehicle);

  // link for the vehicle details page
  const vehicleDetailsLink = `/${state}/${category}/${modelDetails}/${vehicle.vehicleId}`;

  return (
    <MotionDivElm
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="vertical-card-container slide-visible"
    >
      {/* card top */}
      <Link href={vehicleDetailsLink}>
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
          </div>
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsLink}>
          <div className="model-name">{vehicle.model}</div>
        </Link>

        {/* vehicle specs grid */}
        <Link href={vehicleDetailsLink}>
          <div className="specs-grid">
            {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => (
              <TooltipProvider delayDuration={200} key={key}>
                <Tooltip>
                  <TooltipTrigger className="spec">
                    <img
                      src={`${baseAssetsUrl}/icons/vehicle-specifications/${category}/${formatKeyForIcon(
                        key
                      )}.svg`}
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
        <Link href={vehicleDetailsLink}>
          <Specifications
            isCryptoAccepted={vehicle.isCryptoAccepted}
            isSpotDeliverySupported={vehicle.isSpotDeliverySupported}
            rentalDetails={vehicle.rentalDetails}
          />
        </Link>
        {/* location and price */}
        <Link href={vehicleDetailsLink}>
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

        <div className="bottom-box">
          <Link href={vehicleDetailsLink}>
            <div className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </div>
          </Link>

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
