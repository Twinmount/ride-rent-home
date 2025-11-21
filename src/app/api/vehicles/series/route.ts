import { NextRequest, NextResponse } from "next/server";
import { API } from "@/utils/API";
import { FetchVehicleCardsResponseV2 } from "@/types/vehicle-types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page") || "1";
    const state = searchParams.get("state") || "";
    const vehicleSeries = searchParams.get("vehicleSeries") || "";
    const category = searchParams.get("category") || "";
    const country = searchParams.get("country") || "";

    const params = new URLSearchParams({
      page,
      limit: "10",
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

    return NextResponse.json({
      result: {
        list: data.result?.list || [],
        page: data.result?.page || page,
        totalNumberOfPages: data.result?.totalNumberOfPages || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        result: {
          list: [],
          page: 1,
          totalNumberOfPages: 0,
        },
      },
      { status: 200 }
    );
  }
}
