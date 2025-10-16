"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleTryAgain = () => {
    setLoading(true);
    setTimeout(() => {
      reset();
      setLoading(false);
    }, 1500); // 1.5 seconds loading
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg
            className="h-48 w-48 text-slate-300"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M70 85 L85 70 M85 85 L70 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M115 85 L130 70 M130 85 L115 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M70 130 Q100 110 130 130"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-medium text-slate-900">
            Something went wrong
          </h1>

          <p className="mb-8 text-lg text-slate-500">
            We're having trouble loading this page. Give it another try.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleTryAgain}
              disabled={loading}
              className={`flex items-center justify-center rounded-lg bg-slate-900 px-8 py-3 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Trying again...
                </>
              ) : (
                "Try again"
              )}
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="rounded-lg border border-slate-300 bg-white px-8 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
