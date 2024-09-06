import './Latest.scss'
import MainCard from '@/components/card/vehicle-card/main-card/MainCard'
import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper'
import ViewAllButton from '@/components/general/button/ViewAllButton'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import { StateCategoryProps, VehicleHomeFilter } from '@/types'
import { FetchVehicleCardsResponse } from '@/types/vehicle-types'

export default async function Latest({ state, category }: StateCategoryProps) {
  const baseUrl = process.env.API_URL

  // Fetch latest vehicle data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/home-page/list?page=1&limit=10&state=${state}&sortOrder=DESC&category=${category}&filter=${VehicleHomeFilter.LATEST_MODELS}`,
    { method: 'GET' }
  )

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json()
  const vehicleData = data?.result?.list || []

  if (vehicleData.length === 0) return null

  return (
    <MotionSection className="latest-section wrapper">
      <h2 className="heading">
        Latest{' '}
        <span className="yellow-gradient p-1 rounded-xl">{category}</span> for
        rent in{' '}
        <span className="capitalize yellow-gradient p-1 rounded-xl">
          {state}
        </span>
      </h2>
      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle) => (
          <MainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            state={state}
            category={category}
          />
        ))}
      </CarouselWrapper>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.LATEST_MODELS}`}
      />
    </MotionSection>
  )
}
