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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Shield,
  CheckCircle,
  X,
  User,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { VehicleDetailsData } from "@/types/car.rent.type";
import { useAuthContext } from "@/auth";
import { PhoneInput } from "@/components/ui/phone-input";
import { parsePhoneNumber } from "react-phone-number-input";

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

  // Handle phone input change
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {step === "confirmation" ? (
          <>
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
                  Confirm Your Booking
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Car Details */}
              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4">
                <div className="flex gap-4">
                  <img
                    src={bookingData?.carImage || "/placeholder.svg"}
                    alt={`${bookingData?.carName || "Vehicle"} vehicle`}
                    className="h-16 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {bookingData?.carName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span>{bookingData?.location}</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Badge className="bg-orange-100 text-xs text-orange-700 hover:bg-orange-200">
                        <Shield className="mr-1 h-3 w-3" aria-hidden="true" />
                        Insured
                      </Badge>
                      <Badge className="bg-green-100 text-xs text-green-700 hover:bg-green-200">
                        <CheckCircle
                          className="mr-1 h-3 w-3"
                          aria-hidden="true"
                        />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="h-5 w-5 text-orange-500"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium">Pickup Date</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData?.startDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium">Return Date</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData?.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">Your Details</h4>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User
                      className="h-4 w-4 text-orange-500"
                      aria-hidden="true"
                    />
                    <span>{bookingData?.customer?.name || "John Doe"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      className="h-4 w-4 text-orange-500"
                      aria-hidden="true"
                    />
                    <span>
                      {phoneStep === "verified" && phoneNumber
                        ? `${countryCode} ${phoneNumber}`
                        : bookingData?.customer?.phone ||
                          sessionData?.user?.phoneNumber ||
                          "Not provided"}
                    </span>
                    {phoneStep === "verified" && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  {bookingData?.customer?.email ? (
                    <div className="flex items-center gap-3">
                      <Mail
                        className="h-4 w-4 text-orange-500"
                        aria-hidden="true"
                      />
                      <span>{bookingData?.customer?.email}</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* Phone Number Input Section for OAuth Users */}
              {isOAuthUserWithoutPhone && phoneStep === "phone" && (
                <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">
                        Phone Number Required
                      </p>
                      <p className="mt-1 text-xs text-orange-700">
                        Please add your phone number to complete the booking
                        enquiry.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="booking-phone"
                        className="text-sm font-medium"
                      >
                        Mobile Number
                      </Label>
                      <PhoneInput
                        id="booking-phone"
                        value={phoneValue}
                        onChange={handlePhoneChange}
                        defaultCountry="AE"
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                      {phoneError && (
                        <p className="text-xs text-red-600">{phoneError}</p>
                      )}
                    </div>

                    <Button
                      onClick={handleAddPhone}
                      disabled={!phoneNumber || !countryCode || isSendingOtp}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                    >
                      {isSendingOtp ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding Phone Number...
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
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Phone Number Verified Successfully
                      </p>
                      <p className="text-xs text-green-700">
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
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent text-orange-600 hover:bg-orange-50"
                  disabled={isProcessing}
                  aria-label="Cancel booking process"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
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
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        role="status"
                        aria-label="Loading"
                      />
                      Processing...
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
            <div className="space-y-6 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <CheckCircle
                  className="h-10 w-10 text-white"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="text-muted-foreground">
                  Your {bookingData?.carName} has been successfully booked.
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4 text-left">
                <h3 className="mb-2 font-semibold">Booking Reference</h3>
                <p className="font-mono text-2xl font-bold text-orange-600">
                  RR-{Date.now().toString().slice(-6)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save this reference number for your records
                </p>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  📧 Confirmation email sent to{" "}
                  {bookingData?.customer?.email || "john.doe@email.com"}
                </p>
                <p>
                  📱 SMS confirmation sent to {bookingData?.customer?.phone}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent text-orange-600 hover:bg-orange-50"
                  aria-label="Close confirmation dialog"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
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
