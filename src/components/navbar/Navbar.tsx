"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useShouldRender } from "@/hooks/useShouldRender";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { getAvatarProps, trimName } from "@/helpers";
import { noStatesDropdownRoutes } from ".";
import LanguageSelector from "./LanguageSelector";
import { LocationDialog } from "../dialog/location-dialog/LocationDialog";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  AlignRight,
  User,
  LogOut,
  MessageSquare,
  Heart,
  HelpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RegisterLinkButton from "../common/RegisterLinkButton";
import RideRentNavbarLogo from "../common/RideRentNavbarLogo";
import { useAuthContext } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LoginDrawer } from "../dialog/login-dialog/LoginDrawer";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

// dynamic import for sidebar - Fix the loading state
const MobileSidebar = dynamic(() => import("../sidebar/MobileSidebar"), {
  loading: () => (
    <Button className="h-9 w-9 p-0" variant="ghost" size="icon" disabled>
      <AlignRight className="h-5 w-5" />
      <span className="sr-only">Toggle navigation</span>
    </Button>
  ),
  ssr: false,
});

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const {
    logout,
    isLoginOpen,
    onHandleLoginmodal,
  } = useAuthContext();

  const { data: sessionData, status: sessionStatus } = useSession();
  console.log("sessionData[Navbar]", sessionData);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const { country, state, category } = useStateAndCategory();

  // Background geolocation
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sessionStorage.setItem(
            "userLocation",
            JSON.stringify({ latitude, longitude })
          );
        },
        () => {}
      );
    }
  }, []);

  const shouldRenderDropdowns = useShouldRender(noStatesDropdownRoutes);

  // Check if user is authenticated using NextAuth session
  const isAuthenticated = sessionStatus === "authenticated" && !!sessionData;

  // Get user data directly from NextAuth session
  const userName = sessionData?.user?.name || "";
  const userEmail = sessionData?.user?.email || "";
  const userAvatar = sessionData?.user?.image || "";
  const userId = sessionData?.user?.id || "";

  const handleLogout = () => {
    router.push(`/${country}/${state}`);
    logout(userId);
    onHandleLoginmodal({ isOpen: true });
  };

  // Navigation handlers
  const handleProfileNavigation = () => {
    router.push(`/${country}/${state}/user-profile`);
  };

  const handleEnquiriesNavigation = () => {
    router.push(`/${country}/${state}/user-profile/enquired-vehicles`);
  };

  const handleFavoritesNavigation = () => {
    // Use current country and state, with fallbacks
    const profileCountry = country || "in";
    const profileState = state || (profileCountry === "in" ? "bangalore" : "dubai");
    router.push(`/${profileCountry}/${profileState}/user-profile/saved-vehicles`);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b bg-white">
        <div className="container mx-auto h-full px-2 sm:px-4">
          <nav
            className="flex h-full items-center justify-between"
            aria-label="Main navigation"
          >
            {/* Left Section: Logo */}
            <div className="flex-shrink-0">
              <RideRentNavbarLogo
                country={country}
                state={state}
                category={category}
              />
            </div>

            {/* Right Section: All Navigation Items */}
            <div className="flex items-center space-x-1">
              {/* Search */}
              {shouldRenderDropdowns && (
                <SearchDialog
                  country={country}
                  state={state}
                  category={category}
                />
              )}

              {/* Language Selector - Hide text on small screens */}
              <LanguageSelector
                theme="navbar"
                size="md"
                showLanguageText={false}
                position="left"
                className="navbar-lang-selector"
              />

              {/* Location Dialog - Conditional */}
              {shouldRenderDropdowns && <LocationDialog />}

              {/* Register Button - Hidden on mobile and small tablets */}
              <div className="hidden lg:block">
                <RegisterLinkButton country={country} />
              </div>

              {/* User Authentication */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 flex-shrink-0 cursor-pointer ring-2 ring-orange-200 transition-all hover:ring-orange-300">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-orange-100 text-xs font-semibold text-orange-600">
                        {getAvatarProps(userName).fallbackInitials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          <span className="text-xs font-normal text-muted-foreground">
                            Hello,{" "}
                          </span>
                          {trimName(userName, 15)}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleProfileNavigation}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleEnquiriesNavigation}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Enquiries</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleFavoritesNavigation}
                      className="cursor-pointer"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 rounded-full p-0"
                  onClick={() => onHandleLoginmodal({ isOpen: true })}
                  aria-label="Sign in to your account"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}

              {/* Mobile Sidebar - Always render on mobile, guaranteed space */}
              <div className="flex-shrink-0 md:hidden">
                {mounted ? (
                  <MobileSidebar />
                ) : (
                  <Button
                    className="h-9 w-9 p-0"
                    variant="ghost"
                    size="icon"
                    disabled
                  >
                    <AlignRight className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation</span>
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <LoginDrawer
        isOpen={isLoginOpen}
        onClose={() => onHandleLoginmodal({ isOpen: false })}
      />
    </>
  );
};
