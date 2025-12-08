"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
  X,
  User,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { VehicleDetailsData } from "@/types/car.rent.type";
import { useAuthContext } from "@/auth";
import { parsePhoneNumber } from "react-phone-number-input";
import { PhoneInput2 } from "@/components/phoneInput/PhoneInput2";
import { getNumberAfterSpaceStrict, getDotCount } from "@/utils/helper";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  vehicleData?: VehicleDetailsData;
  isProcessing?: boolean;
  onPhoneVerificationRequired?: () => void;
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleData,
  isProcessing = false,
  onPhoneVerificationRequired,
}: BookingConfirmationModalProps) {
  const [step, setStep] = useState<"confirmation" | "success">("confirmation");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp" | "verified">(
    "phone"
  );
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [allowNumberCount, setAllowNumberCount] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: sessionData, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { verifyOAuthPhone } = useAuthContext();

  const bookingData = vehicleData;

  // Check if user has a phone number (update when phoneStep is verified)
  const hasPhoneNumber =
    phoneStep === "verified" ||
    (sessionData?.user?.phoneNumber && (sessionData as any)?.isPhoneVerified);

  // Check if user is OAuth user without phone (needs phone verification)
  const isOAuthUserWithoutPhone =
    sessionData &&
    !hasPhoneNumber &&
    (sessionData as any)?.provider &&
    (sessionData as any)?.provider !== "credentials";

  // Reset phone step when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPhoneStep("phone");
      setPhoneValue("");
      setPhoneNumber("");
      setCountryCode("");
      setOtp(["", "", "", ""]);
      setOtpId(null);
      setPhoneError(null);
      setOtpError(null);
      setResendTimer(0);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  // Handle country code change
  const handleCountryCodeChange = (value: string, country: any) => {
    const phoneDetails = getNumberAfterSpaceStrict(country.inputValue);
    const newAllowCount = getDotCount(country.country.format);
    const newCountryCode = `+${country.country.dialCode}`;

    // Update display value immediately
    setPhoneValue(value);
    setPhoneError(null);

    // Update country code and allowed number count
    setCountryCode(newCountryCode);
    setAllowNumberCount(newAllowCount);

    // Update phone number if it fits the new format
    if (
      newAllowCount === 0 ||
      phoneDetails.phoneNumber.length <= newAllowCount
    ) {
      setPhoneNumber(phoneDetails.phoneNumber);
    }
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow numeric characters
    value = value.replace(/[^0-9]/g, "");

    // Limit to allowed number count if specified
    value = allowNumberCount > 0 ? value.slice(0, allowNumberCount) : value;

    e.target.value = value;
    setPhoneNumber(value);
    setPhoneError(null);
  };

  // Legacy handler for backward compatibility (if needed)
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value || "");
    setPhoneError(null);

    if (value) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed) {
          setCountryCode(`+${parsed.countryCallingCode}`);
          setPhoneNumber(parsed.nationalNumber);
        }
      } catch (e) {
        // Handle parsing error
        console.error("Phone parsing error:", e);
      }
    } else {
      setPhoneNumber("");
      setCountryCode("");
    }
  };

  // Handle add phone number directly (no OTP verification)
  const handleAddPhone = async () => {
    if (!phoneNumber || !countryCode) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    if (!sessionData?.user?.id) {
      setPhoneError("User session not found");
      return;
    }

    setIsSendingOtp(true);
    setPhoneError(null);

    try {
      // Directly add phone number without OTP verification
      const response = await verifyOAuthPhone(
        sessionData.user.id,
        phoneNumber,
        countryCode
      );

      if (response.success) {
        setPhoneStep("verified");

        // Refresh session to get updated phone number
        await updateSession();
        await queryClient.invalidateQueries({ queryKey: ["session"] });

        // Phone is verified, user can now proceed with booking by clicking "Send enquiry"
      } else {
        setPhoneError(response.message || "Failed to add phone number");
      }
    } catch (error: any) {
      setPhoneError(
        error.message || "Failed to add phone number. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ""); // Only allow digits
    setOtp(newOtp);
    setOtpError(null);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 4 digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
      setTimeout(() => handleVerifyOtp(newOtp.join("")), 100);
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 4) {
      setOtpError("Please enter a 4-digit OTP");
      return;
    }

    if (!otpId || !sessionData?.user?.id) {
      setOtpError("OTP session expired. Please request a new OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const response = await verifyOAuthPhone(
        sessionData.user.id,
        phoneNumber,
        countryCode,
        otpId,
        code
      );

      if (response.success) {
        setPhoneStep("verified");

        // Refresh session to get updated phone number
        await updateSession();
        await queryClient.invalidateQueries({ queryKey: ["session"] });

        // Phone is verified, user can now proceed with booking by clicking "Send enquiry"
        // Don't auto-submit - let user review and confirm
      } else {
        setOtpError(response.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setOtpError(error.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleConfirmBooking = async () => {
    // If user has phone number, proceed with booking
    if (onConfirm) {
      onConfirm();
    } else {
      // Default behavior - simulate booking process
      setStep("success");
    }
  };

  const handleClose = () => {
    setStep("confirmation");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("confirmation");
    }
  }, [isOpen]);

  return (
    //
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[98vh] w-full max-w-[90vw] overflow-y-auto p-3 sm:max-h-[90vh] sm:max-w-lg sm:p-6">
        {step === "confirmation" ? (
          <>
            <DialogHeader className="space-y-1 pb-2 sm:space-y-4 sm:pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-base font-bold text-transparent sm:text-2xl">
                  Confirm Your Booking
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-6">
              {/* Car Details */}
              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-2 sm:p-4">
                <div className="flex gap-2 sm:gap-4">
                  <img
                    src={bookingData?.carImage || "/placeholder.svg"}
                    alt={`${bookingData?.carName || "Vehicle"} vehicle`}
                    className="h-10 w-14 flex-shrink-0 rounded-md object-cover sm:h-16 sm:w-24"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold sm:text-lg">
                      {bookingData?.carName}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-sm">
                      <MapPin
                        className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3"
                        aria-hidden="true"
                      />
                      <span className="truncate">{bookingData?.location}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1 sm:gap-2">
                      <Badge className="bg-orange-100 px-1.5 py-0.5 text-[9px] text-orange-700 hover:bg-orange-200 sm:text-xs">
                        <Shield
                          className="mr-0.5 h-2 w-2 sm:h-3 sm:w-3"
                          aria-hidden="true"
                        />
                        Insured
                      </Badge>
                      <Badge className="bg-green-100 px-1.5 py-0.5 text-[9px] text-green-700 hover:bg-green-200 sm:text-xs">
                        <CheckCircle
                          className="mr-0.5 h-2 w-2 sm:h-3 sm:w-3"
                          aria-hidden="true"
                        />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2">
                <div className="space-y-1.5 sm:space-y-3">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Calendar
                      className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 sm:h-5 sm:w-5"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium sm:text-sm">
                        Pickup Date
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground sm:text-sm">
                        {bookingData?.startDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-3">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Calendar
                      className="h-3.5 w-3.5 flex-shrink-0 text-red-500 sm:h-5 sm:w-5"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium sm:text-sm">
                        Return Date
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground sm:text-sm">
                        {bookingData?.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Details */}
              <div className="space-y-2 sm:space-y-4">
                <h4 className="text-xs font-semibold sm:text-base">
                  Your Details
                </h4>
                <div className="grid grid-cols-1 gap-2 text-[10px] sm:gap-4 sm:text-sm md:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                    <User
                      className="h-3 w-3 flex-shrink-0 text-orange-500 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {bookingData?.customer?.name || "John Doe"}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                    <Phone
                      className="h-3 w-3 flex-shrink-0 text-orange-500 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {sessionData?.user?.phoneNumber
                        ? `${sessionData?.user?.countryCode} ${sessionData?.user?.phoneNumber}`
                        : "Not provided"}
                    </span>
                    {phoneStep === "verified" && (
                      <CheckCircle className="h-2.5 w-2.5 flex-shrink-0 text-green-600 sm:h-3 sm:w-3" />
                    )}
                  </div>
                  {bookingData?.customer?.email ? (
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                      <Mail
                        className="h-3 w-3 flex-shrink-0 text-orange-500 sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {bookingData?.customer?.email}
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* Phone Number Input Section for OAuth Users */}
              {isOAuthUserWithoutPhone && phoneStep === "phone" && (
                <div className="space-y-2 rounded-lg border border-orange-200 bg-orange-50 p-2 sm:space-y-4 sm:p-4">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-600 sm:h-4 sm:w-4" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium text-orange-900 sm:text-sm">
                        Phone Number Required
                      </p>
                      <p className="mt-0.5 text-[9px] text-orange-700 sm:text-xs">
                        Please add your phone number to complete the booking
                        enquiry.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-3">
                    <div className="space-y-0.5 sm:space-y-2">
                      <Label
                        htmlFor="booking-phone"
                        className="text-[9px] font-medium sm:text-sm"
                      >
                        Mobile Number
                      </Label>
                      <PhoneInput2
                        value={phoneValue}
                        onChange={handleCountryCodeChange}
                        defaultCountry="AE"
                        phoneNumber={phoneNumber}
                        countryCode={countryCode}
                        onHandlePhoneNumberChange={handlePhoneNumberChange}
                        placeholder="Enter phone number"
                      />
                      {phoneError && (
                        <p className="text-[8px] text-red-600 sm:text-xs">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleAddPhone}
                      disabled={!phoneNumber || !countryCode || isSendingOtp}
                      className="h-8 w-full bg-gradient-to-r from-orange-500 to-red-500 py-0.5 text-[9px] text-white hover:from-orange-600 hover:to-red-600 sm:h-10 sm:py-2 sm:text-sm"
                    >
                      {isSendingOtp ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-2.5 w-2.5 animate-spin sm:h-4 sm:w-4" />
                          <span className="text-[9px] sm:text-sm">
                            Adding Phone Number...
                          </span>
                        </div>
                      ) : (
                        "Add Phone Number"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Phone Verified Success Message */}
              {phoneStep === "verified" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-2 sm:p-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3 w-3 flex-shrink-0 text-green-600 sm:h-5 sm:w-5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-green-900 sm:text-sm">
                        Phone Number Verified Successfully
                      </p>
                      <p className="text-[9px] text-green-700 sm:text-xs">
                        You can now proceed with your booking enquiry.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Price Breakdown */}
              {/* <div className="space-y-4">
                <h4 className="font-semibold">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Car rental ({bookingData.totalDays} days)</span>
                    <span>
                      {bookingData.pricePerDay} AED × {bookingData.totalDays}
                    </span>
                  </div>
                  {/* Insurance and Service fee - commented out for now, can be enabled in future */}
              {/* <div className="flex justify-between">
                    <span>Insurance</span>
                    <span>{bookingData.insurance || 50} AED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>{bookingData.serviceFee || 25} AED</span>
                  </div> */}
              {/* <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Rental charges (approx.)</span>
                    <span className="text-orange-600">
                      {bookingData.totalPrice} AED
                    </span>
                  </div>
                </div> */}
              {/* </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 pt-2 sm:flex-row sm:gap-3 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent py-1.5 text-[10px] text-orange-600 hover:bg-orange-50 sm:py-2 sm:text-sm"
                  disabled={isProcessing}
                  aria-label="Cancel booking process"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 py-1.5 text-[10px] text-white hover:from-orange-600 hover:to-red-600 sm:py-2 sm:text-sm"
                  disabled={isProcessing || isOAuthUserWithoutPhone}
                  aria-label={
                    isProcessing
                      ? "Processing enquiry, please wait"
                      : isOAuthUserWithoutPhone
                        ? "Please verify phone number first"
                        : "Send enquiry for this vehicle"
                  }
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-4 sm:w-4"
                        role="status"
                        aria-label="Loading"
                      />
                      <span className="text-[10px] sm:text-sm">
                        Processing...
                      </span>
                    </div>
                  ) : isOAuthUserWithoutPhone ? (
                    "Verify Phone to Continue"
                  ) : (
                    "Send enquiry"
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="space-y-3 py-3 text-center sm:space-y-6 sm:py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 sm:h-20 sm:w-20">
                <CheckCircle
                  className="h-6 w-6 text-white sm:h-10 sm:w-10"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-lg font-bold sm:text-2xl">
                  Booking Confirmed!
                </h2>
                <p className="px-1 text-[10px] text-muted-foreground sm:text-sm">
                  Your {bookingData?.carName} has been successfully booked.
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-2 text-left sm:p-4">
                <h3 className="mb-1 text-xs font-semibold sm:mb-2 sm:text-base">
                  Booking Reference
                </h3>
                <p className="break-all font-mono text-base font-bold text-orange-600 sm:text-2xl">
                  RR-{Date.now().toString().slice(-6)}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-sm">
                  Save this reference number for your records
                </p>
              </div>

              <div className="space-y-0.5 px-1 text-[10px] text-muted-foreground sm:text-sm">
                <p className="break-words">
                  📧 Confirmation email sent to{" "}
                  {bookingData?.customer?.email || "john.doe@email.com"}
                </p>
                <p className="break-words">
                  📱 SMS confirmation sent to {bookingData?.customer?.phone}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent py-1.5 text-[10px] text-orange-600 hover:bg-orange-50 sm:py-2 sm:text-sm"
                  aria-label="Close confirmation dialog"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 py-1.5 text-[10px] text-white hover:from-orange-600 hover:to-red-600 sm:py-2 sm:text-sm"
                  aria-label="View all your bookings"
                >
                  View My Bookings
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
