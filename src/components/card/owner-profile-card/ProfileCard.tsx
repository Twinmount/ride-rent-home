"use client";

import "./ProfileCard.scss";
import { MdVerifiedUser } from "react-icons/md";
import ProfileSpecification from "@/components/root/vehicle details/profile-specifications/ProfileSpecification";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import { Company, RentalDetails } from "@/types/vehicle-details-types";
import { formatPhoneNumber, generateModelDetailsUrl } from "@/helpers";

type ProfileCardProps = {
  company: Company;
  rentalDetails: RentalDetails;
  vehicleId: string;
  isLease: boolean;
  vehicleData: {
    brandName: string;
    model: string;
    state: string;
    category: string;
  };
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
};



const ProfileCard = ({
  company,
  rentalDetails,
  vehicleId,
  isLease,
  vehicleData,
  securityDeposit,
}: ProfileCardProps) => {
  const contactDetails = company?.contactDetails;

  const formattedPhoneNumber =
    contactDetails?.countryCode && contactDetails.phone
      ? formatPhoneNumber(contactDetails?.countryCode, contactDetails.phone)
      : null;

  const modelDetails = generateModelDetailsUrl(vehicleData);

  const { state, model, category } = vehicleData;

  const vehicleDetailsPageLink = `${state}/${category}/${modelDetails}/${vehicleId}`;
  const whatsappPageLink = `https://ride.rent/${vehicleDetailsPageLink}`;

  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = contactDetails
    ? `https://wa.me/${contactDetails.whatsappCountryCode}${contactDetails.whatsappPhone}?text=${encodedMessage}`
    : null;

  const isCompanyValid = !!company.companyName && !!company.companyProfile;

  return (
    <MotionDiv className="profile-card">
      <div className="profile-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
      </div>

      {!isCompanyValid && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      <div className="top">
        <div className="profile-details">
          <div className={`${company.companyProfile ? "" : "blurred-profile"} profile`}>
            <img
              src={company.companyProfile || "/assets/img/blur-profile.webp"}
              alt={company?.companyName ? `${company.companyName} logo` : "Company logo"}
              loading="lazy"
              className="company-profile"
              draggable={false}
            />
          </div>
          <div>
            <p className={`${company.companyName ? "" : "blurred-text"} company-name`}>
              {company.companyName || "Company Disabled"}
            </p>
            <div className="verified">
              <MdVerifiedUser className="icon" />
              <span>Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>

      <ProfileSpecification
        specs={company.companySpecs}
        rentalDetails={rentalDetails}
        isLease={isLease}
        securityDeposit={securityDeposit}
      />

      <div className="bottom">
        <RentNowSection
          vehicleId={vehicleId}
          whatsappUrl={whatsappUrl}
          email={contactDetails?.email}
          formattedPhoneNumber={formattedPhoneNumber}
          isPing={true}
        />
      </div>
    </MotionDiv>
  );
};

export default ProfileCard;
