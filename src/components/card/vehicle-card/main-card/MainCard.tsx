import "./MainCard.scss";
import Link from "next/link";
import Image from "next/image";
import { VehicleCardType } from "@/types/vehicle-types";
import { StateCategoryProps } from "@/types";
import { IoLocationOutline } from "react-icons/io5";
import {
  convertToLabel,
  formatKeyForIcon,
  formatPhoneNumber,
  generateModelDetailsUrl,
  getRentalPeriodDetails,
} from "@/helpers";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import RentNowButton from "@/components/common/RentNowButton/RentNowButton";

type MainCardProps = {
  vehicle: VehicleCardType;
  isHourlyRental?: boolean;
} & StateCategoryProps;

const MainCard = ({
  vehicle,
  state,
  category,
  isHourlyRental = false,
}: MainCardProps) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null; // if null phone number

  // generating dynamic url for the vehicle details page
  const modelDetails = generateModelDetailsUrl(vehicle);

  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = `/${state}/${category}/${modelDetails}/${vehicle.vehicleId}`;

  // page link required for whatsapp share
  const whatsappPageLink = `https://ride.rent/${vehicleDetailsPageLink}`;

  // Compose the message with the page link included
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  // whatsapp url
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null; //if null WhatsApp details

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.ASSETS_URL;

  // Use the helper function to get rental period details
  const rentalPeriod = getRentalPeriodDetails(
    vehicle.rentalDetails,
    isHourlyRental
  );

  return (
    <div className="car-card-container slide-visible">
      {/* card top */}
      <Link href={vehicleDetailsPageLink} className="card-top">
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
          {/* profile */}
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
              src={"/assets/img/blur-profile.webp"}
              alt="Disabled Company Logo"
              width={40}
              height={40}
              className="profile-icon"
            />
          )}
          <span className="brand">{vehicle.brandName}</span>

          {/* zero deposit */}
          {!vehicle?.securityDeposit?.enabled && (
            <div className="absolute left-2 bottom-2 inline-flex py-[0.3rem] animate-shimmer border border-slate-500 items-center justify-center rounded-[0.5rem] shadow bg-[linear-gradient(110deg,#c59330,35%,#ffd700,45%,#fffacd,55%,#d4a33a)] bg-[length:200%_100%] px-2 font-medium text-yellow-300 transition-colors focus:outline-none z-10 text-xs">
              Zero Deposit
            </div>
          )}

          {/* Hourly Rentals Slanted Badge */}
          {vehicle?.rentalDetails?.hour?.enabled && (
            <div className="hourly-rental badge-top-right">
              <span>Hourly Rental</span>
            </div>
          )}
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsPageLink}>
          {/* title */}
          <div className="model-name">{vehicle.model}</div>

          {/* vehicle specs grid */}
          <div className="specs-grid">
            {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => {
              return (
                <div key={key} className="spec">
                  {/* Using the formatted spec name to dynamically fetch the icon */}
                  <img
                    src={`${baseAssetsUrl}/icons/vehicle-specifications/${category}/${formatKeyForIcon(
                      key
                    )}.svg`}
                    alt={`${spec.name} icon`}
                    className="spec-icon"
                  />
                  <div className="each-spec-value">
                    {" "}
                    {key === "Mileage" && spec.value
                      ? `${spec.value} mileage range`
                      : spec.name || "N/A"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* location and price */}
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={18} />{" "}
              <span className="state">
                {convertToLabel(vehicle.state) || "N/A"}
              </span>
            </div>
            {rentalPeriod ? (
              <div className="price">
                <span className="rent-amount">
                  {rentalPeriod.rentInAED || "N/A"} AED
                </span>
                <span className="rent-period">&nbsp;{rentalPeriod.label}</span>
              </div>
            ) : (
              <div className="price">Rental Details N/A</div>
            )}
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
    </div>
  );
};

export default MainCard;
