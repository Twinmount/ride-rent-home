import React, { useState, memo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import { Smartphone, Loader2, Eye, EyeOff } from "lucide-react"; // Changed icon to Smartphone
import { ForgotPasswordStepProps } from "./component-type";
import { OtpType } from "@/types/auth.types";

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
  resendOTP,
  setStep,
  setStatus,
  setStatusMessage,
  drawerState,
  isCurrentlyLoading,
  sendPasswordResetCodeViaWhatsApp,
  mutationSatate,
  clearError,
  setDrawerState,
  verifyOTP,
  userAuthStep,
}: ForgotPasswordStepProps) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState(drawerState.phoneNumber || "");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ishowOtpSection, setIshowOtpSection] = useState(false);
  const [ishowPasswordSection, setIshowPasswordSection] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  console.log("resendTimer: ", resendTimer);
  console.log("isCurrentlyLoading: ", isCurrentlyLoading);
  console.log("userAuthStep: ", userAuthStep);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (otpTimeoutRef.current) {
        clearTimeout(otpTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mutationSatate?.isSuccess) {
      mutationSatate.reset();
      setIshowOtpSection(true);
      setStatusMessage("Password reset code sent!");
    }
  }, [mutationSatate]);

  useEffect(() => {
    if (ishowOtpSection && resendTimer > 0) {
      otpTimeoutRef.current = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
      return () => clearTimeout(otpTimeoutRef.current!);
    }
    return undefined;
  }, [ishowOtpSection, resendTimer]); // Also added resendTimer to dependencies

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 4) return;

    setStatus("loading");
    setStatusMessage("Verifying OTP...");
    clearError();

    try {
      const verifyResponse = await verifyOTP({
        otp: code,
        userId: userAuthStep.userId,
        otpId: userAuthStep.otpId,
        otpType: OtpType.PASSWORD_CHANGE,
        countryCode: drawerState.countryCode,
        phoneNumber: drawerState.phoneNumber,
      });
      //  userAuthStep.userId,
      //   drawerState.otpId || userAuthStep.otpId,
      //   code

      if (verifyResponse.success) {
        if (otpTimeoutRef.current) {
          clearTimeout(otpTimeoutRef.current);
          otpTimeoutRef.current = null;
        }

        setIshowPasswordSection(true);
        setDrawerState((prev: any) => ({
          ...prev,
          tempToken: verifyResponse.tempToken,
        }));
        setStatusMessage("Phone verified! Complete your profile to continue.");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  const handleSendResetCode = async () => {
    if (!phoneNumber.trim()) return;
    setStatus("loading");
    setStatusMessage("Sending reset code via WhatsApp...");
    clearError();

    try {
      // Replace with your actual API call to send password reset code via WhatsApp
      await sendPasswordResetCodeViaWhatsApp({
        phoneNumber,
        countryCode: drawerState.countryCode,
      });
    } catch (error: any) {
      setStatus("error");
      setStatusMessage("Failed to send reset code. Please try again.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // ✅ Clear any existing timeout before setting a new one
    // if (otpTimeoutRef.current) clearTimeout(otpTimeoutRef.current);

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
      otpTimeoutRef.current = setTimeout(() => {
        handleVerifyOTP(newOtp.join(""));
        otpTimeoutRef.current = null; // cleanup after run
      }, 100);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[3]?.focus();

      // ✅ Clear existing timeout before setting new one
      // if (otpTimeoutRef.current) clearTimeout(otpTimeoutRef.current);

      otpTimeoutRef.current = setTimeout(() => {
        handleVerifyOTP(pastedData);
        otpTimeoutRef.current = null;
      }, 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setStatus("loading");
    setStatusMessage("Resending OTP...");
    clearError();

    try {
      const resendResponse = await resendOTP(
        drawerState.phoneNumber,
        drawerState.countryCode
      );
      if (resendResponse.success && resendResponse.data) {
        setDrawerState((prev: any) => ({
          ...prev,
          otpId: resendResponse.data.otpId,
        }));
        setStatus("success");
        setStatusMessage("OTP resent successfully!");
        setResendTimer(30);
        setOtp(["", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <Smartphone className="h-8 w-8 text-orange-600" />{" "}
          {/* Updated icon */}
        </div>
        {!ishowPasswordSection && !ishowOtpSection ? (
          <div>
            <h3 className="text-xl font-semibold">Forgot Your Password?</h3>
            <p className="text-balance text-muted-foreground">
              No worries, we&apos;ll send a reset code to your WhatsApp.
            </p>
          </div>
        ) : (
          ishowOtpSection && (
            <p className="text-balance text-muted-foreground">
              Enter the 4-digit code sent to{" "}
              <span className="font-medium text-foreground">
                {`${drawerState.countryCode} ${drawerState.phoneNumber}`}
              </span>
            </p>
          )
        )}
      </div>
      {/* mobile number & send code */}
      <div className="space-y-4">
        {!ishowPasswordSection && !ishowOtpSection ? (
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
        ) : ishowPasswordSection ? (
          // new password section
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
              <label htmlFor="confirmPassword" className="text-sm font-medium">
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
          </div>
        ) : (
          ishowOtpSection && (
            // otp section for verifying code
            <div>
              <div className="space-y-4">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onPaste={handleOtpPaste}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-14 w-14 border-2 text-center text-2xl font-bold focus:border-orange-500 focus:ring-orange-500"
                    />
                  ))}
                </div>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {resendTimer}s
                    </p>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleResend}
                      className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    >
                      Resend OTP
                    </Button>
                  )}
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
