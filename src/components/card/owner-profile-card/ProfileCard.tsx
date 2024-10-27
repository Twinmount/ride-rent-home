"use client";

import "./ProfileCard.scss";
import { MdVerifiedUser } from "react-icons/md";
import ProfileSpecification from "@/components/root/vehicle details/profile-specifications/ProfileSpecification";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { Company, RentalDetails } from "@/types/vehicle-details-types";
import ContactIcons from "@/components/common/contact-icons/ContactIcons";
import { formatPhoneNumber } from "@/helpers";

type ProfileCardProps = {
  company: Company;
  rentalDetails: RentalDetails;
  vehicleId: string;
  isLease: boolean;
};

const ProfileCard = ({
  company,
  rentalDetails,
  vehicleId,
  isLease,
}: ProfileCardProps) => {
  const contactDetails = company?.contactDetails;

  const formattedPhoneNumber =
    contactDetails?.countryCode && contactDetails.phone
      ? formatPhoneNumber(contactDetails?.countryCode, contactDetails.phone)
      : null;

  const message =
    "Hello, I would like to connect with you regarding the vehicle listed on Ride.Rent.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = contactDetails
    ? `https://wa.me/${contactDetails.whatsappCountryCode}${contactDetails.whatsappPhone}?text=${encodedMessage}`
    : null;

  return (
    <MotionDiv className="profile-card">
      <div className="profile-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
      </div>

      {(!company.companyName || !company.companyProfile) && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      {/* profile */}
      <div className="top">
        <div className="profile-details">
          <div
            className={`${
              company.companyProfile ? "" : "blurred-profile"
            }  profile`}
          >
            <img
              src={company.companyProfile || "/assets/img/blur-profile.webp"}
              alt={
                company?.companyName
                  ? `${company.companyName} logo`
                  : "Company logo"
              }
              loading="lazy"
              className={`company-profile `}
              draggable={false}
            />
          </div>
          <div>
            <p
              className={`${
                company.companyName ? "" : "blurred-text"
              } company-name`}
            >
              {company.companyName || "Company Disabled"}
            </p>

            <div className="verified">
              <MdVerifiedUser className="icon" />
              <span>Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <ProfileSpecification
        specs={company.companySpecs}
        rentalDetails={rentalDetails}
        isLease={isLease}
      />

      {/* Contact and action buttons */}
      <div className="bottom">
        <div className="bottom-box">
          <div className="rent-now-btn">
            RENT NOW
            <span>Available now for chat</span>
          </div>
          <ContactIcons
            vehicleId={vehicleId}
            whatsappUrl={whatsappUrl}
            email={contactDetails?.email || null} //  null email
            phoneNumber={formattedPhoneNumber}
          />
        </div>
      </div>
    </MotionDiv>
  );
};

export default ProfileCard;
