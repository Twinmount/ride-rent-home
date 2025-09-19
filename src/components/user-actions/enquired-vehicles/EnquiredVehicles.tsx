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
} from "lucide-react";
import Link from "next/link";
import { getUserEnquiredVehicles } from "@/lib/api/userActions.api";
import { authStorage } from "@/lib/auth";

// Types for the API response
interface VehicleSpecs {
  [key: string]: {
    name: string;
    value: string;
    selected: boolean;
    hoverInfo?: string;
  };
}

interface VehicleFeatures {
  [category: string]: Array<{
    name: string;
    value: string;
    selected: boolean;
  }>;
}

interface RentalDetails {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
  };
  hour: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    unlimitedMileage: boolean;
    minBookingHours: string;
  };
}

interface VehicleDetails {
  _id: string;
  brandId: string;
  vehicleTypeId: string;
  vehicleCategoryId: string;
  vehicleModel: string;
  registredYear: string;
  stateId: string;
  cityIds: string[];
  vehiclePhotos: string[];
  vehicleVideos: string[];
  comercialLicense: string[];
  isDisabled: boolean;
  isModifiedData: boolean;
  newRegistration: boolean;
  vehicleRegistrationNumber: string;
  isFancyNumber: boolean;
  vehicleSpefication: string;
  rentalDetails: RentalDetails;
  levelsFilled: number;
  companyId: string;
  vehicleCode: string;
  commercialLicenseExpiryDate: string;
  approvalStatus: string;
  isCryptoAccepted: boolean;
  isTabbySupported: boolean;
  isCashSupported: boolean;
  isVehicleModified: boolean;
  isCreditOrDebitCardsSupported: boolean;
  securityDeposits: {
    enabled: boolean;
    amountInAED: string;
  };
  additionalVehicleTypes: string[];
  isSpotDeliverySupported: boolean;
  isAvailableForLease: boolean;
  countryCode: string;
  phoneNumber: string;
  rank: number;
  mapImage: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  __v: number;
  description: string;
  disablePriceMatching: boolean;
  disabledBy: string;
  rejectionReason: string;
  vehicleFeatures: VehicleFeatures;
  vehicleMetaDescription: string;
  vehicleMetaTitle: string;
  vehicleSpecs: VehicleSpecs;
  vehicleTitle: string;
  vehicleTitleH1: string;
}

interface EnquiryInfo {
  enquiredAt: string;
  notes: string;
  enquiryId: string;
}

interface EnquiredVehicle {
  _id: string;
  type: string;
  userId: string;
  carId: string;
  actionAt: string;
  notes: string;
  enquiryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vehicleSummary: Record<string, any>;
  enquiryInfo: EnquiryInfo;
  vehicleDetails: VehicleDetails;
}

