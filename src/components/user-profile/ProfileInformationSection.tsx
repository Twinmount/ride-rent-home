"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Phone,
  Mail,
  Edit2,
  X,
  Calendar,
  Activity,
  CheckCircle,
} from "lucide-react";
import { trimName } from "@/helpers";

interface ProfileData {
  name: string;
  email: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  joinedAt?: string;
}

interface ProfileInformationSectionProps {
  profileData: ProfileData | null;
  userId: string | undefined;
  userProfileQuery: {
    isLoading: boolean;
    refetch: () => Promise<any>;
  };
  updateProfile: (userId: string, data: { name: string }) => Promise<any>;
  requestPhoneNumberChange: (
    phoneNumber: string,
    countryCode: string
  ) => Promise<any>;
  verifyPhoneNumberChange: (
    otpId: string,
    otp: string,
    phoneNumber: string,
    countryCode: string
  ) => Promise<any>;
  requestEmailChange: (email: string) => Promise<any>;
  verifyEmailChange: (
    otpId: string,
    otp: string,
    email: string
  ) => Promise<any>;
  updateProfileMutation: {
    isPending: boolean;
  };
  requestPhoneChangeMutation: {
    isPending: boolean;
  };
  verifyPhoneChangeMutation: {
    isPending: boolean;
  };
  requestEmailChangeMutation: {
    isPending: boolean;
  };
  verifyEmailChangeMutation: {
    isPending: boolean;
  };
  verifyOtpMutation: {
    isPending: boolean;
  };
  resendOtpMutation: {
    isPending: boolean;
  };
  formatMemberSince: (date: string) => string;
  setProfileData: (updater: (draft: ProfileData | null) => void) => void;
  setShowSuccessToast: (show: boolean) => void;
}

export const ProfileInformationSection: React.FC<
  ProfileInformationSectionProps
