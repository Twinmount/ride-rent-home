"use client";

import { useState } from "react";
import { generateWhatsappUrl, getFormattedPhoneNumber } from "@/helpers";
import ContactPopup from "../dialog/ContactPopup";
import { useCarRent } from "@/hooks/useCarRent";
import { DateRangePicker } from "../dialog/date-range-picker/DateRangePicker";
import { BookingPopup } from "../dialog/BookingPopup";
import { BookingConfirmationModal } from "../dialog/booking-confirm-modal/BookingConfirmModal";
import { useAuthContext } from "@/auth";

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
  variant?: "wide" | "compact";
  contactDetails?: ContactDetails | null;
  vehicleName?: string;
  state?: string;
  vehicleId?: string;
  agentId?: string;
  country?: string;
  vehicle?: any;
};

const RentNowButtonWide = ({
  onClick,
  disabled = false,
  className = "",
  variant = "wide",
  contactDetails,
  vehicleName,
  state,
  vehicleId,
  agentId,
  country = "ae",
  vehicle,
}: RentNowButtonWideProps) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const {
    open,
    carRentDate,
    setOpen,
    handleConfirm,
    handleClose,
    formatDateRange,
    handleDateChange,
    VehicleDetailsData,
    rentalEnquiryMutation,
  } = useCarRent(
    undefined, // onDateChange callback
    vehicleId && agentId ? { vehicleId, agentId, country, vehicle } : undefined
  );

  // Custom handle confirm for date picker
  const handleDateConfirm = () => {
    setOpen(false); // Close date picker
    setShowBookingConfirm(true); // Show booking confirmation modal
  };

  // Handle booking confirmation
  const handleBookingConfirm = () => {
    setShowBookingConfirm(false);
    handleConfirm(); // This will trigger the rental enquiry
  };

  // Handle booking confirmation modal close
  const handleBookingConfirmClose = () => {
    setShowBookingConfirm(false);
  };

  const { auth, onHandleLoginmodal } = useAuthContext();

  // Define size classes based on variant
  const sizeClasses =
    variant === "compact" ? "py-2 px-6 text-sm" : "py-3 px-6 text-lg";

  // Define width classes based on variant
  const widthClasses = variant === "compact" ? "w-auto" : "w-full";

  // Define margin classes based on variant
  const marginClasses = variant === "compact" ? "mb-2" : "mt-4";

  // Generate contact data if contactDetails are provided
  const formattedPhoneNumber = contactDetails
    ? getFormattedPhoneNumber(contactDetails.countryCode, contactDetails.phone)
    : null;

  // For WhatsApp URL, we can use the vehicle name in the message
  const whatsappUrl = contactDetails
    ? generateWhatsappUrl({
        whatsappPhone: contactDetails.whatsappPhone,
        whatsappCountryCode: contactDetails.whatsappCountryCode,
        model: vehicleName || "",
        vehicleDetailsPageLink: "",
      })
    : null;

  const handleClick = () => {
    if (!auth.isLoggedIn) {
      onHandleLoginmodal({ isOpen: true });
      return;
    }

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
          handleConfirm={handleDateConfirm}
          title={VehicleDetailsData.carName}
          ConfirmBtnTxt="Continue to Booking"
          formatDateRange={formatDateRange}
          handleDateChange={handleDateChange}
        />
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirm && (
        <BookingConfirmationModal
          isOpen={showBookingConfirm}
          onClose={handleBookingConfirmClose}
          onConfirm={handleBookingConfirm}
          vehicleData={VehicleDetailsData}
          isProcessing={rentalEnquiryMutation.isPending}
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
