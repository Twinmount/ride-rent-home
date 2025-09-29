"use client";

import SafeImage from "@/components/common/SafeImage";
import dynamic from "next/dynamic";

import { useParams, useRouter } from "next/navigation";
import { useShouldRender } from "@/hooks/useShouldRender";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { extractCategory, getAvatarProps, trimName } from "@/helpers";
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
import { authStorage } from "@/lib/auth";


// dynamic import for sidebar
const MobileSidebar = dynamic(() => import("../sidebar/MobileSidebar"), {
  loading: () => (
    // fallback while loading sidebar
    <Button className="border-none outline-none" size="icon" disabled>
      <AlignRight className="h-6 w-6" />
      <span className="sr-only">Toggle navigation</span>
    </Button>
  ),
});

export const Navbar = () => {
  const router = useRouter();
  const {
    user,
    auth,
    logout,
    isLoginOpen,
    onHandleLoginmodal,
    handleProfileNavigation,
  } = useAuthContext();

  const params = useParams<{
    state: string;
    category: string;
    country: string;
  }>();

  const country = (params?.country as string) || "ae";

  // Initialize with SSR-safe default values to prevent hydration mismatch
  const [state, setState] = useState<string>(() => {
    if (typeof window === "undefined") {
      return params?.state || (country === "in" ? "bangalore" : "dubai");
    }
    const storedState = localStorage.getItem("state");
    return (
      params?.state || storedState || (country === "in" ? "bangalore" : "dubai")
    );
  });

  const [category, setCategory] = useState<string>(() => {
    if (typeof window === "undefined") {
      return extractCategory(params?.category || "cars");
    }
    const storedCategory = localStorage.getItem("category");
    return extractCategory(params?.category || storedCategory || "cars");
  });

  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const paramState = params?.state;
    const paramCategory = params?.category;

    const finalState = paramState || (country === "in" ? "bangalore" : "dubai");
    const finalCategory = extractCategory(paramCategory || "cars");

    setState(finalState);
    setCategory(finalCategory);

    // Update localStorage
    if (paramState) localStorage.setItem("state", paramState);
    if (paramCategory) localStorage.setItem("category", paramCategory);
  }, [params, country, mounted]);

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

  const handleLogout = () => {
    logout(auth?.user?.id || "");
  };

  // Navigation handlers
  const handleEnquiriesNavigation = () => {
    router.push("/user-profile/enquired-vehicles");
  };

  const handleFavoritesNavigation = () => {
    router.push("/user-profile/saved-vehicles");
  };

  // Get user name from auth state
  const userName = user ? `${user.name}` : "User";
  const isMobile =
    mounted && typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b bg-white">
        <nav
          className="container mx-auto flex h-full items-center px-4"
          aria-label="Main navigation"
        >
          {/* Logo with extra spacing */}
          <div className="mr-8 lg:mr-12">
            <RideRentNavbarLogo
              country={country}
              state={state}
              category={category}
            />
          </div>

          {/* Navigation Items - ml-auto pushes to right, gap-2 for tight spacing */}
          <div className="ml-auto flex items-center lg:gap-2">
            {/* Search - Always rendered to prevent shift */}
            <SearchDialog state={state} category={category} />

            {/* Language Selector - Always visible */}
            <LanguageSelector
              theme="navbar"
              size="md"
              showLanguageText={true}
              position="left"
              className="navbar-lang-selector"
            />

            {/* Location Dialog - Conditional but space reserved */}
            <div className="min-w-[5rem]">
              {!shouldRenderDropdowns && <LocationDialog />}
            </div>

            {/* Register Button - Hidden on mobile but space reserved */}
            <div className="hidden lg:block">
              <RegisterLinkButton country={country} />
            </div>
            <div className="flex items-center space-x-2">
              {auth.isLoggedIn && (
                <div className="flex items-center space-x-2">
                  {/* Notifications */}
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="relative cursor-pointer"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white">
                      3
                    </Badge>
                  </Button> */}

                  {/* Dropdown Menu for Avatar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-orange-200 transition-all hover:ring-orange-300">
                        <AvatarImage src={user?.avatar} alt={userName} />
                        <AvatarFallback className="bg-orange-100 font-semibold text-orange-600">
                          {getAvatarProps(userName).fallbackInitials}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            <span className="text-xs font-normal text-muted-foreground">
                              Hello,{" "}
                            </span>
                            {trimName(userName, 15)}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
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
                </div>
              )}

              {!auth.isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full p-0"
                  onClick={() => onHandleLoginmodal({ isOpen: true })}
                  aria-label="Sign in to your account"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu - Fixed size container */}
            {mounted && isMobile && (
              <div className="h-9 w-9">
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                  <AlignRight className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <LoginDrawer
        isOpen={isLoginOpen}
        onClose={() => onHandleLoginmodal({ isOpen: false })}
      />
    </>
  );
};