interface APIResponse {
  status: string;
  result: {
    list: EnquiredVehicle[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  statusCode: number;
}

export default function EnquiredVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [enquiredVehicles, setEnquiredVehicles] = useState<EnquiredVehicle[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  // Fetch enquired vehicles from API
  const fetchEnquiredVehicles = async (page: number = 0) => {
    try {
      setLoading(true);

      // Get user from auth storage
      const user = authStorage.getUser();
      if (!user || !user.id) {
        setError("Please log in to view your enquiries");
        return;
      }

      const response = await getUserEnquiredVehicles(user.id, page, 10, "DESC");

      if (response.status === "SUCCESS") {
        setEnquiredVehicles(response.result.list || []);
        setTotalEnquiries(response.result.total || 0);
        setTotalPages(response.result.totalNumberOfPages || 0);
        setCurrentPage(page);
      } else {
        throw new Error("Failed to fetch enquired vehicles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching enquired vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiredVehicles(0);
  }, []);

  // Helper function to get vehicle image URL
  const getVehicleImage = (photos: string[]) => {
    if (photos && photos.length > 0) {
      // Assuming you have a base URL for your images
      const baseUrl =
        process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "";
      return `${baseUrl}/api/images/${photos[0]}`;
    }
    return "/placeholder.svg";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Helper function to get status (for now, we'll determine status based on enquiry age)
  const getStatus = (enquiredAt: string) => {
    const enquiryDate = new Date(enquiredAt);
    const now = new Date();
    const diffHours =
      (now.getTime() - enquiryDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) return "pending";
    if (diffHours < 72) return "responded";
    if (diffHours > 168) return "booked"; // After 1 week, consider it might be booked
    return "pending"; // Default status
  };

  // Helper function to get rental price
  const getRentalPrice = (rentalDetails: RentalDetails) => {
    if (rentalDetails.day.enabled) return rentalDetails.day.rentInAED;
    if (rentalDetails.week.enabled) return rentalDetails.week.rentInAED;
    if (rentalDetails.month.enabled) return rentalDetails.month.rentInAED;
    if (rentalDetails.hour.enabled) return rentalDetails.hour.rentInAED;
    return "0";
  };

  // Helper function to get rental period
  const getRentalPeriod = (rentalDetails: RentalDetails) => {
    if (rentalDetails.day.enabled) return "day";
    if (rentalDetails.week.enabled) return "week";
    if (rentalDetails.month.enabled) return "month";
    if (rentalDetails.hour.enabled) return "hour";
    return "day";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "booked":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "responded":
        return <Mail className="h-3 w-3" />;
      case "booked":
        return <Calendar className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const filteredVehicles = enquiredVehicles
    .filter((vehicle) => {
      const vehicleName = vehicle.vehicleDetails.vehicleModel;
      const vehicleRegNumber = vehicle.vehicleDetails.vehicleRegistrationNumber;
      const vehicleCode = vehicle.vehicleDetails.vehicleCode;
      const status = getStatus(vehicle.enquiryInfo.enquiredAt);

      const matchesSearch =
        vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicleRegNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicleCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.enquiryInfo.enquiredAt).getTime() -
            new Date(a.enquiryInfo.enquiredAt).getTime()
          );
        case "price-low":
          const priceA = parseInt(
            getRentalPrice(a.vehicleDetails.rentalDetails)
          );
          const priceB = parseInt(
            getRentalPrice(b.vehicleDetails.rentalDetails)
          );
          return priceA - priceB;
        case "price-high":
          const priceA2 = parseInt(
            getRentalPrice(a.vehicleDetails.rentalDetails)
          );
          const priceB2 = parseInt(
            getRentalPrice(b.vehicleDetails.rentalDetails)
          );
          return priceB2 - priceA2;
        case "status":
          const statusA = getStatus(a.enquiryInfo.enquiredAt);
          const statusB = getStatus(b.enquiryInfo.enquiredAt);
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

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
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-16 w-16 text-red-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {error.includes("log in")
                  ? "Authentication Required"
                  : "Error loading enquiries"}
              </h3>
              <p className="mb-4 text-gray-600">{error}</p>
              {error.includes("log in") ? (
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
            <Link href="/profile">
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search enquiries..."
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
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enquiries List */}
        <div className="space-y-6">
          {filteredVehicles.map((vehicle) => {
            const status = getStatus(vehicle.enquiryInfo.enquiredAt);
            const price = getRentalPrice(vehicle.vehicleDetails.rentalDetails);
            const period = getRentalPeriod(
              vehicle.vehicleDetails.rentalDetails
            );
            const vehicleImage = getVehicleImage(
              vehicle.vehicleDetails.vehiclePhotos
            );
            const enquiredDate = formatDate(vehicle.enquiryInfo.enquiredAt);

            return (
              <Card
                key={vehicle._id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Vehicle Image */}
                    <div className="flex-shrink-0 lg:w-64">
                      <img
                        src={vehicleImage}
                        alt={vehicle.vehicleDetails.vehicleModel}
                        className="h-40 w-full rounded-lg object-cover lg:h-32"
                      />
                    </div>

                    {/* Vehicle Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 text-xl font-semibold text-gray-900">
                            {vehicle.vehicleDetails.vehicleModel}{" "}
                            {vehicle.vehicleDetails.registredYear}
                          </h3>
                          <p className="mb-2 text-gray-600">
                            {vehicle.vehicleDetails.vehicleCode} •{" "}
                            {vehicle.vehicleDetails.vehicleRegistrationNumber}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {vehicle.vehicleDetails.vehicleSpefication ===
                              "UAE_SPEC"
                                ? "UAE"
                                : "International"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-400 h-4 w-4 fill-current" />
                              {vehicle.vehicleDetails.rank}/5
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {enquiredDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 text-2xl font-bold text-orange-600">
                            {price} AED
                            <span className="text-sm font-normal text-gray-500">
                              /{period}
                            </span>
                          </div>
                          <Badge
                            className={`${getStatusColor(status)} capitalize`}
                          >
                            {getStatusIcon(status)}
                            <span className="ml-1">{status}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Enquiry Details */}
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 font-medium text-gray-900">
                          Enquiry Details
                        </h4>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                          <div>
                            <span className="text-gray-500">Enquiry ID:</span>
                            <p className="font-medium">
                              {vehicle.enquiryInfo.enquiryId.split("-")[0]}...
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Vehicle Type:</span>
                            <p className="font-medium">
                              {vehicle.vehicleDetails.vehicleSpecs?.[
                                "Body Type"
                              ]?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Approval Status:
                            </span>
                            <p className="font-medium capitalize">
                              {vehicle.vehicleDetails.approvalStatus.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-gray-500">Your Message:</span>
                          <p className="mt-1 text-gray-900">
                            {vehicle.enquiryInfo.notes || vehicle.notes}
                          </p>
                        </div>
                        {/* Vehicle Specifications Preview */}
                        <div className="mt-4">
                          <span className="text-gray-500">Key Features:</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {vehicle.vehicleDetails.vehicleSpecs?.[
                              "Seating Capacity"
                            ] && (
                              <Badge variant="outline" className="text-xs">
                                {
                                  vehicle.vehicleDetails.vehicleSpecs[
                                    "Seating Capacity"
                                  ].name
                                }
                              </Badge>
                            )}
                            {vehicle.vehicleDetails.vehicleSpecs?.[
                              "Fuel Type"
                            ] && (
                              <Badge variant="outline" className="text-xs">
                                {
                                  vehicle.vehicleDetails.vehicleSpecs[
                                    "Fuel Type"
                                  ].name
                                }
                              </Badge>
                            )}
                            {vehicle.vehicleDetails.vehicleSpecs?.[
                              "Transmission"
                            ] && (
                              <Badge variant="outline" className="text-xs">
                                {
                                  vehicle.vehicleDetails.vehicleSpecs[
                                    "Transmission"
                                  ].name
                                }
                              </Badge>
                            )}
                            {vehicle.vehicleDetails.isSpotDeliverySupported && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-xs text-green-700"
                              >
                                Spot Delivery
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Vendor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer bg-transparent"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call: {vehicle.vehicleDetails.countryCode}{" "}
                          {vehicle.vehicleDetails.phoneNumber}
                        </Button>
                        {status === "responded" && (
                          <Button
                            size="sm"
                            className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                          >
                            View Response
                          </Button>
                        )}
                        {status === "booked" && (
                          <Button
                            size="sm"
                            className="cursor-pointer bg-green-500 text-white hover:bg-green-600"
                          >
                            View Booking Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
              onClick={() => fetchEnquiredVehicles(currentPage - 1)}
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
              onClick={() => fetchEnquiredVehicles(currentPage + 1)}
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
