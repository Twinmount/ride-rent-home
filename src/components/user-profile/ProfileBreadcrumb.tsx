import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, User, Settings, Heart, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";

type ProfileSection =
  | "dashboard"
  | "settings"
  | "favorites"
  | "activity"
  | "enquiries"
  | "saved-vehicles"
  | "viewed-vehicles"
  | "enquired-vehicles";

type ProfileBreadcrumbProps = {
  userName?: string;
  currentSection?: ProfileSection;
  className?: string;
  hasShowUsername?: boolean;
  country?: string;
  state?: string;
};

const getSectionConfig = (country: string, state: string) => ({
  dashboard: { label: "Dashboard", icon: User, path: `/${country}/${state}/user-profile` },
  settings: {
    label: "Settings",
    icon: Settings,
    path: `/${country}/${state}/user-profile/settings`,
  },
  favorites: {
    label: "Favorites",
    icon: Heart,
    path: `/${country}/${state}/user-profile/favorites`,
  },
  activity: { label: "Activity", icon: Eye, path: `/${country}/${state}/user-profile/activity` },
  enquiries: {
    label: "Enquiries",
    icon: MessageSquare,
    path: `/${country}/${state}/user-profile/enquiries`,
  },
  "saved-vehicles": {
    label: "Saved Vehicles",
    icon: Heart,
    path: `/${country}/${state}/user-profile/saved-vehicles`,
  },
  "viewed-vehicles": {
    label: "Recently Viewed",
    icon: Eye,
    path: `/${country}/${state}/user-profile/viewed-vehicles`,
  },
  "enquired-vehicles": {
    label: "Enquired Vehicles",
    icon: MessageSquare,
    path: `/${country}/${state}/user-profile/enquired-vehicles`,
  },
});

export function ProfileBreadcrumb({
  userName = "User",
  currentSection = "dashboard",
  className = "",
  hasShowUsername = false,
  country = "in",
  state: stateParam = "bangalore",
}: ProfileBreadcrumbProps) {
  // Use current country and state, with fallbacks
  const profileCountry = country || "in";
  const profileState = stateParam || (profileCountry === "in" ? "bangalore" : "dubai");
  
  const sectionConfig = getSectionConfig(profileCountry, profileState);
  const currentConfig = sectionConfig[currentSection];
  const CurrentIcon = currentConfig.icon;

  return (
    <MotionDiv className={`mb-4 ${className}`}>
      <Breadcrumb className="w-fit rounded-2xl bg-white/50 px-3 py-2 shadow-sm backdrop-blur-sm">
        <BreadcrumbList className="text-sm">
          {/* Home */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="flex items-center gap-1 font-medium transition-colors hover:text-orange-500 hover:underline"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* Profile */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="flex items-center gap-1 font-medium transition-colors hover:text-orange-500 hover:underline"
              asChild
            >
              <Link href={`/${profileCountry}/${profileState}/user-profile`}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* <BreadcrumbSeparator /> */}

          {/* Current Section */}
          {currentSection !== "dashboard" ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex cursor-default items-center gap-1 font-medium text-orange-600">
                  <CurrentIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {currentConfig.label}
                  </span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : /* Dashboard - show user name directly */
          hasShowUsername ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="flex max-w-[120px] cursor-default items-center gap-1 truncate font-medium text-orange-600 sm:max-w-none">
                <CurrentIcon className="h-4 w-4" />
                {userName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
    </MotionDiv>
  );
}

export default ProfileBreadcrumb;
export type { ProfileSection };
