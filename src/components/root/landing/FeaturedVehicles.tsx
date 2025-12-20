import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponseV2 } from "@/types/vehicle-types";
import { API } from "@/utils/API";
import { convertToLabel } from "@/helpers";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Slug } from "@/constants/apiEndpoints";
import FeaturedVehiclesAnimated from "./FeaturedVehiclesAnimated";

type FeaturedVehiclesProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const FeaturedVehicles = async ({
  state,
  category,
  vehicleType,
  country,
}: FeaturedVehiclesProps) => {
  const params = new URLSearchParams({
    page: "1",
    limit: "9",
    state,
    category,
    sortOrder: "DESC",
    filter: VehicleHomeFilter.NONE,
  });

  if (vehicleType) {
    params.set("type", vehicleType);
  }

  const response = await API({
    path: `${Slug.GET_HOMEPAGE_LIST}?${params.toString()}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  const data: FetchVehicleCardsResponseV2 = await response.json();
  const vehicles = data?.result?.list || [];

  if (vehicles.length === 0) {
    return null;
  }

  const mainVehicles = vehicles.slice(0, 5);
  const gridThumbnails = vehicles
    .slice(5, 9)
    .map((v) => v.thumbnail || v.fallbackThumbnail || "");
  const totalVehicles = data?.result?.total || 0;

  let viewAllLink = `/${country}/${state}/listing/${category}`;
  if (vehicleType) {
    viewAllLink += `/${vehicleType}`;
  }

  const formattedVehicleType = convertToLabel(vehicleType);
  const formattedCategory = convertToLabel(category);

  return (
    <div className="section-container">
      {" "}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen lg:relative lg:left-auto lg:right-auto lg:ml-0 lg:mr-0 lg:w-full">
        <FeaturedVehiclesAnimated
          mainVehicles={mainVehicles}
          gridThumbnails={gridThumbnails}
          totalVehicles={totalVehicles}
          viewAllLink={viewAllLink}
          label={`More ${formattedVehicleType || formattedCategory} `}
          country={country}
        />

        <div
          className="mx-2 md:hidden"
          style={{ minHeight: "76px", paddingTop: "16px" }}
        >
          <Link
            href={viewAllLink}
            className="block rounded-lg bg-gradient-to-r from-yellow to-orange-500 p-4 text-white transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            aria-label={`Explore all ${totalVehicles} ${formattedVehicleType || formattedCategory} options`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center" aria-hidden="true">
                  <ChevronRight className="h-5 w-5" />
                  <ChevronRight className="-ml-3 h-5 w-5" />
                  <ChevronRight className="-ml-3 h-5 w-5" />
                </div>
                <span className="text-sm font-medium">
                  Explore {totalVehicles}+ More Options
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVehicles;
