"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  description?: string;
  action: string;
  navigationPath: string;
}

interface UserStatsSectionProps {
  userCarActionCountsQuery: {
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
    data?: {
      enquired?: number;
      saved?: number;
      viewed?: number;
    };
  };
  stats: StatItem[];
}

export const UserStatsSection: React.FC<UserStatsSectionProps> = ({
  userCarActionCountsQuery,
  stats,
}) => {
  const router = useRouter();

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:mb-8 lg:grid-cols-3">
      {userCarActionCountsQuery.isLoading ? (
        // Loading skeleton
        Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <CardContent className="relative p-3 sm:p-4 lg:p-6">
              <div className="mb-2 flex items-start justify-between sm:mb-3 lg:mb-4">
                <div className="animate-pulse rounded-xl bg-gray-100 p-2 sm:p-2 lg:p-3">
                  <div className="h-4 w-4 rounded bg-gray-200 sm:h-5 sm:w-5 lg:h-6 lg:w-6"></div>
                </div>
                <div className="animate-pulse rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                  <div className="h-3 w-3 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="h-5 animate-pulse rounded bg-gray-200 sm:h-6 lg:h-8"></div>
                <div className="h-3 animate-pulse rounded bg-gray-200 sm:h-3 lg:h-4"></div>
                <div className="h-3 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="mt-2 border-t border-gray-100 pt-2 sm:mt-3 sm:pt-3 lg:mt-4 lg:pt-4">
                <div className="h-5 animate-pulse rounded bg-gray-200 sm:h-6 lg:h-8"></div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : userCarActionCountsQuery.error ? (
        // Error state
        <div className="col-span-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center sm:p-6">
              <p className="text-red-600">Failed to load user statistics</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => userCarActionCountsQuery.refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Success state
        stats.map((stat, index) => (
          <Card
            key={index}
            className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => router.push(stat.navigationPath)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
            ></div>
            <CardContent className="relative p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="mb-2 flex items-start justify-between sm:mb-3 lg:mb-4">
                <div
                  className={`rounded-lg p-1.5 sm:rounded-xl sm:p-2 lg:p-3 ${stat.bgColor}`}
                >
                  <stat.icon
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 ${stat.textColor}`}
                  />
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1 lg:space-y-2">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-xs font-medium text-gray-700 sm:text-sm md:text-sm lg:text-base">
                  {stat.label}
                </p>
                {stat.description && (
                  <p className="text-[10px] text-gray-500 sm:text-xs lg:text-sm">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
