import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Loader2 } from "lucide-react"; // Changed icon to Smartphone

export const ForgotPasswordStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  drawerState,
  isCurrentlyLoading,
  sendPasswordResetCodeViaWhatsApp, // New prop for sending code
  clearError,
}: any) => {
  const [phoneNumber, setPhoneNumber] = useState(drawerState.phoneNumber || ""); // Pre-fill if phone number is available
  const [codeSent, setCodeSent] = useState(false);

  const handleSendResetCode = async () => {
    if (!phoneNumber.trim()) return;
    setStatus("loading");
    setStatusMessage("Sending reset code via WhatsApp...");
    clearError();

    try {
      // Replace with your actual API call to send password reset code via WhatsApp
      const resetResponse = await sendPasswordResetCodeViaWhatsApp({
        phoneNumber,
        countryCode: drawerState.countryCode, // Assuming countryCode is part of drawerState
      });

      if (resetResponse.success) {
        setCodeSent(true);
        setStatus("success");
        setStatusMessage("Password reset code sent!");
        // Optionally, you might want to automatically advance to a 'VerifyResetCodeStep' here
        // setStep("verifyResetCode");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(
        error?.message || "Failed to send reset code. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <Smartphone className="h-8 w-8 text-orange-600" />{" "}
          {/* Updated icon */}
        </div>
        <h3 className="text-xl font-semibold">Forgot Your Password?</h3>
        <p className="text-balance text-muted-foreground">
          No worries, we'll send a reset code to your WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {!codeSent ? (
          <>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel" // Use type="tel" for phone numbers
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg focus:border-purple-500 focus:ring-purple-500"
                disabled={isCurrentlyLoading}
                onKeyDown={(e) => e.key === "Enter" && handleSendResetCode()}
              />
            </div>

            <Button
              onClick={handleSendResetCode}
              disabled={!phoneNumber.trim() || isCurrentlyLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
            >
              {isCurrentlyLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </>
        ) : (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center text-green-700">
            <p className="font-medium">
              A password reset code has been sent to{" "}
              <span className="font-semibold">{phoneNumber}</span> on WhatsApp.
              Please check your messages.
            </p>
          </div>
        )}

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => {
              setStep("password"); // Go back to the password login step
              setStatus("idle");
              setStatusMessage("");
            }}
            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
