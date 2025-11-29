"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import { getUserEnquiredVehicles } from "@/lib/api/userActions.api";
import { authStorage } from "@/lib/auth";
import { ENV } from "@/config/env";
import {
  getPrimaryVehicleImageUrl,
  getVehicleImageUrl,
} from "@/utils/imageUrl";
import { useUserActions } from "@/hooks/useUserActions";
import { generateVehicleDetailsUrl, getRentalPeriodDetails } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import type {
  RawVehicleEnquiry,
  EnquiredVehiclesApiResponse,
  VehiclePhoto,
  RentDetails,
} from "@/types/userActions.types";
import { usePriceConverter } from "@/hooks/usePriceConverter";

// Add custom CSS for line clamping
const lineClampStyles = `
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles into head
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = lineClampStyles;
  document.head.appendChild(style);
}

export default function EnquiredVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use the useUserActions hook
  const { useUserEnquiredVehicles } = useUserActions();

  // Get current state and category from the hook
  const { category, country, state } = useStateAndCategory();

  // Use current country and state, with fallbacks
  const profileCountry = country || "in";
  const profileState = state || (profileCountry === "in" ? "bangalore" : "dubai");
  // const { convert } = usePriceConverter();
  const {
    data: apiResponse,
    isLoading: loading,
    error,
    refetch,
  } = useUserEnquiredVehicles({
    page: currentPage,
    limit: 10,
    sortOrder: "DESC",
  });

  // Extract vehicles from API response
  const enquiredVehicles: RawVehicleEnquiry[] = apiResponse?.result?.data || [];

  useEffect(() => {
    if (apiResponse?.result) {
      setTotalEnquiries(apiResponse.result.total || 0);
      setTotalPages(Math.ceil((apiResponse.result.total || 0) / 10));
    }
  }, [apiResponse]);

  // Real-time update for NEW enquiries status
  useEffect(() => {
    const hasNewEnquiries = enquiredVehicles.some(
      (vehicle: RawVehicleEnquiry) => vehicle.enquiryStatus === "NEW"
    );

    if (!hasNewEnquiries) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Force a re-render to update the timer and status
      refetch();
    }, 30000); // Update every 30 seconds for more responsive timer

    return () => clearInterval(interval);
  }, [enquiredVehicles, refetch]);

  // Manual refetch function for pagination
  const fetchEnquiredVehiclesPage = async (page: number = 0) => {
    setCurrentPage(page);
    // The query will automatically refetch when currentPage changes
  };

  // Helper function to get vehicle image URL
  const getVehicleImage = (photos: VehiclePhoto[]) => {
    if (photos && photos.length > 0) {
      // Use signed URL if available, otherwise use original path
      return (
        photos[0].signedUrl || photos[0].originalPath || "/placeholder.svg"
      );
    }
    return "/placeholder.svg";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Helper function to get status based on enquiryStatus and time
  const getStatus = (enquiredAt: string, enquiryStatus: string) => {
    const enquiryDate = new Date(enquiredAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - enquiryDate.getTime()) / (1000 * 60);
    const diffHours = diffMinutes / 60;

    // Handle explicit statuses - these are not affected by time
    if (enquiryStatus === "NEW") return "pending";
    if (enquiryStatus === "CONTACTED") return "contacted";
    if (enquiryStatus === "AGENTVIEW") return "agentview";
    if (enquiryStatus === "EXPIRED") return "expired";
    if (enquiryStatus === "CANCELLED") return "cancelled";
    if (enquiryStatus === "DECLINED") return "declined";
    if (enquiryStatus === "RESPONDED") return "responded";
    if (enquiryStatus === "BOOKED") return "booked";
    if (enquiryStatus === "PENDING") return "pending";

    return "pending"; // Default status
  };

  // Helper function to get rental price
  const getRentalPrice = (rentDetails: RentDetails) => {
    if (rentDetails.day.enabled) return rentDetails.day.rentInAED;
    if (rentDetails.week.enabled) return rentDetails.week.rentInAED;
    if (rentDetails.month.enabled) return rentDetails.month.rentInAED;
    if (rentDetails.hour.enabled) return rentDetails.hour.rentInAED;
    return "0";
  };

  // Helper function to get rental period
  const getRentalPeriod = (rentDetails: RentDetails) => {
    if (rentDetails.day.enabled) return "day";
    if (rentDetails.week.enabled) return "week";
    if (rentDetails.month.enabled) return "month";
    if (rentDetails.hour.enabled) return "hour";
    return "day";
  };

  // Helper function to generate vehicle details URL
  const getVehicleDetailsUrl = (vehicle: RawVehicleEnquiry) => {
    const currentCategory = category || "cars";
    const vehicleCode = vehicle?.vehicleDetails?.vehicleCode; // Use carId as vehicleCode since vehicleCode is not available in RawVehicleEnquiry

    const navRoute = generateVehicleDetailsUrl({
      vehicleTitle: vehicle.vehicleDetails.model,
      state: vehicle?.stateDetails?.stateValue,
      vehicleCategory: currentCategory,
      vehicleCode,
      country: vehicle?._metadata?.countryCode,
    });

    return navRoute;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return " text-yellow-400 border-yellow-300";
      case "contacted":
        return " text-blue-400 border-blue-300";
      case "agentview":
        return " text-purple-400 border-purple-300";
      case "expired":
        return " text-gray-400 border-gray-300";
      case "responded":
        return " text-green-400 border-green-300";
      case "booked":
        return " text-emerald-400 border-emerald-300";
      case "cancelled":
        return " text-red-400 border-red-300";
      case "declined":
        return " text-orange-400 border-orange-300";
      default:
        return " text-gray-400 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "contacted":
        return <Phone className="h-3 w-3" />;
      case "agentview":
        return <MessageSquare className="h-3 w-3" />;
      case "expired":
        return <Clock className="h-3 w-3" />;
      case "responded":
        return <Mail className="h-3 w-3" />;
      case "booked":
        return <Calendar className="h-3 w-3" />;
      case "cancelled":
        return <X className="h-3 w-3" />;
      case "declined":
        return <X className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  // Helper function to get remaining time before cancellation for NEW enquiries
  const getRemainingTime = (enquiredAt: string, enquiryStatus: string) => {
    if (enquiryStatus !== "NEW") return null;

    const enquiryDate = new Date(enquiredAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - enquiryDate.getTime()) / (1000 * 60);
    const remainingMinutes = 30 - diffMinutes;

    if (remainingMinutes <= 0) return "Expired";

    if (remainingMinutes < 1) {
      return `${Math.floor(remainingMinutes * 60)}s left`;
    }

    return `${Math.floor(remainingMinutes)}m left`;
  };

  const filteredVehicles = enquiredVehicles
    .filter((vehicle: RawVehicleEnquiry) => {
      const vehicleName = vehicle.vehicleDetails.model;
      const vehicleRegNumber = vehicle.vehicleDetails.registrationNumber;
      const vehicleCode = vehicle.vehicleDetails.carId; // Using carId as vehicleCode
      const status = getStatus(vehicle.enquiredAt, vehicle.enquiryStatus);

      const matchesSearch =
        vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicleRegNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicleCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a: RawVehicleEnquiry, b: RawVehicleEnquiry) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.enquiredAt).getTime() - new Date(a.enquiredAt).getTime()
          );
        case "price-low":
          const priceA = parseInt(getRentalPrice(a.rentDetails));
          const priceB = parseInt(getRentalPrice(b.rentDetails));
          return priceA - priceB;
        case "price-high":
          const priceA2 = parseInt(getRentalPrice(a.rentDetails));
          const priceB2 = parseInt(getRentalPrice(b.rentDetails));
          return priceB2 - priceA2;
        case "status":
          const statusA = getStatus(a.enquiredAt, a.enquiryStatus);
          const statusB = getStatus(b.enquiredAt, b.enquiryStatus);
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

  console.log("filteredVehicles: ", filteredVehicles);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="text-gray-600">Loading your enquiries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-16 w-16 text-red-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {errorMessage.includes("log in")
                  ? "Authentication Required"
                  : "Error loading enquiries"}
              </h3>
              <p className="mb-4 text-gray-600">{errorMessage}</p>
              {errorMessage.includes("log in") ? (
                <Link href="/auth/login">
                  <Button className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600">
                    Go to Login
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => window.location.reload()}
                  className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                My Enquiries
              </h1>
              <p className="text-gray-600">
                Track your rental enquiries and responses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {loading ? "..." : totalEnquiries}
              </span>
              <span className="text-gray-600">enquiries</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search by vehicle name, registration, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full cursor-pointer sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full cursor-pointer sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="agentview">Agent View</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enquiries List - Card Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filteredVehicles.map((vehicle: RawVehicleEnquiry) => {
            const status = getStatus(vehicle.enquiredAt, vehicle.enquiryStatus);
            const price = getRentalPrice(vehicle.rentDetails);
            const period = getRentalPeriod(vehicle.rentDetails);
            const vehicleImage = getVehicleImage(vehicle.vehicleDetails.photos);
            const enquiredDate = formatDate(vehicle.enquiredAt);

            return (
              <Card
                key={vehicle._id}
                className={`group overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  vehicle.enquiryStatus === "NEW" && status === "pending"
                    ? "border-yellow-300 ring-yellow-200 shadow-lg ring-2 ring-opacity-50"
                    : status === "cancelled" || status === "declined"
                      ? "border-red-200 bg-red-50/30"
                      : status === "expired"
                        ? "border-gray-200 bg-gray-50/30"
                        : status === "contacted"
                          ? "border-blue-200 bg-blue-50/30"
                          : status === "agentview"
                            ? "border-purple-200 bg-purple-50/30"
                            : "border-gray-200"
                }`}
              >
                <div className="relative">
                  {/* Vehicle Image - Clickable */}
                  <Link href={getVehicleDetailsUrl(vehicle)}>
                    <div className="relative h-44 w-full cursor-pointer overflow-hidden sm:h-48">
                      <img
                        src={vehicleImage}
                        alt={vehicle.vehicleDetails.model}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (
                            vehicle.vehicleDetails.photos.length > 1 &&
                            !target.src.includes("placeholder")
                          ) {
                            const nextImageIndex =
                              vehicle.vehicleDetails.photos.findIndex(
                                (photo: VehiclePhoto) =>
                                  target.src.includes(photo.originalPath)
                              ) + 1;
                            if (
                              nextImageIndex <
                              vehicle.vehicleDetails.photos.length
                            ) {
                              target.src =
                                vehicle.vehicleDetails.photos[nextImageIndex]
                                  .signedUrl ||
                                vehicle.vehicleDetails.photos[nextImageIndex]
                                  .originalPath;
                              return;
                            }
                          }
                          target.src = "/placeholder.svg";
                        }}
                      />

                      {/* Price Badge */}
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                        <div className="rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm sm:px-3">
                          <span className="text-base font-bold text-orange-600 sm:text-lg">
                            {price} AED
                          </span>
                          <span className="text-xs text-gray-500 sm:text-sm">
                            /{period}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <CardContent className="p-3 sm:p-4">
                  {/* Vehicle Title */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between bg-transparent">
                      <Link href={getVehicleDetailsUrl(vehicle)}>
                        <h3 className="line-clamp-1 cursor-pointer text-base font-semibold text-gray-900 transition-colors hover:text-orange-600 sm:text-lg">
                          {vehicle.vehicleDetails.model}{" "}
                          {vehicle.vehicleDetails.year}
                        </h3>
                      </Link>
                      {/* Status Badge */}
                      <Badge
                        style={{ backgroundColor: "transparent" }}
                        className={`${getStatusColor(status)} border text-xs capitalize shadow-md ${
                          vehicle.enquiryStatus === "NEW" &&
                          status === "pending"
                            ? "ring-yellow-400 animate-pulse ring-2 ring-opacity-50"
                            : ""
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                        {vehicle.enquiryStatus === "NEW" &&
                          status === "pending" && (
                            <span className="ml-1 text-xs font-bold">NEW!</span>
                          )}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                      {vehicle.vehicleDetails.registrationNumber}
                    </p>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-3 flex items-center justify-between text-xs text-gray-500 sm:mb-4">
                    {/* <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>UAE</span>
                    </div> */}
                    {/* <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 h-3 w-3 fill-current" />
                      <span>4.8</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">{enquiredDate}</span>
                    </div>
                  </div>

                  {/* Enquiry Details */}
                  <div className="mb-3 rounded-lg bg-gray-50 p-2 sm:mb-4 sm:p-3">
                    {/* <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        Enquiry ID
                      </span>
                      <span className="text-xs text-gray-500">
                        {vehicle.enquiryId.split("-")[0]}...
                      </span>
                    </div> */}
                    {/* Show timer for NEW enquiries */}
                    {/* {vehicle.enquiryStatus === "NEW" &&
                      status === "pending" && (
                        <div className="bg-yellow-50 border-yellow-200 mb-2 flex items-center justify-between rounded-md border p-2">
                          <span className="text-yellow-800 text-xs font-medium">
                            Auto-cancel in:
                          </span>
                          <span className="text-yellow-800 text-xs font-bold">
                            {getRemainingTime(
                              vehicle.enquiredAt,
                              vehicle.enquiryStatus
                            )}
                          </span>
                        </div>
                      )} */}
                    <div className="line-clamp-2 text-xs text-gray-600">
                      {vehicle.enquiryMessage}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0.5 text-xs"
                      >
                        {vehicle.vehicleDetails.model}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0.5 text-xs"
                      >
                        {vehicle.vehicleDetails.year}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-green-50 px-1.5 py-0.5 text-xs text-green-700"
                      >
                        Available
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {status === "cancelled" ||
                    status === "declined" ||
                    status === "expired" ? (
                      <Button
                        size="sm"
                        disabled
                        className={`h-8 w-full cursor-not-allowed text-xs ${
                          status === "expired"
                            ? "bg-gray-100 text-gray-800"
                            : status === "declined"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status === "expired" ? (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            Enquiry Expired
                          </>
                        ) : status === "declined" ? (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            Enquiry Declined
                          </>
                        ) : (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            Enquiry Cancelled
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Link
                          href={getVehicleDetailsUrl(vehicle)}
                          className="w-full flex-1"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-full flex-1 cursor-pointer text-xs"
                          >
                            <span className="hidden sm:inline">
                              View details
                            </span>
                            <span className="sm:hidden">Details</span>
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Additional Action Buttons for Status */}
                  {(status === "contacted" ||
                    status === "responded" ||
                    status === "booked" ||
                    status === "agentview") && (
                    <div className="mt-2">
                      {status === "contacted" && (
                        <Button
                          size="sm"
                          className="h-8 w-full bg-blue-500 text-xs text-white hover:bg-blue-600"
                        >
                          Agent Contacted You
                        </Button>
                      )}
                      {status === "agentview" && (
                        <Button
                          size="sm"
                          className="h-8 w-full bg-purple-500 text-xs text-white hover:bg-purple-600"
                        >
                          Agent Viewed Enquiry
                        </Button>
                      )}
                      {status === "responded" && (
                        <Button
                          size="sm"
                          className="h-8 w-full bg-green-500 text-xs text-white hover:bg-green-600"
                        >
                          View Response
                        </Button>
                      )}
                      {status === "booked" && (
                        <Button
                          size="sm"
                          className="h-8 w-full bg-emerald-500 text-xs text-white hover:bg-emerald-600"
                        >
                          Booking Details
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchEnquiredVehiclesPage(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <span className="mx-4 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchEnquiredVehiclesPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}

        {filteredVehicles.length === 0 && !loading && (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No enquiries found
            </h3>
            <p className="mb-4 text-gray-600">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Start browsing vehicles and make your first enquiry"}
            </p>
            <Link href="/">
              <Button className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600">
                Browse Vehicles
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
