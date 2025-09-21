import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";

import "react-international-phone/style.css";
import { Phone, Loader2 } from "lucide-react";
import "../phone-input.css";
import { useImmer } from "use-immer";
import { getNumberAfterSpace, getNumberAfterSpaceStrict } from "@/utils/helper";
import { LoginDrawerState } from "../LoginDrawer";

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
  const [phoneNumber, setPhoneNumber] = useImmer({
    value: "",
    number: "",
    countryCode: "",
  });

  const onChangeCountryCode = (value: any, country: any) => {
    const phoneDetails = getNumberAfterSpaceStrict(country.inputValue);

    setPhoneNumber((draft) => {
      draft.value = value;
      draft.number = phoneDetails.phoneNumber;
      draft.countryCode = phoneDetails.countryCode;
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
            setStatusMessage("OTP sent successfully! Check your SMS.");
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
              defaultCountry="ae"
              value={phoneNumber.value}
              onChange={onChangeCountryCode}
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
          disabled={!phoneNumber.number || isCurrentlyLoading}
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
