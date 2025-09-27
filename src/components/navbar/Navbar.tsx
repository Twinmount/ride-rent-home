"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useShouldRender } from "@/hooks/useShouldRender";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { extractCategory } from "@/helpers";
import { noStatesDropdownRoutes } from ".";
import LanguageSelector from "./LanguageSelector";
import { LocationDialog } from "../dialog/location-dialog/LocationDialog";
import { useEffect, useState } from "react";
import { AlignRight, User, Settings, LogOut } from "lucide-react";
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

export const Navbar = () => {
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
  const [state, setState] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isMobileResolved, setIsMobileResolved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Resolve mobile state immediately to prevent shifts
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setIsMobileResolved(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Handle state/category with SSR-safe approach
    const paramState = params?.state as string | undefined;
    const paramCategory = params?.category as string | undefined;

    // Set immediately from params if available (no localStorage flicker)
    const finalState = paramState || (country === "in" ? "bangalore" : "dubai");
    const finalCategory = paramCategory || "cars";

    setState(finalState);
    setCategory(extractCategory(finalCategory));

    // Store in localStorage without causing re-render
    if (typeof window !== "undefined") {
      if (paramState) localStorage.setItem("state", paramState);
      if (paramCategory) localStorage.setItem("category", paramCategory);
    }
  }, [params, country]);

  // Background geolocation (doesn't affect layout)
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
        () => {} // Silent fail
      );
    }
  }, []);

  const shouldRenderDropdowns = useShouldRender(noStatesDropdownRoutes);

  const handleLogout = () => {
    logout(auth?.user?.id || "");
  };

  const userName = user ? `${user.name}` : "User";

  // Don't render until mobile state is resolved
  if (!isMobileResolved) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-b bg-white">
        <nav
          className="flex-between global-padding container"
          aria-label="Main navigation"
        >
          <div className="flex w-fit items-center justify-center">
            <div className="w-fit p-0">
              <RideRentNavbarLogo
                country={country}
                state={state}
                category={category}
              />
            </div>
          </div>
          {/* Reserve space for navbar items to prevent shift */}
          <div className="flex w-fit items-center">
            <ul className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-5">
              <li>
                <div className="h-10 w-10"></div>
              </li>{" "}
              {/* Search space */}
              <li>
                <div className="h-10 w-16"></div>
              </li>{" "}
              {/* Language space */}
              <li>
                <div className="h-10 w-20"></div>
              </li>{" "}
              {/* Location space */}
              <li>
                <div className="h-10 w-24"></div>
              </li>{" "}
              {/* Register space */}
              <li>
                <div className="h-10 w-10"></div>
              </li>{" "}
              {/* User space */}
              <li>
                <div className="h-10 w-10"></div>
              </li>{" "}
              {/* Mobile sidebar space */}
            </ul>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-b bg-white transition-all duration-200 ease-in-out">
        <nav
          className="flex-between global-padding container"
          aria-label="Main navigation"
        >
          <div className="flex w-fit items-center justify-center">
            <div className="w-fit p-0">
              <RideRentNavbarLogo
                country={country}
                state={state}
                category={category}
              />
            </div>
          </div>

          <div className="flex w-fit items-center">
            <ul className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-5">
              {/* Search Dialog */}
              <li>
                <SearchDialog state={state} category={category} />
              </li>

              {/* Language Selector */}
              <li>
                <LanguageSelector
                  theme="navbar"
                  size="md"
                  showLanguageText={true}
                  position="left"
                  className="navbar-lang-selector"
                />
              </li>

              {/* Location - Always reserve space */}
              <li className="-mx-2 w-fit">
                {shouldRenderDropdowns ? (
                  <div className="h-10 w-20"></div> // Reserve space when hidden
                ) : (
                  <LocationDialog />
                )}
              </li>

              {/* List Button - Always reserve space */}
              <li className="hidden lg:block">
                <RegisterLinkButton country={country} />
              </li>

              {/* User Menu - Always reserve space */}
              <li className="flex items-center space-x-2">
                {auth.isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar
                        className="h-9 w-9 cursor-pointer ring-2 ring-orange-200 transition-all hover:ring-orange-300"
                        role="button"
                        tabIndex={0}
                        aria-label={`Open user menu for ${userName}`}
                      >
                        <AvatarImage
                          src={user?.avatar}
                          alt={`Profile picture of ${userName}`}
                        />
                        <AvatarFallback className="bg-orange-100 font-semibold text-orange-600">
                          {userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
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
                            {userName}
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
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
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
                    className="rounded-full"
                    onClick={() => onHandleLoginmodal({ isOpen: true })}
                    aria-label="Sign in to your account"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </li>

              {/* Mobile Sidebar - Always reserve space */}
              <li className="flex h-10 w-10 items-center justify-center">
                {isMobile ? (
                  <Button className="border-none outline-none" size="icon">
                    <AlignRight className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation</span>
                  </Button>
                ) : (
                  <div className="h-10 w-10"></div> // Reserve space on desktop
                )}
              </li>
            </ul>
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
