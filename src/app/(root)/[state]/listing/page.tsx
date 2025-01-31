import "./ListingPage.scss";
import Filter from "@/components/root/listing/filter/Filter";
import GridSwitch from "@/components/root/listing/grid-switch/GridSwitch";
import LimitDropdown from "@/components/root/listing/limit-dropdown/LimitDropdown";
import VehicleGrid from "@/components/root/listing/vehicle-grids/VehicleGrid";

import { convertToLabel } from "@/helpers";
import { PageProps } from "@/types";
import { Metadata } from "next";
import { FC, Suspense } from "react";
import {
  fetchListingMetadata,
  generateListingMetadata,
} from "./listing-metadata";

export async function generateMetadata({
  params: { state },
  searchParams,
}: PageProps): Promise<Metadata> {
  const category = searchParams.category || "cars";
  const vehicleTypesParam = searchParams.vehicleTypes;
  const vehicleType = vehicleTypesParam
    ? vehicleTypesParam.split(",")[0]
    : "other";

  const data = await fetchListingMetadata(state, category, vehicleType);

  if (!data) {
    throw new Error("Failed to fetch listing metadata");
  }

  return generateListingMetadata(data, state, category, vehicleType);
}

const ListingPage: FC<PageProps> = ({ searchParams, params: { state } }) => {
  // Determine the initial view based on URL parameters
  const isGridView = searchParams.view === "grid";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "6", 10);

  const category = searchParams.category;
  const brand = searchParams.brand;

  const formattedCategory = convertToLabel(category);
  const formattedState = convertToLabel(state);
  const formattedBrand = convertToLabel(brand);

  // Parse and format the vehicleTypes from searchParams
  const vehicleTypes = searchParams.vehicleTypes
    ? searchParams.vehicleTypes.split(",").map((type) => convertToLabel(type))
    : [];

  return (
    <div className="listing-section wrapper">
      <div className="listing-navbar">
        <h1 className="listing-heading">
          Rent or Lease&nbsp;
          {formattedBrand && <span>{formattedBrand}&nbsp;</span>}
          <span>{formattedCategory} </span>in <span>{formattedState}</span>
          {/*rendering vehicle types, if there are any */}
          {vehicleTypes.length > 0 && (
            <span className="vehicle-types-heading">
              <span className="separator"> | </span>
              {vehicleTypes.length > 3 ? (
                <span className="vehicle-types">
                  {vehicleTypes[0]}, {vehicleTypes[1]}, {vehicleTypes[2]} and
                  more...
                </span>
              ) : (
                vehicleTypes.map((type, index) => (
                  <span key={index} className="vehicle-types">
                    {type}
                    {index < vehicleTypes.length - 1 && ", "}
                  </span>
                ))
              )}
            </span>
          )}
        </h1>

        <div className="list-navbar-right">
          {/* Limit dropdown */}
          <LimitDropdown />
          {/* grid vs list switch button */}
          <Suspense fallback={<div>...</div>}>
            <GridSwitch isGridView={isGridView} />
          </Suspense>
        </div>
      </div>

      <div className="listing-container">
        {/*dynamically imported filter */}
        <Filter category={searchParams.category} isMobile={false} />

        {/* vehicle grid */}
        <VehicleGrid
          isGridView={isGridView}
          page={page}
          limit={limit}
          state={state}
        />
      </div>
    </div>
  );
};

export default ListingPage;
