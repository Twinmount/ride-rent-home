"use client";

import { ErrorBoundary } from "react-error-boundary";
import MapClient from "./MapClient";

function ErrorFallback() {
  return (
    <div
      className="flex w-full items-center justify-center border border-gray-300 bg-white px-6 py-4 shadow-sm h-full"
    >
      <div className="text-center">
        Something went wrong while loading the map
      </div>
    </div>
  );
}

export default function MapClientWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MapClient />
    </ErrorBoundary>
  );
}
