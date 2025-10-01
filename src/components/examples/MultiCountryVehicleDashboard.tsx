/**
 * Example Component: Multi-Country Vehicle Dashboard
 *
 * This component demonstrates how to use the multi-country API integration
 * to display vehicles from both India and UAE simultaneously.
 */

import React, { useState, useEffect } from "react";
import { useUserActions } from "@/hooks/useUserActions";
import { getCountryDistribution } from "@/lib/api/multiCountryApi";

interface CountryStats {
  totalVehicles: number;
  countryBreakdown: Record<string, number>;
  avgResponseTime: number;
  lastUpdated: string;
}

export function MultiCountryVehicleDashboard() {
  const {
    useUserSavedVehicles,
    useUserEnquiredVehicles,
    fetchSavedVehicles,
    savedVehicles,
    enquiredVehicles,
  } = useUserActions();

  const [stats, setStats] = useState<CountryStats | null>(null);
  const [enableMultiCountry, setEnableMultiCountry] = useState(true);

  // Query for saved vehicles with multi-country support
  const {
    data: savedVehiclesData,
    isLoading: isSavedLoading,
    error: savedError,
  } = useUserSavedVehicles({
    page: 0,
    limit: 50,
    useMultiCountry: enableMultiCountry,
  });

  // Query for enquired vehicles with multi-country support
  const {
    data: enquiredVehiclesData,
    isLoading: isEnquiredLoading,
    error: enquiredError,
  } = useUserEnquiredVehicles({
    page: 0,
    limit: 50,
    useMultiCountry: enableMultiCountry,
  });

  // Calculate statistics from multi-country data
  useEffect(() => {
    if (savedVehiclesData?.result?.data) {
      const vehicles = savedVehiclesData.result.data;

      // Calculate country breakdown manually since the data structure might be different
      const countryBreakdown: Record<string, number> = {};
      vehicles.forEach((vehicle: any) => {
        const country = vehicle._metadata?.country || "Unknown";
        countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
      });

      // Calculate average response time from metadata
      let totalResponseTime = 0;
      let responseCount = 0;

      vehicles.forEach((vehicle: any) => {
        if (vehicle._metadata?.responseTime) {
          totalResponseTime += vehicle._metadata.responseTime;
          responseCount++;
        }
      });

      setStats({
        totalVehicles: vehicles.length,
        countryBreakdown,
        avgResponseTime:
          responseCount > 0 ? totalResponseTime / responseCount : 0,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    }
  }, [savedVehiclesData]);

  const handleRefresh = () => {
    fetchSavedVehicles({
      page: 0,
      limit: 50,
      useMultiCountry: enableMultiCountry,
    });
  };

  const renderCountryBadge = (vehicle: any) => {
    const country = vehicle._metadata?.country;
    const responseTime = vehicle._metadata?.responseTime;

    if (!country) return null;

    const badgeColor =
      country === "INDIA"
        ? "bg-orange-100 text-orange-800"
        : "bg-green-100 text-green-800";

    return (
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${badgeColor}`}
        >
          {vehicle._metadata?.countryName || country}
        </span>
        {responseTime && (
          <span className="text-xs text-gray-500">{responseTime}ms</span>
        )}
      </div>
    );
  };

  const renderMultiCountryMetadata = (data: any) => {
    if (!data?.multiCountryMetadata) return null;

    const metadata = data.multiCountryMetadata;

    return (
      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-blue-900">
          Multi-Country API Stats
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <span className="text-blue-600">Total Countries:</span>
            <div className="font-medium">{metadata.totalCountries}</div>
          </div>
          <div>
            <span className="text-green-600">Successful:</span>
            <div className="font-medium">{metadata.successfulCountries}</div>
          </div>
          <div>
            <span className="text-red-600">Failed:</span>
            <div className="font-medium">{metadata.failedCountries}</div>
          </div>
          <div>
            <span className="text-gray-600">Success Rate:</span>
            <div className="font-medium">
              {(
                (metadata.successfulCountries / metadata.totalCountries) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>
        </div>

        <div className="mt-3">
          <span className="text-sm text-blue-600">Country Performance:</span>
          <div className="mt-1 flex gap-2">
            {metadata.countries.map((country: any) => (
              <span
                key={country.country}
                className={`rounded px-2 py-1 text-xs ${
                  country.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {country.country}: {country.responseTime || "N/A"}ms
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Multi-Country Vehicle Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableMultiCountry}
              onChange={(e) => setEnableMultiCountry(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Enable Multi-Country API</span>
          </label>
          <button
            onClick={handleRefresh}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalVehicles}
            </div>
            <div className="text-gray-600">Total Vehicles</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(stats.countryBreakdown).length}
            </div>
            <div className="text-gray-600">Active Countries</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(stats.avgResponseTime)}ms
            </div>
            <div className="text-gray-600">Avg Response Time</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-lg font-medium text-gray-600">
              {stats.lastUpdated}
            </div>
            <div className="text-gray-600">Last Updated</div>
          </div>
        </div>
      )}

      {/* Country Distribution */}
      {stats?.countryBreakdown && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Vehicle Distribution by Country
          </h3>
          <div className="flex gap-4">
            {Object.entries(stats.countryBreakdown).map(([country, count]) => (
              <div key={country} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{country}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Country API Metadata */}
      {renderMultiCountryMetadata(savedVehiclesData)}

      {/* Error Handling */}
      {(savedError || enquiredError) && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">API Errors</h3>
          {savedError && (
            <p className="text-sm text-red-600">
              Saved Vehicles: {savedError.message}
            </p>
          )}
          {enquiredError && (
            <p className="text-sm text-red-600">
              Enquired Vehicles: {enquiredError.message}
            </p>
          )}
        </div>
      )}

      {/* Loading States */}
      {(isSavedLoading || isEnquiredLoading) && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-800">
              Loading vehicles from{" "}
              {enableMultiCountry ? "multiple countries" : "single country"}...
            </span>
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedVehiclesData?.result?.data?.map((vehicle: any) => (
          <div key={vehicle.id} className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-semibold">{vehicle.name}</h3>
              {renderCountryBadge(vehicle)}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div>
                Price: AED {vehicle.price}/{vehicle.priceUnit}
              </div>
              <div>Saved: {vehicle.savedDate}</div>
              {vehicle.location && <div>Location: {vehicle.location}</div>}
            </div>

            {vehicle.image && (
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="mt-4 h-40 w-full rounded object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/default-car.png";
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isSavedLoading && !savedVehiclesData?.result?.data?.length && (
        <div className="py-12 text-center">
          <div className="text-lg text-gray-500">No vehicles found</div>
          <div className="mt-2 text-sm text-gray-400">
            Try enabling multi-country API to search across all regions
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiCountryVehicleDashboard;
