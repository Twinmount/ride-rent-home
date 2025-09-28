import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";

import "react-international-phone/style.css";
import { Phone, Loader2 } from "lucide-react";
import "../phone-input.css";
import { useImmer } from "use-immer";
import { getNumberAfterSpace, getNumberAfterSpaceStrict } from "@/utils/helper";
import { LoginDrawerState } from "../LoginDrawer";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { LocationOverride } from "@/components/common/LocationOverride";

export const PhoneStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setUserExists,
  isCurrentlyLoading,
  signup,
  checkUserExists,
  clearError,
  setDrawerState,
}: any) => {
  const { location, isLoading: isLocationLoading } = useLocationDetection();

  const [phoneNumber, setPhoneNumber] = useImmer({
    value: "",
    number: "",
    countryCode: "",
  });

  const [detectedCountry, setDetectedCountry] = useState<string>("");
  const [userSelectedCountry, setUserSelectedCountry] = useState<string | null>(
    null
  );
  const [showSkipOption, setShowSkipOption] = useState<boolean>(false);

  useEffect(() => {
    if (isLocationLoading) {
      const timer = setTimeout(() => {
        setShowSkipOption(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSkipOption(false);
      return undefined;
    }
  }, [isLocationLoading]);

  // Update detected country when location is available
  useEffect(() => {
    if (location && !isLocationLoading && !userSelectedCountry) {
      setDetectedCountry(location.country);
    }
  }, [location, userSelectedCountry, isLocationLoading]);

  // Update phone number country code when detected country changes
  useEffect(() => {
    if (detectedCountry) {
      const countryCodeMap: Record<string, string> = {
        ae: "+971",
        in: "+91",
      };

      setPhoneNumber((draft) => {
        draft.countryCode = countryCodeMap[detectedCountry] || "+971";
      });
    }
  }, [detectedCountry, setPhoneNumber]);

  // Handle skip location detection
  const handleSkipDetection = () => {
    setUserSelectedCountry("ae"); // Default to UAE
    setDetectedCountry("ae");
  };

  const onChangeCountryCode = (value: any, country: any) => {
    const firstSpaceIndex = country.inputValue.indexOf(" ");
    // const countryCode = country.inputValue.substring(0, firstSpaceIndex);

    const phoneDetails = getNumberAfterSpaceStrict(country.inputValue);
    console.log("phoneDetails: ", phoneDetails);

    setPhoneNumber((draft) => {
      draft.value = value;
      draft.number = phoneDetails.phoneNumber;
    });
  };

  const handlePhoneSubmit = async () => {
    setStatus("loading");
    setStatusMessage("Checking phone number...");
    clearError();

    try {
      setDrawerState((draft: LoginDrawerState) => {
        draft.phoneNumber = phoneNumber.number;
        draft.countryCode = phoneNumber.countryCode;
      });
      // First check if user exists
      const userExistsResponse = await checkUserExists(
        phoneNumber.number,
        phoneNumber.countryCode
      );

      if (userExistsResponse.success && userExistsResponse.data) {
        if (userExistsResponse.data.userExists) {
          setUserExists(true);
          setStep("password");
          setStatus("success");
          setStatusMessage("Welcome back! Please enter your password.");
        } else {
          setStatus("loading");
          setStatusMessage("New user detected! Sending verification code...");

          const signupResponse = await signup({
            phoneNumber: phoneNumber.number,
            countryCode: phoneNumber.countryCode,
            countryId: "",
          });

          if (signupResponse.success && signupResponse.data) {
            setUserExists(false);
            setStep("otp");
            setStatus("success");
            setStatusMessage("OTP sent successfully! Check your Whatsapp.");
          }
        }
      }
    } catch (error: any) {
      console.log("error: [password section]", error);
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
          <Phone className="h-8 w-8 text-orange-600" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold">Welcome to Ride.Rent!</h3>
        <p className="text-balance text-muted-foreground">
          {"Enter your WhatsApp number to sign in or create a new account."}
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
          </div>

          {/* Location status and override */}
          {isLocationLoading && showSkipOption && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                🔍 Still detecting location...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipDetection}
                className="h-auto p-1 text-xs text-orange-600 hover:text-orange-700"
              >
                Skip & use default
              </Button>
            </div>
          )}

          {/* {!isLocationLoading && (
            <LocationOverride
              detectedLocation={location}
              selectedCountry={userSelectedCountry || detectedCountry}
              selectedCountryName={
                (userSelectedCountry || detectedCountry) === 'ae' 
                  ? 'UAE' 
                  : (userSelectedCountry || detectedCountry) === 'in'
                  ? 'India'
                  : undefined
              }
              className="mb-2"
            />
          )} */}

          <div onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}>
            {detectedCountry && (
              <PhoneInput
                defaultCountry={detectedCountry}
                value={phoneNumber.value}
                onChange={onChangeCountryCode}
                disabled={isCurrentlyLoading || isLocationLoading}
                // hideDropdown={true}
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
                inputProps={{
                  id: "phone",
                  "aria-label": "Phone number",
                  "aria-describedby": "phone-help",
                }}
              />
            )}
          </div>
          <p id="phone-help" className="sr-only">
            Enter your phone number to sign in or create an account
          </p>
        </div>
        <Button
          onClick={handlePhoneSubmit}
          disabled={
            !phoneNumber.number || isCurrentlyLoading || isLocationLoading
          }
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
          aria-label={
            isCurrentlyLoading
              ? "Checking phone number, please wait"
              : !phoneNumber.number
                ? "Continue - Please enter phone number first"
                : "Continue with phone verification"
          }
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Checking...
            </>
          ) : isLocationLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting location...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};
