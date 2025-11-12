import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router"; // Assumed from Next.js context
import { StatItem } from "./component-types";

type UserStatsSectionProps = {
  userCarActionCountsQuery: {
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  stats: StatItem[];
};

const UserStatsCard: React.FC<{
  stat: StatItem;
  onClick: (path: string) => void;
}> = ({ stat, onClick }) => (
  <Card
    className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
    onClick={() => onClick(stat.navigationPath)}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
    ></div>
    <CardContent className="relative p-3 sm:p-4 lg:p-6">
      <div className="mb-2 flex items-start justify-between sm:mb-3 lg:mb-4">
        <div className={`rounded-xl p-2 sm:p-2 lg:p-3 ${stat.bgColor}`}>
          <stat.icon
            className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.textColor}`}
          />
        </div>
      </div>
      <div className="space-y-1 sm:space-y-1 lg:space-y-2">
        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
          {stat.value.toLocaleString()}
        </h3>
        <p className="text-sm font-medium text-gray-700 sm:text-sm lg:text-base">
          {stat.label}
        </p>
        {stat.description && (
          <p className="text-xs text-gray-500 sm:text-xs lg:text-sm">
            {stat.description}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

export const UserStatsSection: React.FC<UserStatsSectionProps> = ({
  userCarActionCountsQuery,
  stats,
}) => {
  const router = useRouter(); // Using useRouter from assumed routing library

  if (userCarActionCountsQuery.isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mb-8 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="group relative border-0 shadow-lg">
            {/* Loading Skeleton content... */}
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
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200 sm:h-3 lg:h-4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userCarActionCountsQuery.error) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mb-8 lg:grid-cols-3">
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
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mb-8 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <UserStatsCard
          key={index}
          stat={stat}
          onClick={(path) => router.push(path)}
        />
      ))}
    </div>
  );
};
