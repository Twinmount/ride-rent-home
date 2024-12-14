import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeleton from "@/components/skelton/VehicleCardSkeleton";
import { PageProps } from "@/types";
import { VehicleCardType } from "@/types/vehicle-types";
import React, { Suspense } from "react";

const labelsArray = [
  {
    label: "Cars",
    value: "cars",
  },
  {
    label: "Sports Cars",
    value: "sports-cars",
  },
  {
    label: "Charters",
    value: "charters",
  },
];

export default function AgentProfilePage({ searchParams }: PageProps) {
  const filter = searchParams.filter || "all";
  const page = parseInt(searchParams.page || "1", 10);

  return (
    <section className="wrapper bg-white">
      {/* profile data */}
      <AgentProfile />

      {/* Agent Vehicle Filter */}
      <AgentVehicleFilter filters={labelsArray} />

      {/* agent vehicles grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <VehicleCardSkeleton />
          </div>
        }
      >
        <AgentVehicleGrid filter={filter} page={page} />
      </Suspense>
    </section>
  );
}
