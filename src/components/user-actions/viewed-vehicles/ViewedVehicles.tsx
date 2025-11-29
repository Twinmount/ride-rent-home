"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, Filter, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUserActions } from "@/hooks/useUserActions";
import { generateVehicleDetailsUrl } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import { NewVehicleCardType } from "@/types/vehicle-types";

const ViewedVehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  // Use the useUserActions hook
  const { useUserViewedVehicles, extractViewedVehicles, userId } =
    useUserActions();

  // Get current state and category context
  const { category, country, state } = useStateAndCategory();

  // Use current country and state, with fallbacks
  const profileCountry = country || "in";
  const profileState = state || (profileCountry === "in" ? "bangalore" : "dubai");

  // Get viewed vehicles data - only call when this component is mounted
  const viewedVehiclesQuery = useUserViewedVehicles({
    userId: userId!,
    page: 0,
    limit: 20,
    sortOrder: "DESC",
    enabled: !!userId, // Only enable when userId is available
  });

  // Use the viewed vehicles data directly
  const viewedVehicles = viewedVehiclesQuery.data
    ? (extractViewedVehicles(viewedVehiclesQuery.data) ?? [])
    : [];

  console.log("viewedVehiclesQuery.data: ", viewedVehiclesQuery.data);

  const isLoading = viewedVehiclesQuery.isLoading;

  // Helper function to transform viewed vehicle data to VehicleCard format
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
      country: vehicle?.originalData?._metadata.countryCode,
    });

    return navRoute;
  };

  // Early return if no user is logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <Eye className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Please log in to view your browsing history
            </h3>
            <p className="mb-4 text-gray-600">
              Sign in to see the vehicles you&apos;ve recently viewed
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort vehicles
  const filteredVehicles = viewedVehicles
    ?.filter((vehicle: any) => {
      const matchesSearch =
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || vehicle.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "most-viewed":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "recent":
        default:
          return 0; // Keep original order for recent
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link href={`/${profileCountry}/${profileState}/user-profile`}>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Recently Viewed
              </h1>
              <p className="text-gray-600">Revisit What You Viewed Before​</p>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">
                {viewedVehicles.length}
              </span>
              <span className="text-gray-600">viewed</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search viewed experiences​."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full cursor-pointer sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Viewed</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full cursor-pointer sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              <span className="text-gray-600">Loading viewed vehicles...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {viewedVehiclesQuery.error && !isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Eye className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Failed to load viewed vehicles
            </h3>
            <p className="mb-4 text-gray-600">
              There was an error loading your viewing history. Please try again.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mb-4 text-sm text-red-600">
                Error: {viewedVehiclesQuery.error?.message || "Unknown error"}
              </p>
            )}
            <Button
              onClick={() => {
                viewedVehiclesQuery.refetch();
              }}
              className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!isLoading && !viewedVehiclesQuery.error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredVehicles.map((vehicle: any, index: number) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={transformToVehicleCardData(vehicle)}
                index={index}
                country={vehicle?.originalData?._metadata?.countryCode || "ae"}
                layoutType="grid"
                openInNewTab={false}
              />
            ))}
          </div>
        )}

        {!isLoading &&
          !viewedVehiclesQuery.error &&
          filteredVehicles.length === 0 && (
            <div className="py-12 text-center">
              <Eye className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No viewed vehicles found
              </h3>
              <p className="mb-4 text-gray-600">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start browsing to see your viewing history"}
              </p>
              <Link href={`/${profileCountry}/${profileState}/${category || "cars"}`}>
                <Button className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600">
                  Browse Vehicles
                </Button>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default ViewedVehicles;
