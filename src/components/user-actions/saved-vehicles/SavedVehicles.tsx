"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Search,
  Filter,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useUserActions } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import { generateVehicleDetailsUrl } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import { NewVehicleCardType } from "@/types/vehicle-types";

interface SavedVehiclesProps {
  className?: string;
}

const SavedVehicles: React.FC<SavedVehiclesProps> = ({ className = "" }) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [page, setPage] = useState(0);

  // Use NextAuth session userId as primary source, fallback to auth context user
  const userId = session?.user?.id || user?.id || authStorage.getUser()?.id;

  // Get current state and category context
  const { state, category, country } = useStateAndCategory();

  // Use current country and state, with fallbacks
  const profileCountry = country || "in";
  const profileState = state || (profileCountry === "in" ? "bangalore" : "dubai");

  // Use the useUserActions hook
  const {
    useUserSavedVehicles,
    extractSavedVehicles,
    removeFromSaved,
    removeFromSavedMutation,
  } = useUserActions();

  const {
    data: savedVehiclesApiResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserSavedVehicles({
    userId: userId!,
    enabled: !!userId,
    page,
    limit: 20,
  });

  // Extract the saved vehicles data using the extraction function
  const savedVehicles = React.useMemo(() => {
    const extracted = savedVehiclesApiResponse
      ? extractSavedVehicles(savedVehiclesApiResponse)
      : [];
    return extracted;
  }, [savedVehiclesApiResponse, extractSavedVehicles]);

  // Filter and sort vehicles
  const filteredVehicles = savedVehicles
    .filter((vehicle: any) => {
      const matchesSearch =
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || vehicle.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "recent":
        default:
          return 0; // Keep original order for recent
      }
    });

  // Helper function to transform saved vehicle data to VehicleCard format
  const transformToVehicleCardData = (vehicle: any): NewVehicleCardType => {
    return {
      vehicleTitle: vehicle.name || "Unknown Vehicle",
      vehicleCode: vehicle.vehicleCode || vehicle.id,
      state: vehicle?.originalData?.stateDetails?.stateValue || "",
      vehicleCategory: category || "cars",
      thumbnail: vehicle.image || "/default-car.png",
      vehiclePhotos: vehicle.image ? [vehicle.image] : [],
      rating: vehicle.rating || 0,
      rentalDetails: {
        day: {
          enabled: true,
          rentInAED: vehicle.price?.toString() || "0",
          mileageLimit: "250",
        },
      },
      securityDeposit: {
        enabled: false,
      },
      isFancyNumber: false,
    } as NewVehicleCardType;
  };

  // Helper function to generate vehicle details URL
  const getVehicleDetailsUrl = (vehicle: any) => {
    const currentCategory = category || "cars";
    const vehicleCode = vehicle.vehicleCode || vehicle.id;

    const navRoute = generateVehicleDetailsUrl({
      vehicleTitle: vehicle.name || vehicle.model || "vehicle",
      state: vehicle?.originalData?.stateDetails?.stateValue,
      vehicleCategory: currentCategory,
      vehicleCode,
      country: vehicle?.originalData?._metadata?.countryCode,
    });

    return navRoute;
  };

  const handleRemoveFromSaved = async (vehicleId: string) => {
    try {
      await removeFromSaved(vehicleId);
      // Refetch the data after successful removal
      refetch();
    } catch (error) {
      console.error("Failed to remove from saved:", error);
      // Handle the error - for now the API endpoint doesn't exist yet
      alert(
        "Remove from saved functionality is not yet implemented in the backend"
      );
    }
  };

  // Early return if no user is logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-8 sm:py-12 text-center px-4">
            <Heart className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">
              Please log in to view your saved vehicles
            </h3>
            <p className="mb-4 text-sm sm:text-base text-gray-600">
              Sign in to see the vehicles you&apos;ve saved for later
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-4">
            <Link href={`/${profileCountry}/${profileState}/user-profile`}>
              <Button variant="ghost" size="sm" className="cursor-pointer h-8 sm:h-9 px-2 sm:px-3">
                <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Back to Profile</span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Saved Vehicles
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Find your Favorites Saved for Later​
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {savedVehicles.length}
              </span>
              <span className="text-sm sm:text-base text-gray-600">saved</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full cursor-pointer sm:w-48 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Saved</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full cursor-pointer sm:w-48 h-9 sm:h-10 text-sm sm:text-base">
                <Filter className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-orange-500" />
              <span className="text-sm sm:text-base text-gray-600">Loading saved vehicles...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-8 sm:py-12 text-center px-4">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">
              Failed to load saved vehicles
            </h3>
            <p className="mb-4 text-sm sm:text-base text-gray-600 px-2">
              There was an error loading your saved vehicles. Please try again.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mb-4 text-xs sm:text-sm text-red-600 px-2">
                Error: {error?.message || "Unknown error"}
              </p>
            )}
            <Button
              onClick={() => {
                refetch();
              }}
              className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600 h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVehicles.map((vehicle: any, index: number) => (
              <div key={vehicle.id} className="relative w-full">
                <VehicleCard
                  vehicle={transformToVehicleCardData(vehicle)}
                  index={index}
                  country={vehicle?.originalData?._metadata?.countryCode || profileCountry}
                  layoutType="grid"
                  openInNewTab={false}
                />
                {/* Heart Icon - Absolute positioned on right */}
                <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFromSaved(vehicle.id);
                    }}
                    disabled={removeFromSavedMutation.isPending}
                    className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer rounded-full bg-white/90 p-0 shadow-lg hover:bg-red-50 transition-colors touch-manipulation"
                    aria-label="Remove from saved"
                  >
                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredVehicles.length === 0 && (
          <div className="py-8 sm:py-12 text-center px-4">
            <Heart className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900">
              No saved vehicles found
            </h3>
            <p className="mb-4 text-sm sm:text-base text-gray-600 px-2">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Start browsing to save your favorite vehicles"}
            </p>
            <Link href={`/${profileCountry}/${profileState}/${category || "cars"}`}>
              <Button className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600 h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base">
                Browse Vehicles
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVehicles;
