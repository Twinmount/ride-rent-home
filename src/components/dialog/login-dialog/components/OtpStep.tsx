import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2 } from "lucide-react";

export const OtpStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setDrawerState,
  drawerState,
  isCurrentlyLoading,
  verifyOTP,
  resendOTP,
  clearError,
}: any) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
      setTimeout(() => handleVerifyOTP(newOtp.join("")), 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 4) return;

    setStatus("loading");
    setStatusMessage("Verifying OTP...");
    clearError();

    try {
      const verifyResponse = await verifyOTP(
        drawerState.userId,
        drawerState.otpId,
        code
      );

      if (verifyResponse.success) {
        setDrawerState((prev: any) => ({
          ...prev,
          tempToken: verifyResponse.tempToken,
        }));
        setStep("register");
        setStatus("success");
        setStatusMessage("Phone verified! Complete your profile to continue.");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
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
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold">Verify Your Phone</h3>
        <p className="text-balance text-muted-foreground">
          Enter the 4-digit code sent to{" "}
          <span className="font-medium text-foreground">
            {drawerState.phoneNumber}
          </span>
        </p>
      </div>

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
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="h-14 w-14 border-2 text-center text-2xl font-bold focus:border-orange-500 focus:ring-orange-500"
              disabled={isCurrentlyLoading}
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
              disabled={isCurrentlyLoading}
              className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              Resend OTP
            </Button>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setStep("phone");
          setOtp(["", "", "", ""]);
          setStatus("idle");
          setStatusMessage("");
        }}
        className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
      >
        Change Phone Number
      </Button>
    </div>
  );
};
