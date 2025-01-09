"use client";

import "./ProfileCard.scss";
import { MdVerifiedUser } from "react-icons/md";
import ProfileSpecification from "@/components/root/vehicle details/profile-specifications/ProfileSpecification";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

type ProfileCardProps = {
  profileData: ProfileCardDataType;
};

const ProfileCard = ({ profileData }: ProfileCardProps) => {
  const {
    company,
    rentalDetails,
    vehicleId,
    vehicleCode,
    isLease,
    vehicleData,
    securityDeposit,
    vehicleTitle,
  } = profileData;

  const { state, model, category } = vehicleData;

  const contactDetails = company?.contactDetails;

  const formattedPhoneNumber = getFormattedPhoneNumber(
    contactDetails?.countryCode,
    contactDetails?.phone,
  );

  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicleTitle,
    state: state,
    vehicleCategory: category,
    vehicleCode: vehicleCode,
  });

  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: contactDetails?.whatsappPhone,
    whatsappCountryCode: contactDetails?.whatsappCountryCode,
    model: model,
    vehicleDetailsPageLink,
  });

  const isCompanyValid = !!company.companyName && !!company.companyProfile;

  // company profile page link
  const companyProfilePageLink = generateCompanyProfilePageLink(
    company.companyName,
    company.companyId,
  );

  return (
    <MotionDiv className="profile-card">
      <div className="profile-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
      </div>

      {!isCompanyValid && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      <div className="top-container">
        {" "}
        <div className="top">
          {/* animated border */}
          <div className="absolute inset-0 z-0 h-full w-full animate-rotate rounded-full bg-[conic-gradient(#ffa733_20deg,transparent_120deg)]" />

          {/* black overlay with text */}
          <Link
            href={companyProfilePageLink}
            target="_blank"
            className="company-black-overlay"
          >
            Visit Company
            <SquareArrowOutUpRight />
          </Link>

          <Link href={companyProfilePageLink} className="profile-details">
            <div
              className={`${
                company.companyProfile ? "" : "blurred-profile"
              } profile-logo`}
            >
              <img
                src={company.companyProfile || "/assets/img/blur-profile.webp"}
                alt={
                  company?.companyName
                    ? `${company.companyName} logo`
                    : "Company logo"
                }
                loading="lazy"
                className="company-profile-logo"
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
          </Link>
        </div>
        {/* View portfolio */}
        <div className="view-portfolio">View Portfolio</div>
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
