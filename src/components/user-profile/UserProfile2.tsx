"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Settings,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Star,
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
import { AccountManagementSection } from "./AccountManagementSection";
import { PasswordResetSection } from "./PasswordResetSection";
import { UserStatsSection } from "./UserStatsSection";
import { ProfileInformationSection } from "./ProfileInformationSection";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

interface UserProfileProps {
  className?: string;
}

export const UserProfile2 = ({ className }: UserProfileProps) => {
  return (
    // <ProtectedRoute showLoginModal={true}>
    <UserProfileContent className={className} />
    // </ProtectedRoute>
  );
};

const UserProfileContent = ({ className }: UserProfileProps) => {
  const router = useRouter();
  const { country, state } = useStateAndCategory();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  // Get NextAuth session for userId
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString();

  console.log("userId[UserProfile2]", userId);
  const {
    deleteUser,
    updateProfile,
    formatMemberSince,
    useGetUserProfile,
    requestEmailChange,
    verifyEmailChange,
    requestPhoneNumberChange,
    verifyPhoneNumberChange,
    deleteUserMutation,
    verifyOtpMutation,
    resendOtpMutation,
    requestPhoneChangeMutation,
    verifyPhoneChangeMutation,
    requestEmailChangeMutation,
    verifyEmailChangeMutation,
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
    isPasswordSet?: boolean;
    isOAuthUser?: boolean;
  } | null>(null);

  // Toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
        isPasswordSet: fetchedProfileData.isPasswordSet || false,
        isOAuthUser: fetchedProfileData.isOAuthUser || false,
        joinedAt:
          (fetchedProfileData as any).createdAt ||
          (fetchedProfileData as any).updatedAt ||
          new Date().toISOString(),
      });
    }
  }, [userProfileQuery.data, setProfileData]);

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

  // Use current country and state, with fallbacks
  const profileCountry = country || "in";
  const profileState =
    state || (profileCountry === "in" ? "bangalore" : "dubai");

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
      navigationPath: `/${profileCountry}/${profileState}/user-profile/enquired-vehicles`,
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
      navigationPath: `/${profileCountry}/${profileState}/user-profile/saved-vehicles`,
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
      navigationPath: `/${profileCountry}/${profileState}/user-profile/viewed-vehicles`,
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
        className={`mx-auto max-w-7xl space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 sm:py-6 md:space-y-6 md:px-6 lg:space-y-8 lg:px-8 lg:py-8 ${className || ""}`}
      >
        {/* Profile Breadcrumb */}
        <ProfileBreadcrumb
          userName={trimName(profileData?.name || "", 5)}
          className="mt-1 sm:mt-2"
          country={profileCountry}
          state={profileState}
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
          className="relative overflow-hidden rounded-lg p-3 text-white sm:rounded-xl sm:p-4 md:rounded-2xl md:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="mb-1 text-xl font-bold leading-tight sm:mb-2 sm:text-2xl md:text-3xl lg:text-4xl">
                {`Hello ${trimName(profileData?.name || "", 15) || "User"}`}
              </h1>
              <p className="text-xs text-orange-100/90 sm:text-sm md:text-base lg:text-lg">
                Manage your account and track your activity
              </p>
            </div>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-orange-100/90 sm:text-xs md:text-sm">
                  {profileData?.joinedAt
                    ? formatMemberSince(profileData.joinedAt)
                    : "Member since January 2024"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <UserStatsSection
          userCarActionCountsQuery={userCarActionCountsQuery}
          stats={stats}
        />

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 md:px-6 md:pt-6">
                <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:gap-3 sm:text-lg md:text-xl lg:text-2xl">
                  <div className="rounded-md bg-orange-100 p-1.5 sm:rounded-lg sm:p-2">
                    <Settings className="h-3.5 w-3.5 text-orange-600 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="min-w-0 flex-1">Profile Information</span>
                  {userProfileQuery.isLoading && (
                    <span className="text-[10px] text-gray-500 sm:text-xs md:text-sm">
                      (Loading...)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:space-y-6 md:p-6 lg:space-y-8">
                <ProfileInformationSection
                  profileData={profileData}
                  userId={userId}
                  userProfileQuery={userProfileQuery}
                  updateProfile={updateProfile}
                  requestPhoneNumberChange={requestPhoneNumberChange}
                  verifyPhoneNumberChange={verifyPhoneNumberChange}
                  requestEmailChange={requestEmailChange}
                  verifyEmailChange={verifyEmailChange}
                  updateProfileMutation={updateProfileMutation}
                  requestPhoneChangeMutation={requestPhoneChangeMutation}
                  verifyPhoneChangeMutation={verifyPhoneChangeMutation}
                  requestEmailChangeMutation={requestEmailChangeMutation}
                  verifyEmailChangeMutation={verifyEmailChangeMutation}
                  verifyOtpMutation={verifyOtpMutation}
                  resendOtpMutation={resendOtpMutation}
                  formatMemberSince={formatMemberSince}
                  setProfileData={setProfileData}
                  setShowSuccessToast={setShowSuccessToast}
                />
                {/* account managment */}

                {/* Password Reset */}
                <PasswordResetSection
                  phoneNumber={profileData?.phoneNumber}
                  countryCode={profileData?.countryCode}
                  userProfileData={profileData}
                  isOAuthUser={profileData?.isOAuthUser}
                  isPasswordSet={profileData?.isPasswordSet}
                />
                {/* Preferences */}
                <div className="space-y-3 border-t pt-3 sm:space-y-4 sm:pt-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-medium text-gray-900 sm:gap-2 sm:text-base lg:text-lg">
                    <Bell className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
                    Notification Preferences
                  </h4>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-2.5 rounded-lg bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
                      <div className="min-w-0 flex-1">
                        <Label className="text-xs font-medium text-gray-900 sm:text-sm">
                          Push Notifications
                        </Label>
                        <p className="mt-1 text-[10px] leading-relaxed text-red-600 sm:text-xs">
                          Alerts will not be shown when notifications are off
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="shrink-0 cursor-pointer self-start data-[state=checked]:bg-orange-500 sm:self-center"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5 rounded-lg bg-orange-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
                      <div className="min-w-0 flex-1">
                        <Label className="text-xs font-medium text-gray-900 sm:text-sm">
                          Email Alerts
                        </Label>
                        <p className="mt-1 text-[10px] leading-relaxed text-orange-600 sm:text-xs">
                          Get up to our yearly offers only. No spam for
                          marketing or ads.
                        </p>
                      </div>
                      <Switch
                        checked={emailAlerts}
                        onCheckedChange={setEmailAlerts}
                        className="shrink-0 cursor-pointer self-start data-[state=checked]:bg-orange-500 sm:self-center"
                      />
                    </div>
                  </div>
                </div>
                <AccountManagementSection
                  onConfirmDeleteUser={() => deleteUser({ userId: userId! })}
                  isDeletingAccount={deleteUserMutation.isPending}
                />

                <Button
                  onClick={handleSaveAllChanges}
                  disabled={updateProfileMutation.isPending}
                  className="w-full cursor-pointer rounded-lg py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 sm:rounded-xl sm:py-3 sm:text-sm md:py-4 md:text-base"
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

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Recent Activity Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 md:px-6 md:pt-6">
                <CardTitle className="flex flex-wrap items-center gap-1.5 text-sm sm:gap-2 sm:text-base md:text-lg lg:text-xl">
                  <Activity className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="min-w-0 flex-1">Recent Activity</span>
                  {userRecentActivitiesQuery.isLoading && (
                    <span className="text-[10px] text-gray-500 sm:text-xs md:text-sm">
                      (Loading...)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
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
                      className="flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50 sm:gap-2.5 sm:p-2.5 md:gap-3 md:p-3"
                    >
                      {/* Vehicle Image */}
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md sm:h-10 sm:w-10 md:h-12 md:w-12 md:rounded-lg">
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
                            <Eye className="h-1.5 w-1.5 text-purple-600 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5" />
                          ) : activity.type === "save" ? (
                            <Heart className="h-1.5 w-1.5 text-red-600 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5" />
                          ) : (
                            <MessageSquare className="h-1.5 w-1.5 text-blue-600 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5" />
                          )}
                        </div>
                      </div>

                      {/* Activity Details */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="line-clamp-2 text-[10px] font-medium text-gray-900 sm:text-xs md:text-sm">
                          {activity.action}
                        </p>
                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          {activity.time}
                        </p>
                        {activity.vehicleName && (
                          <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-orange-600 sm:text-xs">
                            {activity.vehicleName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {/* {!userRecentActivitiesQuery.isLoading &&
                  !userRecentActivitiesQuery.error &&
                  recentActivity.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full cursor-pointer bg-transparent text-xs sm:text-sm"
                    >
                      View All Activity
                    </Button>
                  )} */}
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
            className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:transform"
          >
            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-white shadow-lg sm:gap-3 sm:px-4 sm:py-3 md:px-6 md:py-4">
              <CheckCircle
                size={16}
                className="flex-shrink-0 text-white sm:h-4 sm:w-4 md:h-5 md:w-5"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[10px] font-semibold sm:text-xs md:text-sm">
                  Profile Updated Successfully!
                </span>
                <span className="text-[10px] opacity-90 sm:text-xs">
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
