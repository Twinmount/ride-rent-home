'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import { useVehicleCardContext } from '@/context/VehicleCardContext';

interface BookingPopupProps {
  onComplete?: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
  onConfirmBooking?: (message?: string) => void;
  isLoading?: boolean;
  error?: string;
}

const BOOKING_MESSAGES = [
  'Refreshing seller fleet details',
  'Booking Enquiry sent',
  'Sending enquiry to seller',
];

export const BookingPopup = ({
  onComplete,
  onCancel,
  isOpen: propIsOpen,
  onConfirmBooking,
  isLoading = false,
  error,
}: BookingPopupProps = {}) => {
  const { selectedVehicle, closeDialog } = useVehicleCardContext();

  const isOpen =
    propIsOpen !== undefined ? propIsOpen : Boolean(selectedVehicle); // Use prop if provided, otherwise use context

  const [currentStep, setCurrentStep] = useState(0);
  const [showCancel, setShowCancel] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      closeDialog();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
  };

  useEffect(() => {
    if (isOpen && selectedVehicle) {
      // Remove selectedVehicle dependency for static testing
      setCurrentStep(0);
      setShowCancel(true);
      setProgress(0);

      // Trigger the rental enquiry when popup opens
      if (onConfirmBooking && !isLoading) {
        onConfirmBooking('I am interested in this car. Is it still available?');
      }

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 1;
        });
      }, 40); // Updates every 40ms to complete 100% in 4 seconds

      // Step through messages every ~1.3 seconds
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < BOOKING_MESSAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1300);

      // Hide cancel button after 4 seconds and complete booking
      const completeTimeout = setTimeout(() => {
        setShowCancel(false);
        setTimeout(() => {
          handleComplete();
        }, 500);
      }, 4000);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        clearTimeout(completeTimeout);
      };
    }

    // Return undefined when conditions aren't met
    return undefined;
  }, [isOpen, onConfirmBooking, isLoading]);

  const handleCancelClick = () => {
    if (showCancel) {
      handleCancel();
    }
  };

  // Create a fallback vehicle object for static testing
  const displayVehicle = selectedVehicle || {
    model: 'Demo Vehicle',
    vehicleTitle: 'Demo Vehicle',
    state: 'UAE',
    thumbnail: '/placeholder.svg?height=80&width=128&query=vehicle',
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-auto p-0 duration-200 animate-in zoom-in-95 sm:max-w-2xl md:max-w-3xl">
        <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header with car title */}
          <div className="flex flex-col items-start gap-2 border-b bg-gray-50 p-3 sm:flex-row sm:items-center sm:p-4">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                <span className="text-xs font-bold text-white">R</span>
              </div>
              <span className="flex-1 text-xs text-gray-600 sm:text-sm">
                Rent{' '}
                {displayVehicle.model ||
                  displayVehicle.vehicleTitle ||
                  'Vehicle'}{' '}
                in {displayVehicle.state || 'UAE'}
              </span>
            </div>
            <div className="ml-auto hidden h-4 w-4 rounded-sm bg-gray-300 sm:block"></div>
          </div>

          {/* Main content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Car image */}
              <div className="mx-auto w-full max-w-xs flex-shrink-0 lg:mx-0 lg:w-32">
                <div className="h-24 w-full overflow-hidden rounded-lg sm:h-20 lg:w-32">
                  <img
                    src={
                      displayVehicle.thumbnail ||
                      '/placeholder.svg?height=80&width=128&query=vehicle'
                    }
                    alt={
                      displayVehicle.model ||
                      displayVehicle.vehicleTitle ||
                      'Vehicle'
                    }
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Vendor details */}
              <div className="flex-1 text-center lg:text-left">
                <p className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
                  Listing Owner Details
                </p>
                <div className="flex flex-col items-center gap-3 p-2 sm:gap-4 sm:p-3 lg:flex-row lg:items-center lg:gap-5">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                    <AvatarImage
                      src={selectedVehicle?.companyLogo}
                      alt="Vendor Logo"
                    />
                    <AvatarFallback className="bg-black text-lg font-bold text-white sm:text-xl lg:text-2xl">
                      RR
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-center lg:text-left">
                    <h3 className="mb-1 text-base font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                      Ride Rent Partner
                    </h3>
                    <div className="mt-1 flex flex-col items-center justify-center gap-1 sm:mt-2 sm:flex-row sm:gap-2 lg:justify-start">
                      <CheckCircle className="h-3 w-3 flex-shrink-0 text-orange-500 sm:h-4 sm:w-4" />
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 px-2 py-1 text-xs text-orange-700 sm:px-3"
                      >
                        Verified Vendor
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side content */}
              <div className="flex w-full flex-col items-center justify-center gap-3 sm:gap-4 lg:w-auto lg:min-w-[200px]">
                {/* Progress circle and message container */}
                <div className="flex w-full max-w-xs flex-col items-center gap-3 sm:gap-4">
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                    {/* Background circle */}
                    <svg
                      className="h-full w-full -rotate-90 transform"
                      viewBox="0 0 64 64"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#f3f4f6"
                        strokeWidth="4"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#f97316"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        className="transition-all duration-100 ease-linear"
                      />
                    </svg>
                    {/* Checkmark icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-orange-500 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                    </div>
                  </div>

                  {/* Status message centered below animation */}
                  <div className="w-full text-center">
                    {error ? (
                      <p className="min-h-[20px] px-2 text-sm font-medium text-red-600 sm:min-h-[24px] sm:text-base">
                        {error}
                      </p>
                    ) : (
                      <p className="min-h-[20px] px-2 text-sm font-medium text-gray-900 sm:min-h-[24px] sm:text-base">
                        {isLoading
                          ? 'Sending enquiry...'
                          : BOOKING_MESSAGES[currentStep]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cancel button centered */}
                {showCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelClick}
                    className="mt-1 cursor-pointer border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:mt-2 sm:px-4 sm:py-2"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
