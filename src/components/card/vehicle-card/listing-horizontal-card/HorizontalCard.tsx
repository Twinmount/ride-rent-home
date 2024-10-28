import "./HorizontalCard.scss";
import { IoLocationOutline } from "react-icons/io5";
import Specifications from "../../../root/listing/specifications/Specifications";
import { FC } from "react";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";
import { VehicleCardType } from "@/types/vehicle-types";
import {
  convertToLabel,
  formatKeyForIcon,
  formatPhoneNumber,
  generateModelDetailsUrl,
  getRentalPeriodDetails,
} from "@/helpers";
import Link from "next/link";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";

type HorizontalCardProps = {
  vehicle: VehicleCardType;
  category: string;
  state: string;
};

const HorizontalCard: FC<HorizontalCardProps> = ({
  vehicle,
  category,
  state,
}) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null;

  // generating dynamic url for the vehicle details page
  const modelDetails = generateModelDetailsUrl(vehicle);

  // link for the vehicle details page
  const vehicleDetailsPageLink = `/${state}/${category}/${modelDetails}/${vehicle.vehicleId}`;

  // page link required for whatsapp share
  const whatsappPageLink = `https://ride.rent/${vehicleDetailsPageLink}`;

  // Compose the message with the page link included
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  // whatsapp url
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null;

  // Determine which rental period to display
  const rentalPeriod = getRentalPeriodDetails(vehicle.rentalDetails);

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

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
        <Link href={vehicleDetailsPageLink} className="image-box">
          {/* Thumbnail Image */}
          {vehicle.thumbnail ? (
            <Image
              src={vehicle.thumbnail}
              alt={vehicle.model || "Vehicle Image"}
              width={350}
              height={350}
              className="vehicle-image"
            />
          ) : (
            <img
              src={vehicle.thumbnail} // Fallback or invalid URL handling
              alt="Vehicle Image"
              className="vehicle-image"
            />
          )}
          <span className="brand">{vehicle.brandName}</span>
        </Link>
      </div>

      {/* card right */}
      <div className="card-right">
        {/* title and features */}
        <Link href={vehicleDetailsPageLink} className="right-top-container ">
          {vehicle.model}
        </Link>

        {/* Dynamic Vehicle specs */}
        <Link href={vehicleDetailsPageLink} className="vehicle-specs">
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
                    {" "}
                    {/* Check if the key is "Mileage" and format accordingly */}
                    {key === "Mileage" && spec.value
                      ? `${spec.value} mileage range`
                      : spec.name || "N/A"}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
                  <p>
                    {" "}
                    {key === "Mileage" && spec.value
                      ? `${spec.value} mileage range`
                      : spec.name || "N/A"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </Link>

        {/* Specifications */}
        <Link href={vehicleDetailsPageLink}>
          <Specifications
            isCryptoAccepted={vehicle.isCryptoAccepted}
            isSpotDeliverySupported={vehicle.isSpotDeliverySupported}
            rentalDetails={vehicle.rentalDetails}
          />
        </Link>

        <div className="bottom-box">
          <div className="bottom-left">
            <Link href={vehicleDetailsPageLink} className="profile">
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
                  src={"/assets/img/blur-profile.webp"} //
                  alt="Company Logo"
                  className="profile-icon"
                />
              )}
            </Link>

            <Link href={vehicleDetailsPageLink} className="location">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="each-location">
                    <IoLocationOutline size={17} />{" "}
                    <span className="state">
                      {convertToLabel(vehicle.state) || "N/A"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
                    <p>{convertToLabel(vehicle.state) || "Not Available"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </div>

          {/* price */}
          {rentalPeriod ? (
            <div className="price">
              <span className="rental-price">
                {rentalPeriod.rentInAED || "N/A"} AED
              </span>
              <span className="rental-period">&nbsp;{rentalPeriod.label}</span>
            </div>
          ) : (
            <div className="price">Rental Details N/A</div>
          )}
          <div className="bottom-right">
            {/* Rent Now button */}
            <Link href={vehicleDetailsPageLink} className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </Link>

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
