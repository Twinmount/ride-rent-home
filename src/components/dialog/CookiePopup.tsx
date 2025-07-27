'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if ANY cookies exist on the site
    const hasCookies = document.cookie && document.cookie.trim() !== '';
    if (!hasCookies) {
      setShowPopup(true);
    }
  }, []);

  const handleOkClick = () => {
    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="bg-text-primary text-white px-4 sm:px-6 py-4 mx-4 mb-4 rounded-xl shadow-lg max-w-3xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1 sm:mr-4">
            <p className="text-sm">
              We use cookies to ensure you get the best experience on our website.{' '}
              <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                Learn more
              </Link>
            </p>
          </div>
          <button
            onClick={handleOkClick}
            className="bg-yellow hover:bg-amber-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors flex-shrink-0"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePopup;