import './VehicleDetailsPage.scss'

import ProfileCard from '@/components/card/owner-profile-card/ProfileCard'
import WhyOpt from '@/components/common/why-opt/WhyOpt'
import Description from '@/components/root/vehicle details/description/Description'

import Specification from '@/components/root/vehicle details/specifications/Specification'
import { IoLocationOutline } from 'react-icons/io5'
import DetailsSectionClient from '@/components/root/vehicle details/DetailsSectionClient'
import Images from '@/components/root/vehicle details/vehicle-images/Images'
import VehicleFeatures from '@/components/root/vehicle details/features/Features'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import { Suspense } from 'react'
import SectionLoading from '@/components/general/section-loading/SectionLoading'
import Locations from '@/components/common/locations/Locations'
import FAQ from '@/components/common/FAQ/FAQ'
import RelatedResults from '@/components/root/vehicle details/related-results/RelatedResults'
import { VehicleDetailsResponse } from '@/types/vehicle-details-types'
import { VehicleHomeFilter } from '@/types'
import QuickLinks from '@/components/root/vehicle details/quick-links/QuickLinks'
import { notFound } from 'next/navigation'

type ParamsProps = {
  params: { state: string; category: string; vehicleId: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function VehicleDetails({
  params: { state, category, vehicleId },
  searchParams,
}: ParamsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const filter = searchParams.filter || VehicleHomeFilter.POPULAR_MODELS
  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
    { cache: 'no-store' }
  )
  const data: VehicleDetailsResponse = await response.json()

  if (data?.status === 'NOT_SUCCESS' || response.status === 400) {
    return notFound() // This will trigger the Next.js 404 page
  }

  const vehicle = data.result

  return (
    <section className="vehicle-details-section wrapper">
      {/* Details heading */}
      <MotionDiv className="heading-box">
        <h1 className="custom-heading">{vehicle?.modelName}</h1>
        <p>{vehicle?.subTitle ? vehicle?.subTitle : 'Sample subTitle'}</p>

        {/* state and first 5 cities */}
        <div className="location-container">
          <div className="location">
            <IoLocationOutline
              size={20}
              className="text-yellow relative bottom-1"
              strokeWidth={3}
              fill="yellow"
            />
          </div>
          <span className="state">{vehicle?.state.label} : </span>
          {vehicle?.cities.slice(0, 5).map((city, index) => (
            <span className="city" key={city.id}>
              {city.label}
              {index < vehicle.cities.length - 1 && index < 4 ? ', ' : ''}
            </span>
          ))}
          {vehicle?.cities.length > 3 && (
            <span className="city"> and more...</span>
          )}
        </div>
      </MotionDiv>

      {/* Vehicle Details */}
      <DetailsSectionClient
        company={vehicle?.company}
        rentalDetails={vehicle?.rentalDetails}
      >
        <section className="details-section">
          <div className="details-container">
            {/* container left */}
            <div className="details">
              {/* Images */}
              <Images photos={vehicle?.vehiclePhotos} />

              {/* Specification */}
              <Specification
                specifications={vehicle?.specs}
                vehicleCategory={category}
              />

              {/* Features */}
              <VehicleFeatures
                features={vehicle?.features}
                vehicleCategory={category}
              />
            </div>

            {/* container right */}
            <div className="right">
              {/* Profile */}
              <ProfileCard
                company={vehicle?.company}
                rentalDetails={vehicle?.rentalDetails}
              />

              <QuickLinks state={state} />
            </div>
          </div>
        </section>
      </DetailsSectionClient>

      {/* Description */}
      <Description />

      {/* related result */}
      <RelatedResults state={state} category={category} filter={filter} />

      {/* FAQ */}
      <Suspense fallback={<SectionLoading />}>
        <FAQ stateValue={state || 'dubai'} />
      </Suspense>

      {/* Why Opt Ride.Rent and Available Locations */}
      <WhyOpt state={state} category={category} />

      {/* available locations */}
      <Suspense fallback={<SectionLoading />}>
        <Locations state={state} category={category} />
      </Suspense>
    </section>
  )
}
