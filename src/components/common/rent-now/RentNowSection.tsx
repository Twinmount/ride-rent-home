"use client";

import React from 'react';
import PropTypes, { string } from 'prop-types';
import ContactIcons from '../contact-icons/ContactIcons';
import './RentNowSection.scss'; // Ensure the correct relative path

interface RentNowSectionProps {
  vehicleId: string;
  whatsappUrl: string | null; 
  email?: string| null; 
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
      { isCompanyValid?(
        <div className="rent-now-btn">   
            <span className="relative flex-center h-4 w-4 mr-2 ping-animation sm:display-hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 sm:display-hidden md:display-hidden" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          <div className="text-content rent-now-hidden">
            <div>RENT NOW</div>
            <span>Available now for chat</span>
          </div>
        </div>
        ) : (
        <div className="not-available-div">
          <div>Currently Unavailable/ </div>
          {/* <div>Or</div> */}
          <span>Vehicle On Trip</span>
        </div>
      )}
      <ContactIcons
        vehicleId={vehicleId}
        whatsappUrl={whatsappUrl || ''} 
        email={email || null}
        phoneNumber={formattedPhoneNumber || ''} 
      />
    </div>
  );
}



export default RentNowSection;
