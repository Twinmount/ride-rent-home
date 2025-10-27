'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const cookieConsent = localStorage.getItem("cookieConsent");

    if (!cookieConsent) {
      // First time visitor - show popup
      setShowPopup(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        handleOkClick();
      }, 3000);

      // Cleanup timer if component unmounts or user clicks OK before 3 seconds
      return () => clearTimeout(timer);
    }

    // Return undefined explicitly for the else case
    return undefined;
  }, []);

  const handleOkClick = () => {
    // Store consent in localStorage
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());

    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <>
      {/* Blocking overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
      {/* Cookie popup */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div className="mx-4 mb-4 w-full max-w-3xl rounded-xl bg-text-primary px-4 py-4 text-white shadow-lg sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex-1 sm:mr-4">
              <p className="text-sm">
                We use cookies to ensure you get the best experience on our
                website.{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Learn more
                </Link>
              </p>
            </div>
            <button
              onClick={handleOkClick}
              className="flex-shrink-0 rounded bg-yellow px-6 py-1 text-sm font-medium text-black transition-colors hover:bg-amber-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePopup;
