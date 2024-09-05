'use client'

import './VehicleGrid.scss'
import { useRef, Suspense } from 'react'
import HorizontalCard from '../../../card/vehicle-card/listing-horizontal-card/HorizontalCard'
import VerticalCard from '../../../card/vehicle-card/listing-vertical-card/VerticalCard'
import useIsSmallScreen from '@/hooks/useIsSmallScreen'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import Pagination from '@/components/general/pagination/Pagination'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { FetchVehicleByFilters } from '@/lib/api/general-api'
import ListingSkelton from '@/components/skelton/ListingsSkelton'
import NoResultsFound from './NoResultsFound'
import FiltersSidebar from '../filter/FiltersSidebar'

type VehicleGridProps = {
  isGridView: boolean
  page: number
  state: string
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  isGridView,
  page,
  state,
}) => {
  const isSmallScreen = useIsSmallScreen(850)
  const isFiltersButtonVisible = useIsSmallScreen(1200)
  const vehicleGridRef = useRef<HTMLDivElement | null>(null)
  const isVehicleGridVisible = useIntersectionObserver(vehicleGridRef)
  const searchParams = useSearchParams()

  // Fetch data using react-query
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', searchParams.toString()],
    queryFn: () => FetchVehicleByFilters(searchParams.toString()),
    enabled: !!searchParams.toString(), // Ensures the query runs only when searchParams is available
  })

  const category = searchParams.get('category') || undefined

  // Explicitly typing vehicleData to avoid undefined errors
  const vehicleData = data?.result?.list || []

  return (
    <div className="w-full flex flex-col">
      {isLoading ? (
        <ListingSkelton />
      ) : (
        <>
          <div
            ref={vehicleGridRef}
            className={`${
              vehicleData.length === 0
                ? 'w-full'
                : `grid ${isGridView ? 'multi-grid' : ''} ${
                    isSmallScreen ? 'two-column-vertical' : ''
                  }`
            }`}
          >
            {vehicleData.length === 0 ? (
              <NoResultsFound />
            ) : (
              vehicleData.map((vehicle, index) =>
                isSmallScreen || isGridView ? (
                  <VerticalCard
                    key={vehicle.vehicleId || index}
                    vehicle={vehicle}
                    category={category as string}
                    state={state as string}
                  />
                ) : (
                  <HorizontalCard
                    key={vehicle.vehicleId || index}
                    vehicle={vehicle}
                    category={category as string}
                    state={state as string}
                  />
                )
              )
            )}
          </div>
          <Suspense fallback={<div>Loading Pagination...</div>}>
            <Pagination
              page={page}
              totalPages={data?.result.totalNumberOfPages || 1}
            />
          </Suspense>
        </>
      )}

      {/* Filter modal toggle button */}
      {isFiltersButtonVisible && isVehicleGridVisible && (
        <FiltersSidebar category={category} />
      )}
    </div>
  )
}

export default VehicleGrid
