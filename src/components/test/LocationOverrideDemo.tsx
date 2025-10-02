/**
 * Test page for the enhanced LocationOverride component
 * Shows how the component works with real country data and flags
 */

import React, { useState } from "react";
import { LocationOverride } from "@/components/common/LocationOverride";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationInfo } from "@/utils/location-detection";

export function LocationOverrideDemo() {
  const [selectedCountry, setSelectedCountry] = useState<string>("ae");
  const [mockLocation, setMockLocation] = useState<LocationInfo | null>({
    country: "ae",
    countryCode: "AE",
    city: "Dubai",
    region: "Dubai",
    timezone: "Asia/Dubai",
  });

  // Note: LocationOverride is now read-only, no interaction needed

  const simulateIndiaLocation = () => {
    setMockLocation({
      country: "in",
      countryCode: "IN",
      city: "Mumbai",
      region: "Maharashtra",
      timezone: "Asia/Kolkata",
    });
    setSelectedCountry("in");
  };

  const simulateUAELocation = () => {
    setMockLocation({
      country: "ae",
      countryCode: "AE",
      city: "Dubai",
      region: "Dubai",
      timezone: "Asia/Dubai",
    });
    setSelectedCountry("ae");
  };

  const simulateNoLocation = () => {
    setMockLocation(null);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>🌍 Enhanced LocationOverride Component Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Component Demo */}
          <div className="space-y-2">
            <h3 className="font-medium">Live Component:</h3>
            <div className="rounded-lg border bg-gray-50 p-4">
              <LocationOverride
                detectedLocation={mockLocation}
                selectedCountry={selectedCountry}
                selectedCountryName={
                  selectedCountry === "ae"
                    ? "UAE"
                    : selectedCountry === "in"
                      ? "India"
                      : undefined
                }
              />
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-3">
            <h3 className="font-medium">Simulate Different Scenarios:</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={simulateUAELocation} variant="outline" size="sm">
                🇦🇪 Simulate UAE Location
              </Button>
              <Button
                onClick={simulateIndiaLocation}
                variant="outline"
                size="sm"
              >
                🇮🇳 Simulate India Location
              </Button>
              <Button onClick={simulateNoLocation} variant="outline" size="sm">
                ❌ No Location Detected
              </Button>
            </div>
          </div>

          {/* Current State Display */}
          <div className="space-y-2">
            <h3 className="font-medium">Current State:</h3>
            <div className="rounded bg-gray-100 p-3 font-mono text-sm">
              <div>Selected Country: {selectedCountry}</div>
              <div>
                Detected Location:{" "}
                {mockLocation ? JSON.stringify(mockLocation, null, 2) : "null"}
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <h3 className="font-medium">✨ Features:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• High-quality SVG country flags from react-country-flag</li>
              <li>• Comprehensive country data from world-countries package</li>
              <li>• Real-time location display with map pin icon</li>
              <li>• Read-only display of country flag and name</li>
              <li>• Fallback handling for unsupported countries</li>
              <li>• Clean, minimal design without dropdown</li>
              <li>• TypeScript support with proper type definitions</li>
            </ul>
          </div>

          {/* Package Information */}
          <div className="space-y-2">
            <h3 className="font-medium">📦 NPM Packages Used:</h3>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="rounded bg-blue-50 p-3">
                <div className="font-medium">react-country-flag</div>
                <div className="text-gray-600">
                  Provides high-quality SVG flags
                </div>
              </div>
              <div className="rounded bg-green-50 p-3">
                <div className="font-medium">world-countries</div>
                <div className="text-gray-600">Comprehensive country data</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Usage in a page:
// import { LocationOverrideDemo } from '@/components/test/LocationOverrideDemo';
//
// export default function TestPage() {
//   return <LocationOverrideDemo />;
// }
