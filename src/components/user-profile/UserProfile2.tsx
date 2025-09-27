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
  console.log("tempName: ", tempName);

  // Toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const userId = authStorage.getUser()?.id.toString();

  // Get user profile data
  const userProfileQuery = useGetUserProfile(userId!, !!userId);

  const {
    userCarActionCountsQuery,
    handleUpdateProfile,
    updateProfileMutation,
  } = useUserProfile({
    userId: userId!,
  });

  useEffect(() => {
    if (!userCarActionCountsQuery.isLoading) {
      const data = userCarActionCountsQuery.data;
      console.log("userCarActionCountsQuery data: ", data);
    }
  }, [userCarActionCountsQuery.data]);

  useEffect(() => {
    if (userProfileQuery.data?.success && userProfileQuery.data.data) {
      const fetchedProfileData = userProfileQuery.data.data;
      console.log("User profile data: ", fetchedProfileData);

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

  const handleEditName = () => {
    setTempName(profileData?.name || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      await handleUpdateProfile({
        name: tempName,
      });

      // Update local state
      setProfileData((draft) => {
        if (draft) {
          draft.name = tempName;
        }
      });
      setIsEditingName(false);
      console.log("Name updated successfully");

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
      await handleUpdateProfile({
        phoneNumber: tempMobileNumber,
        countryCode: tempCountryCode,
      });

      // Update local state
      setProfileData((draft) => {
        if (draft) {
          draft.countryCode = tempCountryCode;
          draft.phoneNumber = tempMobileNumber;
        }
      });
      setIsEditingMobile(false);
      console.log("Mobile number updated successfully");

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to update mobile number:", error);
    }
  };

  const handleCancelMobile = () => {
    setIsEditingMobile(false);
  };

  const handleEditEmail = () => {
    setTempEmail(profileData?.email || "");
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      await handleUpdateProfile({
        email: tempEmail,
      });

      // Update local state
      setProfileData((draft) => {
        if (draft) {
          draft.email = tempEmail;
        }
      });
      setIsEditingEmail(false);
      console.log("Email updated successfully");

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to update email:", error);
    }
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
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

      console.log("Profile updated successfully");
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
      label: "Total Enquiries",
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
      label: "Saved Vehicles",
      value: userCarActionCountsQuery.data?.saved || 0,
      trend: "+8%",
      trendUp: true,
      icon: Heart,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      description: "All time favorites",
      action: "saved",
      navigationPath: "/user-profile/saved-vehicles",
    },
    {
      label: "Viewed Vehicles",
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

  const recentActivity = [
    { action: "Viewed Mercedes C-Class", time: "2 hours ago", type: "view" },
    { action: "Saved BMW X5", time: "1 day ago", type: "save" },
    { action: "Enquired about Audi A6", time: "3 days ago", type: "enquiry" },
  ];

  return (
    <>
      <div
        className={`mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 lg:space-y-8 lg:px-8 ${className || ""}`}
      >
        {/* Profile Breadcrumb */}
        <ProfileBreadcrumb
          userName={profileData?.name || "User"}
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
                My Profile Dashboard
              </h1>
              <p className="text-sm text-orange-100 sm:text-base lg:text-lg">
                Manage your account and track your activity
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Badge
                variant="secondary"
                className="w-fit border-white/30 bg-white/20 text-white backdrop-blur-sm"
              >
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Premium Member
              </Badge>
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
                <CardContent className="relative p-4 sm:p-6">
                  <div className="mb-3 flex items-start justify-between sm:mb-4">
                    <div className="animate-pulse rounded-xl bg-gray-100 p-2 sm:p-3">
                      <div className="h-5 w-5 rounded bg-gray-200 sm:h-6 sm:w-6"></div>
                    </div>
                    <div className="animate-pulse rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                      <div className="h-3 w-3 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 animate-pulse rounded bg-gray-200 sm:h-8"></div>
                    <div className="h-3 animate-pulse rounded bg-gray-200 sm:h-4"></div>
                    <div className="h-3 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="mt-3 border-t border-gray-100 pt-3 sm:mt-4 sm:pt-4">
                    <div className="h-6 animate-pulse rounded bg-gray-200 sm:h-8"></div>
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
                <CardContent className="relative p-4 sm:p-6">
                  <div className="mb-3 flex items-start justify-between sm:mb-4">
                    <div className={`rounded-xl p-2 sm:p-3 ${stat.bgColor}`}>
                      <stat.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.textColor}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {stat.value.toLocaleString()}
                    </h3>
                    <p className="text-sm font-medium text-gray-700 sm:text-base">
                      {stat.label}
                    </p>
                    {stat.description && (
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
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
              <CardContent className="space-y-6 sm:space-y-8">
                <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
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

                        console.log("Avatar updated successfully");
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
                      <div className="mb-1 flex flex-col items-center gap-2 sm:flex-row">
                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                          {profileData?.name || "User"}
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
                      <div className="mb-1 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Enter your name"
                            className="flex-1 text-lg font-bold sm:text-xl"
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
                    <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
                      <Badge
                        className="text-xs text-white sm:text-sm"
                        style={{
                          background:
                            "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
                        }}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Premium Member
                      </Badge>
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
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-600 sm:justify-start sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatMemberSince(profileData?.joinedAt || "")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                      <Phone className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                      Mobile Number
                    </Label>
                    {!isEditingMobile ? (
                      <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                        <span className="text-gray-900">
                          <span className="text-sm text-gray-900 sm:text-base">
                            {`${profileData?.countryCode || ""} ${profileData?.phoneNumber || ""}`}
                          </span>
                        </span>
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
                      <div className="space-y-3 rounded-lg border bg-blue-50 p-3">
                        <div className="flex flex-col gap-2 sm:flex-row">
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
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            size="sm"
                            onClick={handleSaveMobile}
                            disabled={updateProfileMutation.isPending}
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
                            onClick={handleCancelMobile}
                            className="cursor-pointer bg-transparent"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                      <Mail className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
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
                            <span className="text-sm text-gray-900 sm:text-base">
                              {userProfileQuery.isLoading
                                ? "Loading..."
                                : profileData.email}
                            </span>
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
                      <div className="space-y-3 rounded-lg border bg-blue-50 p-3">
                        <div className="space-y-2">
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
                              Adding an email will help you receive important
                              notifications and recover your account.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
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
                                ? "Add Email"
                                : "Save"}
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
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 sm:text-base lg:text-lg">
                    <Bell className="h-4 w-4 text-gray-500" />
                    Notification Preferences
                  </h4>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-lg bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900 sm:text-base">
                          Push Notifications
                        </Label>
                        <p className="mt-1 text-xs text-red-600 sm:text-sm">
                          Alerts will not be shown when notifications are off
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="cursor-pointer self-start data-[state=checked]:bg-orange-500 sm:self-center"
                      />
                    </div>

                    <div className="flex flex-col gap-3 rounded-lg bg-orange-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900 sm:text-base">
                          Email Alerts
                        </Label>
                        <p className="mt-1 text-xs text-orange-600 sm:text-sm">
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      className={`mt-1 rounded-full p-1.5 ${
                        activity.type === "view"
                          ? "bg-purple-100"
                          : activity.type === "save"
                            ? "bg-red-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {activity.type === "view" ? (
                        <Eye className="h-3 w-3 text-purple-600" />
                      ) : activity.type === "save" ? (
                        <Heart className="h-3 w-3 text-red-600" />
                      ) : (
                        <MessageSquare className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full cursor-pointer bg-transparent text-xs sm:text-sm"
                >
                  View All Activity
                </Button>
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
            className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform sm:bottom-6 sm:w-auto"
          >
            <div className="flex items-center justify-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg sm:px-6 sm:py-4">
              <CheckCircle size={18} className="text-white sm:h-5 sm:w-5" />
              <div className="flex flex-col">
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