> = ({
  profileData,
  userId,
  userProfileQuery,
  updateProfile,
  requestPhoneNumberChange,
  verifyPhoneNumberChange,
  requestEmailChange,
  verifyEmailChange,
  updateProfileMutation,
  requestPhoneChangeMutation,
  verifyPhoneChangeMutation,
  requestEmailChangeMutation,
  verifyEmailChangeMutation,
  verifyOtpMutation,
  resendOtpMutation,
  formatMemberSince,
  setProfileData,
  setShowSuccessToast,
}) => {
  console.log("profileData[ProfileInformationSection]", profileData);
  // Editing states
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempCountryCode, setTempCountryCode] = useState("");
  const [tempMobileNumber, setTempMobileNumber] = useState("");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // OTP states
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [mobileOtpId, setMobileOtpId] = useState("");
  const [emailOtpId, setEmailOtpId] = useState("");

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [otpCountdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEditName = () => {
    setTempName(profileData?.name || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      await updateProfile(userId!, {
        name: tempName,
      });

      setProfileData((draft) => {
        if (draft) {
          draft.name = tempName;
        }
      });
      setIsEditingName(false);

      await userProfileQuery.refetch();

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  const handleCancelName = () => {
    setIsEditingName(false);
  };

  const handleEditMobile = () => {
    if (profileData) {
      setTempCountryCode(profileData.countryCode || "+971");
      setTempMobileNumber(profileData.phoneNumber || "");
    }
    setIsEditingMobile(true);
  };

  const handleSaveMobile = async () => {
    try {
      const response = await requestPhoneNumberChange(
        tempMobileNumber,
        tempCountryCode
      );

      if (response.success && response.data?.otpId) {
        setMobileOtpId(response.data.otpId);
        setShowMobileOtp(true);
        setOtpCountdown(300);
        setOtpError("");
        setMobileOtp("");
      } else {
        throw new Error(
          response.message || "Failed to request phone number change"
        );
      }
    } catch (error: any) {
      console.error("Failed to request mobile number change:", error);
      setOtpError(error.message || "Failed to request phone number change");
    }
  };

  const handleCancelMobile = () => {
    setIsEditingMobile(false);
    setShowMobileOtp(false);
    setMobileOtp("");
    setMobileOtpId("");
    setOtpError("");
    setOtpCountdown(0);
  };

  const handleEditEmail = () => {
    setTempEmail(profileData?.email || "");
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      const response = await requestEmailChange(tempEmail);

      if (response.success && response.data?.otpId) {
        setEmailOtpId(response.data.otpId);
        setShowEmailOtp(true);
        setOtpCountdown(300);
        setOtpError("");
        setEmailOtp("");
      } else {
        throw new Error(
          response.message || "Failed to request email address change"
        );
      }
    } catch (error: any) {
      console.error("Failed to request email address change:", error);
      setOtpError(error.message || "Failed to request email address change");
    }
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setShowEmailOtp(false);
    setEmailOtp("");
    setOtpError("");
    setOtpCountdown(0);
  };

  const handleVerifyMobileOtp = async () => {
    try {
      setOtpError("");

      if (!mobileOtpId) {
        throw new Error("OTP ID not found. Please try again.");
      }

      const response = await verifyPhoneNumberChange(
        mobileOtpId,
        mobileOtp,
        tempMobileNumber,
        tempCountryCode
      );

      if (response.success) {
        setProfileData((draft) => {
          if (draft) {
            draft.countryCode = tempCountryCode;
            draft.phoneNumber = tempMobileNumber;
            draft.isPhoneVerified = true;
          }
        });

        setIsEditingMobile(false);
        setShowMobileOtp(false);
        setMobileOtp("");
        setMobileOtpId("");
        setOtpCountdown(0);

        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 4000);

        await userProfileQuery.refetch();
      } else {
        throw new Error(
          response.message || "Failed to verify phone number change"
        );
      }
    } catch (error: any) {
      setOtpError(error.message || "Invalid OTP. Please try again.");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      setOtpError("");

      if (!emailOtpId) {
        throw new Error("OTP ID not found. Please try again.");
      }

      const response = await verifyEmailChange(emailOtpId, emailOtp, tempEmail);

      if (response.success) {
        setProfileData((draft) => {
          if (draft) {
            draft.email = tempEmail;
            draft.isEmailVerified = true;
          }
        });

        setIsEditingEmail(false);
        setShowEmailOtp(false);
        setEmailOtp("");
        setEmailOtpId("");
        setOtpCountdown(0);

        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 4000);

        await userProfileQuery.refetch();
      } else {
        throw new Error(
          response.message || "Failed to verify email address change"
        );
      }
    } catch (error: any) {
      setOtpError(error.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async (type: "mobile" | "email") => {
    try {
      setOtpError("");
      if (type === "mobile") {
        const response = await requestPhoneNumberChange(
          tempMobileNumber,
          tempCountryCode
        );

        if (response.success && response.data?.otpId) {
          setMobileOtpId(response.data.otpId);
          setMobileOtp("");
        } else {
          throw new Error(
            response.message || "Failed to resend OTP for phone change"
          );
        }
      } else {
        const response = await requestEmailChange(tempEmail);

        if (response.success && response.data?.otpId) {
          setEmailOtpId(response.data.otpId);
          setEmailOtp("");
        } else {
          throw new Error(
            response.message || "Failed to resend OTP for email change"
          );
        }
      }
      setOtpCountdown(300);
    } catch (error: any) {
      setOtpError(error.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:flex-row sm:items-center sm:gap-4 sm:rounded-xl sm:p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-6">
        <AvatarUpload
          currentAvatar={profileData?.avatar}
          userName={profileData?.name || "User"}
          userId={userId}
          size="lg"
          onUploadSuccess={async (avatarUrl) => {
            try {
              setProfileData((draft) => {
                if (draft) {
                  draft.avatar = avatarUrl;
                }
              });

              await userProfileQuery.refetch();

              setShowSuccessToast(true);
              setTimeout(() => {
                setShowSuccessToast(false);
              }, 4000);
            } catch (error) {
              console.error(
                "Failed to refetch profile after avatar upload:",
                error
              );
            }
          }}
          onUploadError={(error) => {
            console.error("Avatar upload failed:", error);
          }}
        />
        <div className="w-full flex-1 text-center sm:text-left">
          {!isEditingName ? (
            <div className="mb-2 flex flex-col items-center gap-2 sm:mb-1 sm:flex-row sm:items-start">
              <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
                {trimName(profileData?.name || "") || "User"}
                {userProfileQuery.isLoading && (
                  <span className="ml-1.5 text-xs text-gray-500 sm:ml-2 sm:text-sm">
                    (Loading...)
                  </span>
                )}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditName}
                className="h-8 w-8 shrink-0 cursor-pointer p-1 text-orange-600 hover:bg-orange-50 hover:text-orange-700 sm:h-auto sm:w-auto sm:px-2 sm:py-1.5 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2"
                disabled={userProfileQuery.isLoading}
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          ) : (
            <div className="mb-2 w-full space-y-2.5 sm:mb-1 sm:space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 text-sm font-bold sm:text-base md:text-lg lg:text-xl"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  disabled={!tempName.trim() || updateProfileMutation.isPending}
                  className="h-9 cursor-pointer bg-orange-500 px-3 py-1.5 text-xs text-white hover:bg-orange-600 disabled:opacity-50 sm:h-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                >
                  <Check className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelName}
                  className="h-9 cursor-pointer bg-transparent px-3 py-1.5 text-xs sm:h-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                >
                  <X className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 sm:mb-3 sm:justify-start sm:gap-2 md:gap-3">
            {profileData?.isPhoneVerified && (
              <Badge
                variant="outline"
                className="border-green-200 text-[10px] text-green-600 sm:text-xs md:text-sm"
              >
                <Phone className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Phone Verified</span>
                <span className="sm:hidden">Phone</span>
              </Badge>
            )}
            {profileData?.isEmailVerified && (
              <Badge
                variant="outline"
                className="border-blue-200 text-[10px] text-blue-600 sm:text-xs md:text-sm"
              >
                <Mail className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Email Verified</span>
                <span className="sm:hidden">Email</span>
              </Badge>
            )}
            <Badge
              variant="outline"
              className="border-green-200 text-[10px] text-green-600 sm:text-xs md:text-sm"
            >
              <Activity className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600 sm:justify-start sm:gap-2 sm:text-xs md:gap-4 md:text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
              {formatMemberSince(profileData?.joinedAt || "")}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
            <Phone className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
            Mobile Number
          </Label>
          {!isEditingMobile ? (
            <div
              className={`flex flex-col gap-2 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3 ${
                !profileData?.phoneNumber
                  ? "border-orange-200 bg-orange-50"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                {!profileData?.phoneNumber ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="rounded-full bg-orange-100 p-0.5 sm:p-1">
                      <Phone className="h-2.5 w-2.5 text-orange-600 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs font-medium text-orange-700 sm:text-sm md:text-base">
                      Add your phone number
                    </span>
                  </div>
                ) : (
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="break-all text-xs text-gray-900 sm:text-sm">
                      {`${profileData?.countryCode || ""} ${profileData?.phoneNumber || ""}`}
                    </span>
                    {profileData?.isPhoneVerified && (
                      <Badge className="shrink-0 bg-green-100 text-[10px] text-green-800 hover:bg-green-100 sm:text-xs">
                        <CheckCircle className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditMobile}
                className={`h-8 w-full cursor-pointer px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5 ${
                  !profileData?.phoneNumber
                    ? "text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                    : "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {!profileData?.phoneNumber ? (
                  <>
                    <Phone className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Add Phone
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Change
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg border bg-blue-50 p-2.5 sm:p-3 md:p-4">
              {!showMobileOtp ? (
                <>
                  <div className="space-y-2 sm:space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                      <Select
                        value={tempCountryCode}
                        onValueChange={setTempCountryCode}
                      >
                        <SelectTrigger className="h-9 w-full cursor-pointer text-xs sm:h-10 sm:w-32 sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+971">🇦🇪 +971</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                          <SelectItem value="+966">🇸🇦 +966</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={tempMobileNumber}
                        onChange={(e) => setTempMobileNumber(e.target.value)}
                        placeholder={
                          !profileData?.phoneNumber
                            ? "Enter your phone number"
                            : "Enter mobile number"
                        }
                        className="h-9 flex-1 text-xs sm:h-10 sm:text-sm"
                      />
                    </div>

                    {!profileData?.phoneNumber && (
                      <p className="text-[10px] leading-relaxed text-blue-600 sm:text-xs md:text-sm">
                        Adding a phone number will help you receive important
                        notifications and secure your account. Add your phone
                        number to get important updates on your booking.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveMobile}
                      disabled={
                        !tempMobileNumber.trim() ||
                        requestPhoneChangeMutation.isPending
                      }
                      className="h-9 w-full cursor-pointer bg-orange-500 px-3 py-1.5 text-xs text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <Check className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {requestPhoneChangeMutation.isPending
                        ? "Sending..."
                        : !profileData?.phoneNumber
                          ? "Add Phone & Send OTP"
                          : "Save & Send OTP"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelMobile}
                      className="h-9 w-full cursor-pointer bg-transparent px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <X className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5 text-center sm:space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 sm:text-base">
                      Verify Mobile Number
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Enter the 4-digit code sent to{" "}
                      <span className="break-all font-medium">
                        {tempCountryCode} {tempMobileNumber}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: 4 }, (_, index) => (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={mobileOtp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newOtp = mobileOtp.split("");
                          newOtp[index] = value;
                          setMobileOtp(newOtp.join(""));

                          if (value && index < 3) {
                            const nextInput = e.target.parentElement?.children[
                              index + 1
                            ] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }}
                        className="h-11 w-11 text-center text-base font-bold sm:h-12 sm:w-12 sm:text-lg md:h-14 md:w-14"
                        disabled={verifyPhoneChangeMutation.isPending}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="text-center text-xs text-red-600 sm:text-sm">
                      {otpError}
                    </div>
                  )}

                  <div className="text-center text-xs text-gray-600 sm:text-sm">
                    {otpCountdown > 0 ? (
                      <span>Resend OTP in {formatTime(otpCountdown)}</span>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleResendOtp("mobile")}
                        disabled={requestPhoneChangeMutation.isPending}
                        className="h-auto px-2 py-1 text-xs text-orange-600 sm:px-3 sm:py-1.5 sm:text-sm md:px-3 md:py-1.5 lg:px-4 lg:py-2"
                      >
                        {requestPhoneChangeMutation.isPending
                          ? "Sending..."
                          : "Resend OTP"}
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                      size="sm"
                      onClick={handleVerifyMobileOtp}
                      disabled={
                        mobileOtp.length !== 4 ||
                        verifyPhoneChangeMutation.isPending
                      }
                      className="h-9 w-full cursor-pointer bg-green-500 px-3 py-1.5 text-xs text-white hover:bg-green-600 disabled:opacity-50 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      {verifyPhoneChangeMutation.isPending
                        ? "Verifying..."
                        : "Verify OTP"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelMobile}
                      className="h-9 w-full cursor-pointer bg-transparent px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <X className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
            <Mail className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
            Email Address
          </Label>
          {!isEditingEmail ? (
            <div
              className={`flex flex-col gap-2 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3 ${
                !profileData?.email
                  ? "border-orange-200 bg-orange-50"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                {!profileData?.email ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="rounded-full bg-orange-100 p-0.5 sm:p-1">
                      <Mail className="h-2.5 w-2.5 text-orange-600 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs font-medium text-orange-700 sm:text-sm md:text-base">
                      Add your email address
                    </span>
                  </div>
                ) : (
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="break-all text-xs text-gray-900 sm:text-sm">
                      {userProfileQuery.isLoading
                        ? "Loading..."
                        : profileData.email}
                    </span>
                    {profileData?.isEmailVerified && (
                      <Badge className="shrink-0 bg-green-100 text-[10px] text-green-800 hover:bg-green-100 sm:text-xs">
                        <CheckCircle className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditEmail}
                className={`h-8 w-full cursor-pointer px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5 ${
                  !profileData?.email
                    ? "text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                    : "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                }`}
                disabled={userProfileQuery.isLoading}
              >
                {!profileData?.email ? (
                  <>
                    <Mail className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Add Email
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Change
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg border bg-blue-50 p-2.5 sm:p-3 md:p-4">
              {!showEmailOtp ? (
                <>
                  <div className="space-y-2 sm:space-y-2">
                    <Input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      placeholder={
                        !profileData?.email
                          ? "Enter your email address"
                          : "Update email address"
                      }
                      className="h-9 w-full text-xs sm:h-10 sm:text-sm"
                    />
                    {!profileData?.email && (
                      <p className="text-[10px] leading-relaxed text-blue-600 sm:text-xs md:text-sm">
                        Adding an email will help you receive important
                        notifications and recover your account. Add your email
                        to get important updates on your booking.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveEmail}
                      disabled={
                        !tempEmail.trim() ||
                        !tempEmail.includes("@") ||
                        requestEmailChangeMutation.isPending
                      }
                      className="h-9 w-full cursor-pointer bg-orange-500 px-3 py-1.5 text-xs text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <Check className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {requestEmailChangeMutation.isPending
                        ? "Sending..."
                        : !profileData?.email
                          ? "Add Email & Send OTP"
                          : "Save & Send OTP"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEmail}
                      className="h-9 w-full cursor-pointer bg-transparent px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <X className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5 text-center sm:space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 sm:text-base">
                      Verify Email Address
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Enter the 4-digit code sent to{" "}
                      <span className="break-all font-medium">{tempEmail}</span>
                    </p>
                  </div>
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: 4 }, (_, index) => (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={emailOtp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newOtp = emailOtp.split("");
                          newOtp[index] = value;
                          setEmailOtp(newOtp.join(""));

                          if (value && index < 3) {
                            const nextInput = e.target.parentElement?.children[
                              index + 1
                            ] as HTMLInputElement;
                            nextInput?.focus();
                          }
                        }}
                        className="h-11 w-11 text-center text-base font-bold sm:h-12 sm:w-12 sm:text-lg md:h-14 md:w-14"
                        disabled={verifyEmailChangeMutation.isPending}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="text-center text-xs text-red-600 sm:text-sm">
                      {otpError}
                    </div>
                  )}

                  <div className="text-center text-xs text-gray-600 sm:text-sm">
                    {otpCountdown > 0 ? (
                      <span>Resend OTP in {formatTime(otpCountdown)}</span>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleResendOtp("email")}
                        disabled={requestEmailChangeMutation.isPending}
                        className="h-auto px-2 py-1 text-xs text-orange-600 sm:px-3 sm:py-1.5 sm:text-sm md:px-3 md:py-1.5 lg:px-4 lg:py-2"
                      >
                        {requestEmailChangeMutation.isPending
                          ? "Sending..."
                          : "Resend OTP"}
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                      size="sm"
                      onClick={handleVerifyEmailOtp}
                      disabled={
                        emailOtp.length !== 4 ||
                        verifyEmailChangeMutation.isPending
                      }
                      className="h-9 w-full cursor-pointer bg-green-500 px-3 py-1.5 text-xs text-white hover:bg-green-600 disabled:opacity-50 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      {verifyEmailChangeMutation.isPending
                        ? "Verifying..."
                        : "Verify OTP"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEmail}
                      className="h-9 w-full cursor-pointer bg-transparent px-3 py-1.5 text-xs sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 lg:px-5 lg:py-2.5"
                    >
                      <X className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
