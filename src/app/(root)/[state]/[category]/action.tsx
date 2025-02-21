"use server";

import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import { ENV } from "@/config/env";
import { VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

type Props = {
  page: number;
  state: string;
  category: string;
  vehicleType?: string;
};

const API_URL = ENV.API_URL;

export const fetchVehicleHomeGridData = async ({
  page,
  state,
  category,
  vehicleType,
}: Props) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "8",
    state,
    category,
    sortOrder: "DESC",
    filter: VehicleHomeFilter.NONE,
  });

  if (vehicleType) {
    params.set("type", vehicleType);
  }

  const url = `${API_URL}/vehicle/home-page/list?${params.toString()}`;

  const response = await fetch(url, { method: "GET", cache: "no-cache" });

  const data: FetchVehicleCardsResponse = await response.json();

  const vehicles = data?.result?.list || [];
  const hasMore = parseInt(data.result.page) < data.result.totalNumberOfPages;

  return {
    vehicles: vehicles.map((vehicle, index) => {
      const animationIndex = index % 8;
      return (
        <VehicleMainCard
          key={vehicle.vehicleId}
          vehicle={vehicle}
          index={animationIndex}
        />
      );
    }),
    hasMore,
  };
};
