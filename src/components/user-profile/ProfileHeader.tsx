import { ProfileData } from "./component-types";
import { ProfileBreadcrumb } from "./ProfileBreadcrumb"; // Assumed component
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react"; // Assumed icon

type ProfileHeaderProps = {
  profileData: ProfileData | undefined;
  userProfileQuery: { error: Error | null; refetch: () => void };
  trimName: (name: string, length: number) => string;
  formatMemberSince: (date: string) => string;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  userProfileQuery,
  trimName,
  formatMemberSince,
}) => (
  <>
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

    {/* Banner */}
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
  </>
);
