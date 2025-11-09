import React, { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import { Smartphone, Loader2, Eye, EyeOff } from "lucide-react"; // Changed icon to Smartphone

const MemoizedPhoneInput = memo(
  ({
    defaultCountry,
    value,
    onChange,
  }: {
    defaultCountry: string;
    value: string;
    onChange?: (value: any, country: any) => void;
  }) => {
    return (
      <PhoneInput
        disabled
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        className="flex items-center justify-center"
        inputClassName="hidden"
        countrySelectorStyleProps={{
          className:
            "bg-transparent !text-xs !p-0 !bg-transparent !shadow-none",
          style: {
            padding: 0,
            backgroundColor: "transparent",
            background: "transparent",
            boxShadow: "none",
          },
          buttonClassName:
            "!border-none outline-none !h-full !w-full !rounded-none bg-transparent !p-0 !bg-transparent !shadow-none",
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if country or value actually changed
    return (
      prevProps.defaultCountry === nextProps.defaultCountry &&
      prevProps.value === nextProps.value
    );
  }
);

export const ForgotPasswordStep = ({
  currentStep,
  setStep,
  setStatus,
  setStatusMessage,
  drawerState,
  isCurrentlyLoading,
  sendPasswordResetCodeViaWhatsApp,
  mutationSatate, // New prop for sending code
  clearError,
}: any) => {
  const [phoneNumber, setPhoneNumber] = useState(drawerState.phoneNumber || ""); // Pre-fill if phone number is available
  const [codeSent, setCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  console.log("mutationSatate: ", mutationSatate);
  console.log("currentStep: ", currentStep);

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

      console.log("resetResponse: ", resetResponse);

      if (mutationSatate.isSuccess) {
        setStep("new-password");
        setStatusMessage("Password reset code sent!");
        // Optionally, you might want to automatically advance to a 'VerifyResetCodeStep' here
        // setStep("verifyResetCode");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage("Failed to send reset code. Please try again.");
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
        {currentStep === "forgot-password" ? (
          <>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </label>
              <div className="relative z-10 flex gap-2">
                <div className="flex h-10 w-20 flex-shrink-0 items-center justify-center rounded-lg border-2 bg-transparent backdrop-blur-sm transition-all">
                  <MemoizedPhoneInput
                    defaultCountry={drawerState.countryCode}
                    value={drawerState.countryCode}
                  />

                  <span className="mx-0.5 text-xs font-semibold">
                    {drawerState.countryCode}
                  </span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  disabled
                  placeholder="enter phone number"
                  value={phoneNumber}
                  // onChange={onHandlePhoneNumberChange}
                  className="h-10 w-full flex-1 rounded-lg border-2 bg-transparent px-3 text-sm outline-none backdrop-blur-sm transition-all placeholder:text-black/40"
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>
            </div>

            <Button
              onClick={handleSendResetCode}
              disabled={mutationSatate.isLoading || !phoneNumber.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
            >
              {mutationSatate.isLoading ? (
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
          currentStep === "new-password" && (
            <div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  Create Password *
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isCurrentlyLoading}
                    className="pr-10 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isCurrentlyLoading}
                    className="pr-10 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )
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
