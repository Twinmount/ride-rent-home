'use client';

import { useState } from 'react';
import { generateWhatsappUrl, getFormattedPhoneNumber } from '@/helpers';
import ContactPopup from '../dialog/ContactPopup';
import { useCarRent } from '@/hooks/useCarRent';
import { DateRangePicker } from '../dialog/date-range-picker/DateRangePicker';
import { BookingPopup } from '../dialog/BookingPopup';

export type ContactDetails = {
  email: string;
  phone: string;
  countryCode: string;
  whatsappPhone: string;
  whatsappCountryCode: string;
};

type RentNowButtonWideProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'wide' | 'compact';
  contactDetails?: ContactDetails | null;
  vehicleName?: string;
  state?: string;
  vehicleId?: string;
  agentId?: string;
  country?: string;
};

const RentNowButtonWide = ({
  onClick,
  disabled = false,
  className = '',
  variant = 'wide',
  contactDetails,
  vehicleName,
  state,
  vehicleId,
  agentId,
  country = 'ae',
}: RentNowButtonWideProps) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const {
    open,
    carRentDate,
    setOpen,
    handleConfirm,
    handleClose,
    showBookingPopup,
    formatDateRange,
    handleDateChange,
    handleBookingComplete,
    handleBookingCancel,
    handleBookingConfirm,
    rentalEnquiryMutation,
  } = useCarRent(
    undefined, // onDateChange callback
    vehicleId && agentId ? { vehicleId, agentId, country } : undefined
  );

  // Define size classes based on variant
  const sizeClasses =
    variant === 'compact' ? 'py-2 px-6 text-sm' : 'py-3 px-6 text-lg';

  // Define width classes based on variant
  const widthClasses = variant === 'compact' ? 'w-auto' : 'w-full';

  // Define margin classes based on variant
  const marginClasses = variant === 'compact' ? 'mb-2' : 'mt-4';

  // Generate contact data if contactDetails are provided
  const formattedPhoneNumber = contactDetails
    ? getFormattedPhoneNumber(contactDetails.countryCode, contactDetails.phone)
    : null;

  // For WhatsApp URL, we can use the vehicle name in the message
  const whatsappUrl = contactDetails
    ? generateWhatsappUrl({
        whatsappPhone: contactDetails.whatsappPhone,
        whatsappCountryCode: contactDetails.whatsappCountryCode,
        model: vehicleName || '',
        vehicleDetailsPageLink: '', // We can leave this empty or make it optional
      })
    : null;

  const handleClick = () => {
    // If contactDetails are provided and not null, show popup
    if (contactDetails) {
      // setShowContactPopup(true);
      setOpen(true);
    }

    // Also call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${widthClasses} ${marginClasses} ${sizeClasses} relative transform overflow-hidden rounded-[0.34rem] bg-gradient-to-r from-orange to-yellow font-medium text-text-primary shadow-md transition-transform duration-200 ease-in-out before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow before:to-orange before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:shadow-lg hover:before:opacity-100 active:scale-[0.98] active:from-[#df7204] active:to-orange disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 ${className}`}
      >
        <span className="relative z-10">Rent Now</span>
      </button>

      {/* Contact Popup */}

      {open && (
        <DateRangePicker
          open={open}
          handleClose={handleClose}
          carRentDate={carRentDate}
          handleConfirm={handleConfirm}
          title="Select Date Range"
          ConfirmBtnTxt="Confirm Booking"
          formatDateRange={formatDateRange}
          handleDateChange={handleDateChange}
        />
      )}

      {/* Booking Popup */}
      {/* {showBookingPopup && ( */}
      {/* <BookingPopup
        isOpen={showBookingPopup}
        onComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
        onConfirmBooking={handleBookingConfirm}
        isLoading={rentalEnquiryMutation.isPending}
        error={rentalEnquiryMutation.error?.message}
      /> */}
      {/* )} */}

      {contactDetails && (
        <ContactPopup
          vehicleId="contact-inquiry"
          whatsappUrl={whatsappUrl}
          email={contactDetails.email}
          phoneNumber={formattedPhoneNumber}
          vehicleName={vehicleName}
          isOpen={showContactPopup}
          onClose={() => setShowContactPopup(false)}
          state={state}
        />
      )}
    </>
  );
};

export default RentNowButtonWide;
