"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Shield,
  CheckCircle,
  X,
  User,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";
import { VehicleDetailsData } from "@/types/car.rent.type";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  vehicleData?: VehicleDetailsData;
  isProcessing?: boolean;
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleData,
  isProcessing = false,
}: BookingConfirmationModalProps) {
  const [step, setStep] = useState<"confirmation" | "success">("confirmation");

  console.log("vehicleData: ", vehicleData);

  // Default data fallback
  const bookingData = vehicleData || {
    carName: "Ford Mustang GT 2024",
    carImage: "/ford-mustang-gt-2024.jpg",
    startDate: "Sep 15, 2025",
    endDate: "Sep 18, 2025",
    totalDays: 3,
    pricePerDay: 250,
    totalPrice: 750,
    location: "Dubai, UAE",
    // insurance: 50, // commented out for now
    // serviceFee: 25, // commented out for now
    customer: {
      name: "",
      phone: "",
      email: "",
      // paymentMethod: "**** **** **** 1234", // commented out for now
    },
    pickupTime: "10:00 AM",
    returnTime: "10:00 AM",
  };

  const handleConfirmBooking = async () => {
    if (onConfirm) {
      onConfirm();
    } else {
      // Default behavior - simulate booking process
      setStep("success");
    }
  };

  const handleClose = () => {
    setStep("confirmation");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("confirmation");
    }
  }, [isOpen]);

  return (
    //
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {step === "confirmation" ? (
          <>
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
                  Confirm Your Booking
                </DialogTitle>
                {/* <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button> */}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4 text-orange-500" />
                <span>Ride.Rent - Premium Car Rental</span>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Car Details */}
              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4">
                <div className="flex gap-4">
                  <img
                    src={bookingData.carImage || "/placeholder.svg"}
                    alt={bookingData.carName}
                    className="h-16 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {bookingData.carName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{bookingData.location}</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Badge className="bg-orange-100 text-xs text-orange-700 hover:bg-orange-200">
                        <Shield className="mr-1 h-3 w-3" />
                        Insured
                      </Badge>
                      <Badge className="bg-green-100 text-xs text-green-700 hover:bg-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Pickup Date</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData.startDate}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Pickup Time</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData.pickupTime || "10:00 AM"}
                      </p>
                    </div>
                  </div> */}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Return Date</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData.endDate}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Return Time</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingData.returnTime || "10:00 AM"}
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              <Separator />

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">Customer Details</h4>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-orange-500" />
                    <span>{bookingData.customer?.name || "John Doe"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-orange-500" />
                    <span>
                      {bookingData.customer?.phone || "+971 50 123 4567"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-orange-500" />
                    <span>
                      {bookingData.customer?.email || "john.doe@email.com"}
                    </span>
                  </div>
                  {/* Payment method - commented out for now, can be enabled in future */}
                  {/* <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                    <span>
                      {bookingData.customer?.paymentMethod ||
                        "**** **** **** 1234"}
                    </span>
                  </div> */}
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              {/* <div className="space-y-4">
                <h4 className="font-semibold">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Car rental ({bookingData.totalDays} days)</span>
                    <span>
                      {bookingData.pricePerDay} AED × {bookingData.totalDays}
                    </span>
                  </div>
                  {/* Insurance and Service fee - commented out for now, can be enabled in future */}
              {/* <div className="flex justify-between">
                    <span>Insurance</span>
                    <span>{bookingData.insurance || 50} AED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>{bookingData.serviceFee || 25} AED</span>
                  </div> */}
              {/* <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Rental charges (approx.)</span>
                    <span className="text-orange-600">
                      {bookingData.totalPrice} AED
                    </span>
                  </div>
                </div> */}
              {/* </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent text-orange-600 hover:bg-orange-50"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </div>
                  ) : (
                    // `Confirm Booking - ${bookingData.totalPrice} AED`
                    `Send enquiry`
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="space-y-6 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="text-muted-foreground">
                  Your {bookingData.carName} has been successfully booked.
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4 text-left">
                <h3 className="mb-2 font-semibold">Booking Reference</h3>
                <p className="font-mono text-2xl font-bold text-orange-600">
                  RR-{Date.now().toString().slice(-6)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save this reference number for your records
                </p>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  📧 Confirmation email sent to{" "}
                  {bookingData.customer?.email || "john.doe@email.com"}
                </p>
                <p>
                  📱 SMS confirmation sent to{" "}
                  {bookingData.customer?.phone || "+971 50 123 4567"}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-orange-200 bg-transparent text-orange-600 hover:bg-orange-50"
                >
                  Close
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
                  View My Bookings
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
