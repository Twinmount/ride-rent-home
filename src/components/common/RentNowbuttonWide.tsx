"use client";

import { useState, useEffect } from "react";
import { generateWhatsappUrl, getFormattedPhoneNumber } from "@/helpers";
import ContactPopup from "../dialog/ContactPopup";
import { useCarRent } from "@/hooks/useCarRent";
import { DateRangePicker } from "../dialog/date-range-picker/DateRangePicker";
import { BookingPopup } from "../dialog/BookingPopup";
import { BookingConfirmationModal } from "../dialog/booking-confirm-modal/BookingConfirmModal";
import { useAuthContext } from "@/auth";
import ActiveEnquiryDialog from "../dialog/ActiveEnquiryDialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

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
  const [showActiveEnquiryDialog, setShowActiveEnquiryDialog] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
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
    activeEnquiryData,
    isCheckingActiveEnquiry,
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

  // Show success toast when enquiry is successful
  useEffect(() => {
    if (rentalEnquiryMutation.isSuccess) {
      setShowSuccessToast(true);
      // Auto hide toast after 4 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [rentalEnquiryMutation.isSuccess]);

  // Handle booking confirmation modal close
  const handleBookingConfirmClose = () => {
    setShowBookingConfirm(false);
  };

  const { auth, onHandleLoginmodal } = useAuthContext();

  // Define size classes based on variant with mobile responsiveness
  const sizeClasses =
    variant === "compact"
      ? "py-2 px-4 sm:px-6 text-sm min-h-[40px] sm:min-h-[44px]"
      : "py-3 px-4 sm:px-6 text-base sm:text-lg min-h-[48px] sm:min-h-[52px]";

  // Define width classes based on variant with mobile responsiveness
  const widthClasses =
    variant === "compact" ? "w-auto min-w-[120px] sm:min-w-[140px]" : "w-full";

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

    // Check if user has an active enquiry for this vehicle
    if (activeEnquiryData?.hasActiveEnquiry) {
      setShowActiveEnquiryDialog(true);
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

  // Determine button text and styling based on active enquiry status
  const hasActiveEnquiry = activeEnquiryData?.hasActiveEnquiry;
  const buttonText = hasActiveEnquiry ? "Enquiry Pending" : "Rent Now";
  const buttonClassName = hasActiveEnquiry
    ? `${widthClasses} ${marginClasses} ${sizeClasses} relative transform overflow-hidden rounded-[0.34rem] bg-gradient-to-r from-blue-400 to-blue-500 font-medium text-white shadow-md transition-transform duration-200 ease-in-out cursor-pointer hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] touch-manipulation select-none ${className}`
    : `${widthClasses} ${marginClasses} ${sizeClasses} relative transform overflow-hidden rounded-[0.34rem] bg-gradient-to-r from-orange to-yellow font-medium text-text-primary shadow-md transition-transform duration-200 ease-in-out before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow before:to-orange before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:shadow-lg hover:before:opacity-100 active:scale-[0.98] active:from-[#df7204] active:to-orange disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 touch-manipulation select-none ${className}`;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isCheckingActiveEnquiry}
        className={buttonClassName}
      >
        <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
          {isCheckingActiveEnquiry ? "Checking..." : buttonText}
        </span>
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

      {/* Active Enquiry Dialog */}
      {activeEnquiryData?.hasActiveEnquiry && (
        <ActiveEnquiryDialog
          isOpen={showActiveEnquiryDialog}
          onClose={() => setShowActiveEnquiryDialog(false)}
          enquiry={activeEnquiryData.enquiry}
          vehicleName={vehicleName || "this vehicle"}
        />
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
          >
            <div className="flex items-center justify-center gap-3 rounded-lg bg-green-600 px-6 py-4 text-white shadow-lg">
              <CheckCircle size={20} className="text-white" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Enquiry Sent Successfully!
                </span>
                <span className="text-xs opacity-90">
                  We&apos;ll get back to you soon
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RentNowButtonWide;
