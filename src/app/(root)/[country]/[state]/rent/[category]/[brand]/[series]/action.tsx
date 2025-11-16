"use server";

import { FetchVehicleCardsResponseV2 } from "@/types/vehicle-types";
import { API } from "@/utils/API";

type Props = {
  page: number;
  state: string;
  vehicleSeries: string;
  country: string;
  category: string;
};

export const fetchVehicleSeriesData = async ({
  page,
  state,
  vehicleSeries,
  country,
  category,
}: Props) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "8",
    state,
    vehicleSeries,
    category,
    sortOrder: "DESC",
  });

  const response = await API({
    path: `/vehicle/vehicle-series/list?${params.toString()}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  const data: FetchVehicleCardsResponseV2 = await response.json();

  return {
    result: {
      list: data.result.list || [],
      page: data.result.page,
      totalNumberOfPages: data.result.totalNumberOfPages,
    },
  };
};
