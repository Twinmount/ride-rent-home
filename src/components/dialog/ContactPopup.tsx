'use client';

import React from 'react';
import { X } from 'lucide-react';
import ContactIcons from '../common/contact-icons/ContactIcons';

interface ContactPopupProps {
  vehicleId: string;
  whatsappUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  vehicleName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({
  vehicleId,
  whatsappUrl,
  email,
  phoneNumber,
  vehicleName,
  isOpen,
  onClose,
}) => {
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm rounded-lg"
      onClick={handleBackdropClick}
    >
      {/* Popup Content */}
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Popup Header */}
        <div className="m-6 flex flex-col items-center justify-center gap-2">
          <div>
            <h2 className="text-xl font-semibold text-yellow">
            Contact Options
          </h2>
          </div>
          <div>
          {vehicleName && (
            <p className="mt-1 text-sm text-text-secondary">
              <span className="font-bold text-text-primary">Model:</span> {vehicleName}
            </p>
          )}
          </div>
        </div>

        {/* Contact Icons */}
        <div className="flex justify-center">
          <ContactIcons
            vehicleId={vehicleId}
            whatsappUrl={whatsappUrl}
            email={email}
            phoneNumber={phoneNumber}
          />
        </div>

        {/* Contact details text */}
        <div className="mt-6 space-y-2 text-center text-sm text-text-tertiary">
          {whatsappUrl && (
            <p>Click WhatsApp to chat with us directly</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;