/**
 * UserProfile2 Component
 *
 * This component integrates with the phone number change API endpoints:
 * - /change-phone-number: Request phone number change and receive OTP
 * - /verify-phone-change: Verify the OTP to complete phone number change
 *
 * Phone Change Flow:
 * 1. User enters new phone number and clicks "Save & Send OTP"
 * 2. Component calls requestPhoneNumberChange() from useAuth hook
 * 3. OTP is sent to the new phone number, OTP ID is stored locally
 * 4. User enters OTP and clicks "Verify OTP"
 * 5. Component calls verifyPhoneNumberChange() with OTP ID and OTP
 * 6. On success, user's phone number is updated and profile is refreshed
 *
 * Note: Email change functionality is prepared but requires backend implementation
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Camera,
  Check,
  Phone,
  Mail,
  Globe,
  Bell,
  Settings,
  Edit2,
  X,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Star,
  Calendar,
  Activity,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthContext } from "@/auth";
import { ProfileBreadcrumb } from "@/components/user-profile";
import { ProtectedRoute } from "@/components/common";
import { trimName } from "@/helpers";
import { getVehicleImageUrl } from "@/utils/imageUrl";

interface UserProfileProps {
  className?: string;
}

export const UserProfile2 = ({ className }: UserProfileProps) => {
  return (
    <ProtectedRoute showLoginModal={true}>
      <UserProfileContent className={className} />
    </ProtectedRoute>
  );
};

const UserProfileContent = ({ className }: UserProfileProps) => {
  const router = useRouter();
  const [languages, setLanguages] = useState("English, Arabic");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  // Get auth context
  const {
    authStorage,
    formatMemberSince,
    useGetUserProfile,
    updateUserNameAndAvatar,
    updateProfile,
    verifyOTP,
    resendOTP,
    verifyOtpMutation,
    resendOtpMutation,
    requestPhoneNumberChange,
    verifyPhoneNumberChange,
    requestPhoneChangeMutation,
    verifyPhoneChangeMutation,
    userAuthStep,
    auth,
    user,
  } = useAuthContext();

  // Profile data state
  const [profileData, setProfileData] = useImmer<{
    name: string;
    email: string | null;
    avatar: string | null;
    phoneNumber: string | null;
    countryCode: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    joinedAt?: string;
  } | null>(null);

  // Editing states
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempCountryCode, setTempCountryCode] = useState("");
  const [tempMobileNumber, setTempMobileNumber] = useState("");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // Toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // OTP states
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [mobileOtpId, setMobileOtpId] = useState(""); // Add state for mobile OTP ID
  const [emailOtpId, setEmailOtpId] = useState(""); // Add state for email OTP ID

  const userId = authStorage.getUser()?.id.toString();

  // Get user profile data
  const userProfileQuery = useGetUserProfile(userId!, !!userId);

  const {
    userCarActionCountsQuery,
    userRecentActivitiesQuery,
    handleUpdateProfile,
    updateProfileMutation,
    multiCountryConfig,
  } = useUserProfile({
    userId: userId!,
    useMultiCountry: true, // Enable multi-country by default
  });

  useEffect(() => {
    if (!userCarActionCountsQuery.isLoading) {
      const data = userCarActionCountsQuery.data;

      // Log multi-country metadata for debugging
      if (
        multiCountryConfig.isEnabled &&
        multiCountryConfig.metadata.carActionCounts
      ) {
        console.log(
          "Multi-country car action counts metadata:",
          multiCountryConfig.metadata.carActionCounts
        );
      }
    }
  }, [userCarActionCountsQuery.data, multiCountryConfig]);

  useEffect(() => {
    if (userProfileQuery.data?.success && userProfileQuery.data.data) {
      const fetchedProfileData = userProfileQuery.data.data;

      // Update profile data state using useImmer
      setProfileData({
        name: fetchedProfileData.name || "User",
        email: fetchedProfileData.email || null,
        avatar: fetchedProfileData.avatar || null,
        phoneNumber: fetchedProfileData.phoneNumber || null,
        countryCode: fetchedProfileData.countryCode || null,
        isPhoneVerified: fetchedProfileData.isPhoneVerified || false,
        isEmailVerified: fetchedProfileData.isEmailVerified || false,
        joinedAt:
          (fetchedProfileData as any).createdAt ||
          (fetchedProfileData as any).updatedAt ||
          new Date().toISOString(),
      });
    }
  }, [userProfileQuery.data, setProfileData]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [otpCountdown]);

  const handleEditName = () => {
    setTempName(profileData?.name || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      // Use auth context's updateProfile method to update both auth state and API
      await updateProfile(userId!, {
        name: tempName,
      });

      // Update local state
      setProfileData((draft) => {
        if (draft) {
          draft.name = tempName;
        }
      });
      setIsEditingName(false);

      // Refetch user profile to ensure consistency
      await userProfileQuery.refetch();

      // Show success toast
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
      // Use the auth context's phone change method instead of handleUpdateProfile
      const response = await requestPhoneNumberChange(
        tempMobileNumber,
        tempCountryCode
      );

      if (response.success && response.data?.otpId) {
        // Store the OTP ID for verification
        setMobileOtpId(response.data.otpId);

        // Show OTP verification section
        setShowMobileOtp(true);
        setOtpCountdown(300); // 5 minutes
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
      // Use custom handleUpdateProfile for email updates (API only)
      await handleUpdateProfile({
        email: tempEmail,
      });

      // Show OTP verification section
      setShowEmailOtp(true);
      setOtpCountdown(300); // 5 minutes
      setOtpError("");
      setEmailOtp("");
    } catch (error) {
      console.error("Failed to update email:", error);
    }
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setShowEmailOtp(false);
    setEmailOtp("");
    setOtpError("");
    setOtpCountdown(0);
  };

  // OTP verification handlers
  const handleVerifyMobileOtp = async () => {
    try {
      setOtpError("");

      if (!mobileOtpId) {
        throw new Error("OTP ID not found. Please try again.");
      }

      // Use the auth context's verifyPhoneNumberChange method
      const response = await verifyPhoneNumberChange(
        mobileOtpId,
        mobileOtp,
        tempMobileNumber,
        tempCountryCode
      );

      if (response.success) {
        // Update local state
        setProfileData((draft) => {
          if (draft) {
            draft.countryCode = tempCountryCode;
            draft.phoneNumber = tempMobileNumber;
            draft.isPhoneVerified = true;
          }
        });

        // Reset states
        setIsEditingMobile(false);
        setShowMobileOtp(false);
        setMobileOtp("");
        setMobileOtpId("");
        setOtpCountdown(0);

        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 4000);

        // Refetch user profile
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
      // For email OTP, we'll use the general OTP verification
      // Note: You may need to get the otpId from the email update response
      await verifyOTP(userId!, "email-otp-id", emailOtp);

      // Update local state
      setProfileData((draft) => {
        if (draft) {
          draft.email = tempEmail;
          draft.isEmailVerified = true;
        }
      });

      // Reset states
      setIsEditingEmail(false);
      setShowEmailOtp(false);
      setEmailOtp("");
      setOtpCountdown(0);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);

      // Refetch user profile
      await userProfileQuery.refetch();
    } catch (error: any) {
      setOtpError(error.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async (type: "mobile" | "email") => {
    try {
      setOtpError("");
      if (type === "mobile") {
        // For mobile phone number change, resend OTP for the new phone number
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
        // For email, you might need a different resend function
        await resendOTP(tempEmail, ""); // Adjust based on your API
        setEmailOtp("");
      }
      setOtpCountdown(300); // Reset countdown
    } catch (error: any) {
      setOtpError(error.message || "Failed to resend OTP.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveAllChanges = async () => {
    if (!profileData || !userId) return;

    try {
      // Update user profile using the new handle function
      await handleUpdateProfile({
        name: profileData.name,
        email: profileData.email || undefined,
        phoneNumber: profileData.phoneNumber || undefined,
        countryCode: profileData.countryCode || undefined,
      });

      // Refetch the profile data to get the latest
      userProfileQuery.refetch();

      // Show success toast
      setShowSuccessToast(true);
      // Auto hide toast after 4 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const stats = [
    {
      label: "All Enquiries",
      value: userCarActionCountsQuery.data?.enquired || 0,
      trend: "+12%",
      trendUp: true,
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      description: "",
      action: "enquired",
      navigationPath: "/user-profile/enquired-vehicles",
    },
    {
      label: "My Favorites",
      value: userCarActionCountsQuery.data?.saved || 0,
      trend: "+8%",
      trendUp: true,
      icon: Heart,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      description: "",
      action: "saved",
      navigationPath: "/user-profile/saved-vehicles",
    },
    {
      label: "Previously Viewed​",
      value: userCarActionCountsQuery.data?.viewed || 0,
      trend: "+24%",
      trendUp: true,
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      description: "",
      action: "viewed",
      navigationPath: "/user-profile/viewed-vehicles",
    },
  ];

  const achievements = [
    {
      name: "Early Adopter",
      icon: Award,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      name: "Active User",
      icon: Activity,
      color: "text-green-600 bg-green-100",
    },
    { name: "Top Reviewer", icon: Star, color: "text-blue-600 bg-blue-100" },
  ];

  // Transform API data to match the UI format
  const recentActivity =
    userRecentActivitiesQuery.data?.map((activity) => ({
      action: activity.activityDescription,
      time: activity.timeAgo,
      type: activity.activityType.toLowerCase() as "view" | "save" | "enquiry",
      vehicleName: activity.vehicleName,
      vehicleImageUrl: activity.vehicleImageUrl,
      carId: activity.carId,
    })) || [];

  return (
    <>
      <div
        className={`mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 lg:space-y-8 lg:px-8 ${className || ""}`}
      >
        {/* Profile Breadcrumb */}
        <ProfileBreadcrumb
          userName={trimName(profileData?.name || "", 5)}
          className="mt-1 sm:mt-2"
        />

        {/* Profile loading error */}
        {userProfileQuery.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">
              Failed to load profile data: {userProfileQuery.error.message}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => userProfileQuery.refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        <div
          className="relative overflow-hidden rounded-xl p-4 text-white sm:rounded-2xl sm:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl lg:text-4xl">
                {`Hello ${trimName(profileData?.name || "", 15) || "User"}`}
              </h1>
              <p className="text-sm text-orange-100 sm:text-base lg:text-lg">
                Manage your account and track your activity
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              {/* <Badge
                variant="secondary"
                className="w-fit border-white/30 bg-white/20 text-white backdrop-blur-sm"
              >
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Premium Member
              </Badge> */}
              <div className="text-left sm:text-right">
                <p className="text-xs text-orange-100 sm:text-sm">
                  {profileData?.joinedAt
                    ? formatMemberSince(profileData.joinedAt)
                    : "Member since January 2024"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mb-8 lg:grid-cols-3">
          {userCarActionCountsQuery.isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="relative p-3 sm:p-4 lg:p-6">
                  <div className="mb-2 flex items-start justify-between sm:mb-3 lg:mb-4">
                    <div className="animate-pulse rounded-xl bg-gray-100 p-2 sm:p-2 lg:p-3">
                      <div className="h-4 w-4 rounded bg-gray-200 sm:h-5 sm:w-5 lg:h-6 lg:w-6"></div>
                    </div>
                    <div className="animate-pulse rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                      <div className="h-3 w-3 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="h-5 animate-pulse rounded bg-gray-200 sm:h-6 lg:h-8"></div>
                    <div className="h-3 animate-pulse rounded bg-gray-200 sm:h-3 lg:h-4"></div>
                    <div className="h-3 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="mt-2 border-t border-gray-100 pt-2 sm:mt-3 sm:pt-3 lg:mt-4 lg:pt-4">
                    <div className="h-5 animate-pulse rounded bg-gray-200 sm:h-6 lg:h-8"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : userCarActionCountsQuery.error ? (
            // Error state
            <div className="col-span-full">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 text-center sm:p-6">
                  <p className="text-red-600">Failed to load user statistics</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => userCarActionCountsQuery.refetch()}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Success state
            stats.map((stat, index) => (
              <Card
                key={index}
                className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => router.push(stat.navigationPath)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
                ></div>
                <CardContent className="relative p-3 sm:p-4 lg:p-6">
                  <div className="mb-2 flex items-start justify-between sm:mb-3 lg:mb-4">
                    <div
                      className={`rounded-xl p-2 sm:p-2 lg:p-3 ${stat.bgColor}`}
                    >
                      <stat.icon
                        className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.textColor}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1 lg:space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                      {stat.value.toLocaleString()}
                    </h3>
                    <p className="text-sm font-medium text-gray-700 sm:text-sm lg:text-base">
                      {stat.label}
                    </p>
                    {stat.description && (
                      <p className="text-xs text-gray-500 sm:text-xs lg:text-sm">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Settings className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
                  </div>
                  Profile Information
                  {userProfileQuery.isLoading && (
                    <span className="text-xs text-gray-500 sm:text-sm">
                      (Loading...)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8">
                <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-4 lg:gap-6 lg:p-6">
                  <AvatarUpload
                    currentAvatar={profileData?.avatar}
                    userName={profileData?.name || "User"}
                    userId={userId}
                    size="lg"
                    onUploadSuccess={async (avatarUrl) => {
                      try {
                        // Update local state with new avatar immediately for UI responsiveness
                        setProfileData((draft) => {
                          if (draft) {
                            draft.avatar = avatarUrl;
                          }
                        });

                        // Wait for profile refetch to complete
                        await userProfileQuery.refetch();

                        // Show success toast
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
                  <div className="flex-1 text-center sm:text-left">
                    {!isEditingName ? (
                      <div className="mb-2 flex flex-col items-center gap-2 sm:mb-1 sm:flex-row">
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                          {trimName(profileData?.name || "") || "User"}
                          {userProfileQuery.isLoading && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Loading...)
                            </span>
                          )}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditName}
                          className="cursor-pointer text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                          disabled={userProfileQuery.isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mb-2 space-y-3 sm:mb-1 sm:space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Enter your name"
                            className="flex-1 text-base font-bold sm:text-lg lg:text-xl"
                          />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            size="sm"
                            onClick={handleSaveName}
                            disabled={
                              !tempName.trim() ||
                              updateProfileMutation.isPending
                            }
                            className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {updateProfileMutation.isPending
                              ? "Saving..."
                              : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelName}
                            className="cursor-pointer bg-transparent"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:mb-3 sm:justify-start sm:gap-3">
                      {/* <Badge
                        className="text-xs text-white sm:text-sm"
                        style={{
                          background:
                            "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
                        }}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Premium Member
                      </Badge> */}
                      {profileData?.isPhoneVerified && (
                        <Badge
                          variant="outline"
                          className="border-green-200 text-xs text-green-600 sm:text-sm"
                        >
                          <Phone className="mr-1 h-3 w-3" />
                          Phone Verified
                        </Badge>
                      )}
                      {profileData?.isEmailVerified && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-xs text-blue-600 sm:text-sm"
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          Email Verified
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="border-green-200 text-xs text-green-600 sm:text-sm"
                      >
                        <Activity className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600 sm:justify-start sm:gap-4 sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatMemberSince(profileData?.joinedAt || "")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-4 w-4 text-gray-500" />
                      Mobile Number
                    </Label>
                    {!isEditingMobile ? (
                      <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 sm:p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {`${profileData?.countryCode || ""} ${profileData?.phoneNumber || ""}`}
                          </span>
                          {profileData?.isPhoneVerified && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditMobile}
                          className="cursor-pointer text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-lg border bg-blue-50 p-3 sm:p-4">
                        {!showMobileOtp ? (
                          <>
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                              <Select
                                value={tempCountryCode}
                                onValueChange={setTempCountryCode}
                              >
                                <SelectTrigger className="w-full cursor-pointer sm:w-32">
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
                                onChange={(e) =>
                                  setTempMobileNumber(e.target.value)
                                }
                                placeholder="Enter mobile number"
                                className="flex-1"
                              />
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveMobile}
                                disabled={requestPhoneChangeMutation.isPending}
                                className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                              >
                                <Check className="mr-1 h-4 w-4" />
                                {requestPhoneChangeMutation.isPending
                                  ? "Sending OTP..."
                                  : "Save & Send OTP"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelMobile}
                                className="cursor-pointer bg-transparent"
                              >
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2 text-center">
                              <h4 className="font-medium text-gray-900">
                                Verify Mobile Number
                              </h4>
                              <p className="text-sm text-gray-600">
                                Enter the 4-digit code sent to {tempCountryCode}{" "}
                                {tempMobileNumber}
                              </p>
                            </div>
                            <div className="flex justify-center gap-2">
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

                                    // Auto-focus next input
                                    if (value && index < 3) {
                                      const nextInput = e.target.parentElement
                                        ?.children[
                                        index + 1
                                      ] as HTMLInputElement;
                                      nextInput?.focus();
                                    }
                                  }}
                                  className="h-12 w-12 text-center text-lg font-bold"
                                  disabled={verifyPhoneChangeMutation.isPending}
                                />
                              ))}
                            </div>

                            {otpError && (
                              <div className="text-center text-sm text-red-600">
                                {otpError}
                              </div>
                            )}

                            <div className="text-center text-sm text-gray-600">
                              {otpCountdown > 0 ? (
                                <span>
                                  Resend OTP in {formatTime(otpCountdown)}
                                </span>
                              ) : (
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleResendOtp("mobile")}
                                  disabled={
                                    requestPhoneChangeMutation.isPending
                                  }
                                  className="h-auto p-0 text-orange-600"
                                >
                                  {requestPhoneChangeMutation.isPending
                                    ? "Sending..."
                                    : "Resend OTP"}
                                </Button>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                              <Button
                                size="sm"
                                onClick={handleVerifyMobileOtp}
                                disabled={
                                  mobileOtp.length !== 4 ||
                                  verifyPhoneChangeMutation.isPending
                                }
                                className="cursor-pointer bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                              >
                                {verifyPhoneChangeMutation.isPending
                                  ? "Verifying..."
                                  : "Verify OTP"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelMobile}
                                className="cursor-pointer bg-transparent"
                              >
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Email Address
                    </Label>
                    {!isEditingEmail ? (
                      <div
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          !profileData?.email
                            ? "border-orange-200 bg-orange-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex-1">
                          {!profileData?.email ? (
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-orange-100 p-1">
                                <Mail className="h-3 w-3 text-orange-600" />
                              </div>
                              <span className="text-sm font-medium text-orange-700 sm:text-base">
                                Add your email address
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">
                                {userProfileQuery.isLoading
                                  ? "Loading..."
                                  : profileData.email}
                              </span>
                              {profileData?.isEmailVerified && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircle className="mr-1 h-3 w-3" />
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
                          className={`cursor-pointer ${
                            !profileData?.email
                              ? "text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                              : "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                          }`}
                          disabled={userProfileQuery.isLoading}
                        >
                          {!profileData?.email ? (
                            <>
                              <Mail className="mr-1 h-4 w-4" />
                              Add Email
                            </>
                          ) : (
                            <>
                              <Edit2 className="mr-1 h-4 w-4" />
                              Change
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-lg border bg-blue-50 p-3 sm:p-4">
                        {!showEmailOtp ? (
                          <>
                            <div className="space-y-3 sm:space-y-2">
                              <Input
                                type="email"
                                value={tempEmail}
                                onChange={(e) => setTempEmail(e.target.value)}
                                placeholder={
                                  !profileData?.email
                                    ? "Enter your email address"
                                    : "Update email address"
                                }
                                className="w-full"
                              />
                              {!profileData?.email && (
                                <p className="text-xs text-blue-600 sm:text-sm">
                                  Adding an email will help you receive
                                  important notifications and recover your
                                  account. Add your email to get important
                                  updates on your booking.
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveEmail}
                                disabled={
                                  !tempEmail.trim() ||
                                  !tempEmail.includes("@") ||
                                  updateProfileMutation.isPending
                                }
                                className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Check className="mr-1 h-4 w-4" />
                                {updateProfileMutation.isPending
                                  ? "Saving..."
                                  : !profileData?.email
                                    ? "Add Email & Send OTP"
                                    : "Save & Send OTP"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEmail}
                                className="cursor-pointer bg-transparent"
                              >
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2 text-center">
                              <h4 className="font-medium text-gray-900">
                                Verify Email Address
                              </h4>
                              <p className="text-sm text-gray-600">
                                Enter the 4-digit code sent to {tempEmail}
                              </p>
                            </div>
                            <div className="flex justify-center gap-2">
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

                                    // Auto-focus next input
                                    if (value && index < 3) {
                                      const nextInput = e.target.parentElement
                                        ?.children[
                                        index + 1
                                      ] as HTMLInputElement;
                                      nextInput?.focus();
                                    }
                                  }}
                                  className="h-12 w-12 text-center text-lg font-bold"
                                  disabled={verifyOtpMutation.isPending}
                                />
                              ))}
                            </div>

                            {otpError && (
                              <div className="text-center text-sm text-red-600">
                                {otpError}
                              </div>
                            )}

                            <div className="text-center text-sm text-gray-600">
                              {otpCountdown > 0 ? (
                                <span>
                                  Resend OTP in {formatTime(otpCountdown)}
                                </span>
                              ) : (
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleResendOtp("email")}
                                  disabled={resendOtpMutation.isPending}
                                  className="h-auto p-0 text-orange-600"
                                >
                                  {resendOtpMutation.isPending
                                    ? "Sending..."
                                    : "Resend OTP"}
                                </Button>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                              <Button
                                size="sm"
                                onClick={handleVerifyEmailOtp}
                                disabled={
                                  emailOtp.length !== 4 ||
                                  verifyOtpMutation.isPending
                                }
                                className="cursor-pointer bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                              >
                                {verifyOtpMutation.isPending
                                  ? "Verifying..."
                                  : "Verify OTP"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEmail}
                                className="cursor-pointer bg-transparent"
                              >
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4 text-gray-500" />
                    Languages I Speak
                  </Label>
                  <Input
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Enter languages you speak"
                  />
                </div> */}
                </div>

                {/* Preferences */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="flex items-center gap-2 text-base font-medium text-gray-900 lg:text-lg">
                    <Bell className="h-4 w-4 text-gray-500" />
                    Notification Preferences
                  </h4>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-lg bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900">
                          Push Notifications
                        </Label>
                        <p className="mt-1 text-xs text-red-600">
                          Alerts will not be shown when notifications are off
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="cursor-pointer self-start data-[state=checked]:bg-orange-500 sm:self-center"
                      />
                    </div>

                    <div className="flex flex-col gap-3 rounded-lg bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900">
                          Email Alerts
                        </Label>
                        <p className="mt-1 text-xs text-orange-600">
                          Get up to our yearly offers only. No spam for
                          marketing or ads.
                        </p>
                      </div>
                      <Switch
                        checked={emailAlerts}
                        onCheckedChange={setEmailAlerts}
                        className="cursor-pointer self-start data-[state=checked]:bg-orange-500 sm:self-center"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveAllChanges}
                  disabled={updateProfileMutation.isPending}
                  className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 sm:py-4 sm:text-base"
                  style={{
                    background:
                      "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
                    filter: updateProfileMutation.isPending
                      ? "brightness(0.8)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!updateProfileMutation.isPending) {
                      e.currentTarget.style.filter = "brightness(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updateProfileMutation.isPending) {
                      e.currentTarget.style.filter = "none";
                    }
                  }}
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save All Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Achievements Card */}
            {/* <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="text-yellow-600 h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className={`rounded-lg p-2 ${achievement.color}`}>
                    <achievement.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {achievement.name}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card> */}

            {/* Recent Activity Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                  <Activity className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  Recent Activity
                  {userRecentActivitiesQuery.isLoading && (
                    <span className="text-xs text-gray-500 sm:text-sm">
                      (Loading...)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userRecentActivitiesQuery.isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-lg p-2 sm:gap-3 sm:p-3"
                    >
                      <div className="mt-1 h-8 w-8 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-10"></div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200 sm:h-4"></div>
                        <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-200 sm:h-3"></div>
                      </div>
                    </div>
                  ))
                ) : userRecentActivitiesQuery.error ? (
                  // Error state
                  <div className="py-4 text-center">
                    <p className="mb-2 text-sm text-red-600">
                      Failed to load recent activities
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => userRecentActivitiesQuery.refetch()}
                      className="cursor-pointer"
                    >
                      Retry
                    </Button>
                  </div>
                ) : recentActivity.length === 0 ? (
                  // Empty state
                  <div className="py-6 text-center sm:py-8">
                    <Activity className="mx-auto mb-2 h-10 w-10 text-gray-300 sm:mb-3 sm:h-12 sm:w-12" />
                    <p className="text-sm text-gray-500">
                      No recent activity to show
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Start browsing cars to see your activity here
                    </p>
                  </div>
                ) : (
                  // Activity list
                  recentActivity.map((activity, index) => (
                    <div
                      key={`${activity.carId}-${index}`}
                      className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50 sm:gap-3 sm:p-3"
                      onClick={() => {
                        // Navigate to vehicle details page
                        // You can customize this route based on your app structure
                        if (activity.carId) {
                          router.push(`/vehicle/${activity.carId}`);
                        }
                      }}
                    >
                      {/* Vehicle Image */}
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg sm:h-12 sm:w-12">
                        <img
                          src={getVehicleImageUrl(activity.vehicleImageUrl)}
                          alt={activity.vehicleName || "Vehicle"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder on image load error
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                        {/* Activity type overlay */}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 rounded-full p-0.5 sm:-bottom-1 sm:-right-1 sm:p-1 ${
                            activity.type === "view"
                              ? "bg-purple-100"
                              : activity.type === "save"
                                ? "bg-red-100"
                                : "bg-blue-100"
                          }`}
                        >
                          {activity.type === "view" ? (
                            <Eye className="h-2 w-2 text-purple-600 sm:h-2.5 sm:w-2.5" />
                          ) : activity.type === "save" ? (
                            <Heart className="h-2 w-2 text-red-600 sm:h-2.5 sm:w-2.5" />
                          ) : (
                            <MessageSquare className="h-2 w-2 text-blue-600 sm:h-2.5 sm:w-2.5" />
                          )}
                        </div>
                      </div>

                      {/* Activity Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.vehicleName && (
                          <p className="mt-0.5 truncate text-xs font-medium text-orange-600">
                            {activity.vehicleName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {!userRecentActivitiesQuery.isLoading &&
                  !userRecentActivitiesQuery.error &&
                  recentActivity.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full cursor-pointer bg-transparent text-xs sm:text-sm"
                    >
                      View All Activity
                    </Button>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2 sm:transform"
          >
            <div className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg sm:px-6 sm:py-4">
              <CheckCircle
                size={18}
                className="flex-shrink-0 text-white sm:h-5 sm:w-5"
              />
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-semibold sm:text-sm">
                  Profile Updated Successfully!
                </span>
                <span className="text-xs opacity-90">
                  Your changes have been saved
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
