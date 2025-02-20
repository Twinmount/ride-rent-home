"use server";

import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import VehicleListingsGridWrapper from "@/components/common/VehicleListingsGridWrapper";
import { ENV } from "@/config/env";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

type Props = {
  page: number;
  state: string;
  vehicleSeries: string;
};

const API_URL = ENV.API_URL;

export const fetchVehicleSeriesData = async ({
  page,
  state,
  vehicleSeries,
}: Props) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "8",
    state,
    vehicleSeries,
    sortOrder: "DESC",
  });

  // Construct the full URL
  const url = `${API_URL}/vehicle/vehicle-series/list?${params.toString()}`;

  const response = await fetch(`${url}`, {
    method: "GET",
    cache: "no-cache",
  });

  const data: FetchVehicleCardsResponse = await response.json();

  const vehicles = data.result.list || [];

  const hasMore = parseInt(data.result.page) < data.result.totalNumberOfPages;

  return {
    vehicles: (
      <VehicleListingsGridWrapper classNames="mb-4">
        {vehicles.map((vehicle, index) => {
          const animationIndex = index % 8;
          return (
            <VehicleMainCard
              key={vehicle.vehicleId}
              vehicle={vehicle}
              index={animationIndex}
            />
          );
        })}
      </VehicleListingsGridWrapper>
    ),
    hasMore,
    totalNumberOfPages: data.result.totalNumberOfPages,
  };
};
