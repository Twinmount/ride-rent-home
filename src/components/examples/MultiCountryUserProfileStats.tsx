/**
 * Example Component: Multi-Country User Profile Stats
 *
 * This component demonstrates how to use the multi-country API integration
 * for user profile statistics (car action counts and recent activities).
 */

import React, { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Eye,
  MessageSquare,
} from "lucide-react";

interface MultiCountryUserProfileStatsProps {
  userId: string;
  className?: string;
}

export function MultiCountryUserProfileStats({
  userId,
  className,
}: MultiCountryUserProfileStatsProps) {
  const [enableMultiCountry, setEnableMultiCountry] = useState(true);

  const {
    userCarActionCountsQuery,
    userRecentActivitiesQuery,
    multiCountryConfig,
    multiCountryApi,
  } = useUserProfile({
    userId,
    useMultiCountry: enableMultiCountry,
  });

  const {
    data: actionCounts,
    isLoading: isActionCountsLoading,
    error: actionCountsError,
  } = userCarActionCountsQuery;

  const {
    data: recentActivities,
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = userRecentActivitiesQuery;

  const renderMultiCountryStatus = () => {
    if (!enableMultiCountry) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          Single Country Mode
        </Badge>
      );
    }

    const metadata = multiCountryConfig.metadata.carActionCounts;
    if (!metadata) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          Multi-Country (Loading...)
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={metadata.successfulCountries > 0 ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          <Globe className="h-3 w-3" />
          Multi-Country ({metadata.successfulCountries}/
          {metadata.totalCountries})
        </Badge>
        {metadata.countries?.map((country: any) => (
          <Badge
            key={country.country}
            variant={country.success ? "secondary" : "destructive"}
            className="flex items-center gap-1 text-xs"
          >
            {country.success ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {country.country}: {country.responseTime || "N/A"}ms
          </Badge>
        ))}
      </div>
    );
  };

  const renderActionCountsCard = () => {
    const stats = [
      {
        label: "Saved Vehicles",
        value: actionCounts?.saved || 0,
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        label: "Viewed Vehicles",
        value: actionCounts?.viewed || 0,
        icon: Eye,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Enquired Vehicles",
        value: actionCounts?.enquired || 0,
        icon: MessageSquare,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Car Action Counts
          </CardTitle>
          {renderMultiCountryStatus()}
        </CardHeader>
        <CardContent>
          {isActionCountsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 rounded-lg bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : actionCountsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Error loading action counts: {actionCountsError.message}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-lg p-4 ${stat.bgColor} border`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-white p-2 ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Multi-country performance metrics */}
          {enableMultiCountry &&
            multiCountryConfig.metadata.carActionCounts && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-900">
                  Multi-Country Performance
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-blue-600">Countries Called:</span>
                    <div className="font-medium">
                      {
                        multiCountryConfig.metadata.carActionCounts
                          .totalCountries
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-green-600">Successful:</span>
                    <div className="font-medium">
                      {
                        multiCountryConfig.metadata.carActionCounts
                          .successfulCountries
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-red-600">Failed:</span>
                    <div className="font-medium">
                      {
                        multiCountryConfig.metadata.carActionCounts
                          .failedCountries
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <div className="font-medium">
                      {(
                        (multiCountryConfig.metadata.carActionCounts
                          .successfulCountries /
                          multiCountryConfig.metadata.carActionCounts
                            .totalCountries) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    );
  };

  const renderRecentActivitiesCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          {enableMultiCountry &&
            multiCountryConfig.metadata.recentActivities && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                From{" "}
                {
                  multiCountryConfig.metadata.recentActivities
                    .successfulCountries
                }{" "}
                Countries
              </Badge>
            )}
        </CardHeader>
        <CardContent>
          {isActivitiesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 rounded-lg bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : activitiesError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Error loading activities: {activitiesError.message}
              </p>
            </div>
          ) : !recentActivities || recentActivities.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No recent activities found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities
                .slice(0, 5)
                .map((activity: any, index: number) => (
                  <div
                    key={activity._id || index}
                    className="flex items-center gap-4 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex-shrink-0">
                      {activity.vehicleImageUrl ? (
                        <img
                          src={activity.vehicleImageUrl}
                          alt={activity.vehicleName}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/default-car.png";
                          }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300">
                          <Activity className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {activity.activityDescription}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.vehicleName}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {activity.timeAgo}
                        </span>
                        {activity._metadata?.country && (
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-xs"
                          >
                            {activity._metadata.countryName ||
                              activity._metadata.country}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Badge
                        variant={
                          activity.activityType === "SAVE"
                            ? "default"
                            : activity.activityType === "VIEW"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {activity.activityType}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-Country API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="multi-country-toggle"
                className="text-sm font-medium"
              >
                Enable Multi-Country API
              </Label>
              <p className="text-xs text-gray-500">
                Fetch data from both India and UAE APIs simultaneously
              </p>
            </div>
            <Switch
              id="multi-country-toggle"
              checked={enableMultiCountry}
              onCheckedChange={setEnableMultiCountry}
            />
          </div>

          {enableMultiCountry && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                ✨ Multi-country mode enabled - fetching data from all available
                regions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {renderActionCountsCard()}
        {renderRecentActivitiesCard()}
      </div>

      {/* Debug Information */}
      {enableMultiCountry &&
        (multiCountryConfig.metadata.carActionCounts ||
          multiCountryConfig.metadata.recentActivities) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Debug: Multi-Country Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 font-mono text-xs">
                {multiCountryConfig.metadata.carActionCounts && (
                  <div>
                    <h4 className="mb-2 font-semibold">
                      Car Action Counts Metadata:
                    </h4>
                    <pre className="overflow-x-auto rounded bg-gray-50 p-2">
                      {JSON.stringify(
                        multiCountryConfig.metadata.carActionCounts,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
                {multiCountryConfig.metadata.recentActivities && (
                  <div>
                    <h4 className="mb-2 font-semibold">
                      Recent Activities Metadata:
                    </h4>
                    <pre className="overflow-x-auto rounded bg-gray-50 p-2">
                      {JSON.stringify(
                        multiCountryConfig.metadata.recentActivities,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

export default MultiCountryUserProfileStats;
