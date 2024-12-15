"use client";

import React from "react";
import PropTypes, { string } from "prop-types";
import ContactIcons from "../contact-icons/ContactIcons";
import "./RentNowSection.scss"; // Ensure the correct relative path
import GreenNotificationPing from "../GreenNotificationPing";

interface RentNowSectionProps {
  vehicleId: string;
  whatsappUrl: string | null;
  email?: string | null;
  formattedPhoneNumber: string | null;
  isPing?: boolean;
  isMobileProfileCard?: boolean;
}

const RentNowSection: React.FC<RentNowSectionProps> = ({
  vehicleId,
  whatsappUrl,
  email,
  formattedPhoneNumber,
}) => {
  const isCompanyValid = !!email || !!formattedPhoneNumber || !!whatsappUrl;
  return (
    <div className="rent-now-section">
      {isCompanyValid ? (
        <div className="rent-now-btn">
          <GreenNotificationPing />
          <div className="text-content rent-now-hidden">
            <div>RENT NOW</div>
            <span>Available now for chat</span>
          </div>
        </div>
      ) : (
        <div className="not-available-div">
          <div>Currently Unavailable/ </div>
          <span>Vehicle On Trip</span>
        </div>
      )}
      <ContactIcons
        vehicleId={vehicleId}
        whatsappUrl={whatsappUrl || ""}
        email={email || null}
        phoneNumber={formattedPhoneNumber || ""}
      />
    </div>
  );
};

export default RentNowSection;
