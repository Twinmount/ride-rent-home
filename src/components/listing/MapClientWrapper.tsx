"use client";

import { ErrorBoundary } from "react-error-boundary";
import MapClient from "./MapClient";

function ErrorFallback() {
  return (
    <div
      style={{ height: "calc(100vh - 4rem)" }}
      className="flex w-full items-center justify-center border border-gray-300 bg-white px-6 py-4 shadow-sm"
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
