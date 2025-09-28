/**
 * Test component for location detection functionality
 * This can be temporarily added to test the location detection system
 */

import React from "react";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { LocationCache } from "@/utils/location-detection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LocationDetectionTest() {
  const { location, isLoading, error, refetch } = useLocationDetection();

  const handleClearCache = () => {
    LocationCache.clear();
    refetch();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Location Detection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="text-sm text-muted-foreground">
            🔄 Detecting location...
          </div>
        )}

        {error && <div className="text-sm text-red-600">❌ Error: {error}</div>}

        {location && (
          <div className="space-y-2 text-sm">
            <div className="font-medium">📍 Detected Location:</div>
            <div className="space-y-1 pl-4">
              <div>
                Country: {location.country} ({location.countryCode})
              </div>
              <div>City: {location.city}</div>
              <div>Region: {location.region}</div>
              {location.timezone && <div>Timezone: {location.timezone}</div>}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={refetch} disabled={isLoading} size="sm">
            🔄 Refresh
          </Button>
          <Button onClick={handleClearCache} variant="outline" size="sm">
            🗑️ Clear Cache
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Cache is stored in localStorage for 24 hours
        </div>
      </CardContent>
    </Card>
  );
}

// Usage example in a page:
// import { LocationDetectionTest } from '@/components/test/LocationDetectionTest';
//
// export default function TestPage() {
//   return (
//     <div className="p-8">
//       <LocationDetectionTest />
//     </div>
//   );
// }
