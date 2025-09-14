import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Phone, Loader2 } from "lucide-react";

export const PhoneStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setUserExists,
  setDrawerState,
  drawerState,
  isCurrentlyLoading,
  signup,
  clearError,
}: any) => {
  const [phoneNumber, setPhoneNumber] = useState(drawerState.phoneNumber || "");

  const extractPhoneData = (fullPhoneNumber: string) => {
    const countryCodeMatch = fullPhoneNumber.match(/^\+(\d{1,4})/);
    const extractedCountryCode = countryCodeMatch
      ? `+${countryCodeMatch[1]}`
      : "+1";
    const phoneOnly = fullPhoneNumber.replace(extractedCountryCode, "");
    return {
      countryCode: extractedCountryCode,
      phoneNumber: phoneOnly,
      fullPhone: fullPhoneNumber,
    };
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) return;
    setStatus("loading");
    setStatusMessage("Checking phone number...");
    clearError();

    try {
      const phoneData = extractPhoneData(phoneNumber);
      setDrawerState((prev: any) => ({
        ...prev,
        phoneNumber,
        countryCode: phoneData.countryCode,
      }));
      try {
        const signupResponse = await signup({
          phoneNumber: phoneData.phoneNumber,
          countryCode: phoneData.countryCode,
          countryId: drawerState.countryId || 1,
        });
        if (signupResponse.success && signupResponse.data) {
          setDrawerState((prev: any) => ({
            ...prev,
            userId: signupResponse.data.userId,
            otpId: signupResponse.data.otpId,
          }));
          setUserExists(false);
          setStep("otp");
          setStatus("success");
          setStatusMessage("OTP sent successfully! Check your SMS.");
        }
      } catch (signupError: any) {
        if (
          signupError?.message?.includes("already exists") ||
          signupError?.message?.includes("already registered") ||
          signupError?.message?.includes("User already exists")
        ) {
          setUserExists(true);
          setStep("password");
          setStatus("success");
          setStatusMessage("Welcome back! Please enter your password.");
        } else {
          throw signupError;
        }
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(
        error?.message || "Failed to verify phone number. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <Phone className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold">Welcome to Ride.Rent!</h3>
        <p className="text-balance text-muted-foreground">
          Enter your phone number to sign in or create a new account
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <div onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}>
            <PhoneInput
              defaultCountry="us"
              value={phoneNumber}
              onChange={setPhoneNumber}
              disabled={isCurrentlyLoading}
              style={{ height: "48px" }}
              inputStyle={{
                width: "100%",
                height: "48px",
                fontSize: "18px",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0 6px 6px 0",
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              }}
            />
          </div>
        </div>
        <Button
          onClick={handlePhoneSubmit}
          disabled={!phoneNumber.trim() || isCurrentlyLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};
