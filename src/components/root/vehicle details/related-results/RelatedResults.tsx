import MainCard from '@/components/card/vehicle-card/main-card/MainCard'
import './RelatedResults.scss'
import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import { VehicleHomeFilter } from '@/types'
import { FetchVehicleCardsResponse } from '@/types/vehicle-types'

export default async function RelatedResults({
  state,
  category,
  filter,
}: {
  state: string
  category: string
  filter: string
}) {
  const baseUrl = process.env.API_URL
  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/home/affordable?page=1&limit=10&sortOrder=DESC&category=${category}&filter=${filter}}`,
    { method: 'GET' }
  )

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json()

  const vehicleData = data?.result?.list || []

  if (vehicleData.length === 0) return null

  return (
    <MotionSection className="wrapper">
      <h2 className="heading">Related results</h2>
      <CarouselWrapper>
        {vehicleData.map((vehicle) => (
          <MainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            state={state}
            category={category}
          />
        ))}
      </CarouselWrapper>
    </MotionSection>
  )
}
