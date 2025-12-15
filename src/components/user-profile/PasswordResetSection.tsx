"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthContext } from "@/auth";
import { OtpType } from "@/types/auth.types";
import { maskPhoneNumber } from "@/utils/helper";

interface PasswordResetSectionProps {
  phoneNumber: string | null | undefined;
  countryCode: string | null | undefined;
  userProfileData: any;
  isOAuthUser?: boolean;
  isPasswordSet?: boolean;
}

export const PasswordResetSection: React.FC<PasswordResetSectionProps> = ({
  phoneNumber,
  countryCode,
  userProfileData,
  isOAuthUser = false,
  isPasswordSet = false,
}) => {
  const {
    forgotPassword,
    verifyOTP,
    setPassword,
    setupOAuthPassword,
    resendOTP,
    forgotPasswordMutation,
    setPasswordMutation,
    setupOAuthPasswordMutation,
    userAuthStep,
  } = useAuthContext();

  // Determine if this is an OAuth user without password (should show set password UI)
  const isOAuthUserWithoutPassword = isOAuthUser && !isPasswordSet;

  console.log("userProfileData: [PasswordResetSection]", userProfileData);

  const [showOtpSection, setShowOtpSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tempToken, setTempToken] = useState("");

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
    if (forgotPasswordMutation.isSuccess) {
      forgotPasswordMutation.reset();
      setShowOtpSection(true);
      setResendTimer(30);
      setError("");
    }
  }, [forgotPasswordMutation.isSuccess]);

  useEffect(() => {
    if (showOtpSection && resendTimer > 0) {
      otpTimeoutRef.current = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
      return () => {
        if (otpTimeoutRef.current) clearTimeout(otpTimeoutRef.current);
      };
    }
    return undefined;
  }, [showOtpSection, resendTimer]);

  const handleInitiateReset = async () => {
    if (!phoneNumber || !countryCode) {
      setError("Phone number is required for password reset");
      return;
    }

    setError("");
    setSuccess(false);

    try {
      await forgotPassword({
        phoneNumber,
        countryCode,
      });
    } catch (error: any) {
      setError(
        error?.message || "Failed to send reset code. Please try again."
      );
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 4) return;

    setError("");

    try {
      const verifyResponse = await verifyOTP({
        otp: code,
        userId: userAuthStep.userId,
        otpId: userAuthStep.otpId,
        otpType: OtpType.PASSWORD_CHANGE,
        countryCode: countryCode || "",
        phoneNumber: phoneNumber || "",
      });

      if (verifyResponse.success && verifyResponse.tempToken) {
        if (otpTimeoutRef.current) {
          clearTimeout(otpTimeoutRef.current);
          otpTimeoutRef.current = null;
        }

        setTempToken(verifyResponse.tempToken);
        setShowPasswordSection(true);
        setError("");
      }
    } catch (error: any) {
      setError(error?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
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

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
      setTimeout(() => {
        handleVerifyOTP(newOtp.join(""));
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

  const handleResendOtp = async () => {
    if (!phoneNumber || !countryCode) return;

    setError("");

    try {
      const resendResponse = await resendOTP(phoneNumber, countryCode);
      if (resendResponse.success) {
        setResendTimer(30);
        setOtp(["", "", "", ""]);
        otpRefs.current[0]?.focus();
        setError("");
      }
    } catch (error: any) {
      setError(error?.message || "Failed to resend OTP.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // For OAuth users, no tempToken is needed
    if (!isOAuthUserWithoutPassword && !tempToken) {
      setError("Session expired. Please start over.");
      return;
    }

    setError("");

    try {
      if (isOAuthUserWithoutPassword) {
        // Use setupOAuthPassword for OAuth users
        await setupOAuthPassword({
          password: newPassword,
          confirmPassword,
        });
      } else {
        // Use regular setPassword for password reset flow
        await setPassword({
          tempToken,
          password: newPassword,
          confirmPassword,
        });
      }

      setSuccess(true);
      setShowPasswordSection(false);
      setShowOtpSection(false);
      setOtp(["", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setTempToken("");

      // Reset after showing success message
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      setError(
        error?.message ||
          (isOAuthUserWithoutPassword
            ? "Failed to set password. Please try again."
            : "Failed to reset password. Please try again.")
      );
    }
  };

  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      await setupOAuthPassword({
        password: newPassword,
        confirmPassword,
      });

      setSuccess(true);
      setShowPasswordSection(false);
      setNewPassword("");
      setConfirmPassword("");

      // Reset after showing success message
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      setError(error?.message || "Failed to set password. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowOtpSection(false);
    setShowPasswordSection(false);
    setOtp(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    setTempToken("");
    setResendTimer(0);
    forgotPasswordMutation.reset();
  };

  // if (!phoneNumber || !countryCode) {
  //   return null;
  // }

  // If OAuth user without password, show a CTA first and reveal form on tap/click
  if (isOAuthUserWithoutPassword) {
    return (
      <div className="space-y-4 border-t pt-4">
        <div className="space-y-1">
          <h4 className="flex items-center gap-2 text-base font-medium text-gray-900 lg:text-lg">
            <Lock className="h-4 w-4 text-gray-500" />
            Set Password
          </h4>
          <p className="text-sm text-gray-500">
            Set a password for your account to enable credential-based login.
          </p>
        </div>

        {success && (
          <div className="flex flex-col gap-2 rounded-lg bg-green-50 p-3 text-green-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Password set successfully!
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setSuccess(false)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!showPasswordSection ? (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-3 shadow-sm sm:p-4">
            <div className="space-y-1">
              <h5 className="text-base font-medium text-gray-900 sm:text-lg">
                Create your password
              </h5>
              <p className="text-sm text-gray-600">
                Add a password to sign in. You can also continue using your
                OAuth provider.
              </p>
            </div>
            <Button
              className="w-full bg-green-500 text-white hover:bg-green-600"
              onClick={() => setShowPasswordSection(true)}
            >
              Set Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <div className="space-y-2 text-center">
              <h4 className="font-medium text-gray-900">Set Your Password</h4>
              <p className="text-sm text-gray-600">
                Create a strong password for your account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={setupOAuthPasswordMutation.isPending}
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
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={setupOAuthPasswordMutation.isPending}
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                onClick={handleSetPassword}
                disabled={
                  setupOAuthPasswordMutation.isPending ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className="w-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 sm:w-auto"
              >
                {setupOAuthPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting...
                  </>
                ) : (
                  "Set Password"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setShowPasswordSection(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="space-y-1">
        <h4 className="flex items-center gap-2 text-base font-medium text-gray-900 lg:text-lg">
          <Lock className="h-4 w-4 text-gray-500" />
          Password Reset
        </h4>
        <p className="text-sm text-gray-500">
          Change your account password for enhanced security.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            Password reset successfully!
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!showOtpSection && !showPasswordSection ? (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex-1 space-y-1">
              <Label className="font-medium text-orange-700">
                Reset Password
              </Label>
              <p className="text-xs text-orange-600 sm:text-sm">
                A reset code will be sent to{" "}
                <span className="font-medium">
                  {countryCode || ""}{" "}
                  {phoneNumber ? maskPhoneNumber(phoneNumber) : ""}
                </span>
              </p>
            </div>
            <Button
              onClick={handleInitiateReset}
              disabled={forgotPasswordMutation.isPending}
              className="w-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </div>
        </div>
      ) : showPasswordSection ? (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
          <div className="space-y-2 text-center">
            <h4 className="font-medium text-gray-900">Set New Password</h4>
            <p className="text-sm text-gray-600">
              Create a strong password for your account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={setPasswordMutation.isPending}
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
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={setPasswordMutation.isPending}
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

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleResetPassword}
              disabled={
                (isOAuthUserWithoutPassword
                  ? setupOAuthPasswordMutation.isPending
                  : setPasswordMutation.isPending) ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="flex-1 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
            >
              {isOAuthUserWithoutPassword ? (
                setupOAuthPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting...
                  </>
                ) : (
                  "Set Password"
                )
              ) : setPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
          <div className="space-y-2 text-center">
            <h4 className="font-medium text-gray-900">Verify Reset Code</h4>
            <p className="text-sm text-gray-600">
              Enter the 4-digit code sent to{" "}
              <span className="font-medium">
                {countryCode || ""}{" "}
                {phoneNumber ? maskPhoneNumber(phoneNumber) : ""}
              </span>
            </p>
          </div>

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
              <p className="text-sm text-gray-600">
                Resend code in {resendTimer}s
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                Resend OTP
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => handleVerifyOTP()}
              disabled={otp.join("").length !== 4}
              className="flex-1 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
            >
              Verify OTP
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
