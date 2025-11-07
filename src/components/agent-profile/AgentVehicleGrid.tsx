import { FetchVehicleCardsResponseV2 } from '@/types/vehicle-types';
import { Suspense } from 'react';
import Pagination from '../common/Pagination';
import VehicleCard from '../card/vehicle-card/main-card/VehicleCard';
import { API } from '@/utils/API';

type Props = {
  filter: string;
  page: number;
  companyId: string;
  country: string;
};

export const revalidate = 600;

export default async function AgentVehicleGrid({
  filter,
  page,
  companyId,
  country,
}: Props) {
  const params = new URLSearchParams({
    page: page.toString(),
    companyId,
    limit: '9',
    sortOrder: 'DESC',
    vehicleCategory: filter,
  }).toString();

  const response = await API({
    path: `/vehicle/vehicle/company/list?${params}`,
    options: {
      method: 'GET',
      cache: 'no-cache',
    },
    country,
  });

  const data: FetchVehicleCardsResponseV2 = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;
  const vehicles = data.result.list || [];

  return (
    <div>
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {vehicles.map((vehicle, index) => (
            <div key={vehicle.vehicleId} className="w-full">
              <VehicleCard
                key={vehicle.vehicleId}
                index={index}
                vehicle={vehicle}
                country={country}
                layoutType="grid"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-center h-72 text-lg font-thin">
          No Vehicles Found&nbsp; :/
        </div>
      )}
      {vehicles.length > 0 && (
        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination
            page={page}
            totalPages={totalPages}
            needToSetPageNoInUrlDefault={false}
          />
        </Suspense>
      )}
    </div>
  );
}
