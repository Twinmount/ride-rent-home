"use server";

import { ENV } from "@/config/env";

import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

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

  const API_URL = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;
  const url = `${API_URL}/vehicle/vehicle-series/list?${params.toString()}`;

  const response = await fetch(`${url}`, {
    method: "GET",
    cache: "no-cache",
  });

  const data: FetchVehicleCardsResponse = await response.json();

  // Return raw data in the same structure 
  return {
    result: {
      list: data.result.list || [],
      page: data.result.page,
      totalNumberOfPages: data.result.totalNumberOfPages,
    }
  };
};