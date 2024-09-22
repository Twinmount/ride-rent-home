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
import { Metadata } from 'next'

type ParamsProps = {
  params: { state: string; category: string; vehicleId: string }
  searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata({
  params: { vehicleId },
}: ParamsProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL
  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
    {
      method: 'GET',
    }
  )

  // Parse the JSON response
  const data: VehicleDetailsResponse = await response.json()

  // Determine the seat part of the title
  let seatPart = ''
  const seats = data.result.specs['Seating Capacity']?.value

  if (seats) {
    seatPart = seats === '1' ? 'Single Seater' : `${seats} Seater`
  }

  // Construct the title
  const title = `Affordable premium ${data.result.brand.label} ${
    data.result.modelName
  } ${data.result.subTitle} | Hire for rent in ${data.result.state.label}${
    seatPart ? `, ${seatPart}` : ''
  }`

  // Construct the description using dynamic values from the response
  const description = `Looking to hire a premium ${data.result.brand.label} ${
    data.result.modelName
  } ${data.result.subTitle} in ${
    data.result.state.label
  }? Ride.Rent offers the ${
    seats === '1' ? 'single' : seats
  } seater luxury vehicle for rent at affordable rates. Perfect for business trips, city tours, or personal travel, this stylish and comfortable car provides a top-notch driving experience. Enjoy flexible rental terms, daily, weekly, or monthly, with no hidden fees. Book your ${
    data.result.brand.label
  } ${
    data.result.modelName
  } today with Ride.Rent and enjoy a smooth ride through ${
    data.result.state.label
  }'s vibrant cityscape!`

  return {
    title,
    description,
  }
}

export default async function VehicleDetails({
  params: { state, category, vehicleId },
  searchParams,
}: ParamsProps) {
  const baseUrl = process.env.API_URL
  const filter = searchParams.filter || VehicleHomeFilter.POPULAR_MODELS
  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
    { cache: 'no-store' }
  )
  const data: VehicleDetailsResponse = await response.json()

  if (data?.status === 'NOT_SUCCESS' || response.status === 400) {
    return notFound()
  }

  const vehicle = data.result

  return (
    <section className="vehicle-details-section wrapper">
      {/* Details heading */}
      <MotionDiv className="heading-box">
        <h1 className="custom-heading model-name">{vehicle?.modelName}</h1>
        <p className="custom-sub-heading">
          Rent {vehicle?.brand.label} {vehicle?.modelName} model in{' '}
          {vehicle?.state.label}. Enjoy flexible rental terms with no hidden
          fees.
          {vehicle?.company.companySpecs.isCryptoAccepted
            ? 'Crypto payments are accepted.'
            : 'Crypto payments are not accepted.'}
          Available for {vehicle?.rentalDetails.day.enabled ? 'Daily' : ''}
          {vehicle?.rentalDetails.week.enabled ? ', Weekly' : ''}
          {vehicle?.rentalDetails.month.enabled ? ', Monthly' : ''}
          Rentals.
        </p>

        {/* state and first 5 cities */}
        <div className="location-container">
          <span className="location">
            <IoLocationOutline
              size={20}
              className="text-yellow relative bottom-[2px]"
              strokeWidth={3}
              fill="yellow"
            />
          </span>
          <span className="state">{vehicle?.state.label} : </span>
          <span className="city-list-subheading">
            {vehicle?.cities.slice(0, 5).map((city, index) => (
              <span className="city" key={city.id}>
                {city.label}
                {index < vehicle.cities.length - 1 && index < 4 ? ', ' : ''}
              </span>
            ))}
            {vehicle?.cities.length > 3 && (
              <span className="city"> and more...</span>
            )}
          </span>
        </div>
      </MotionDiv>

      {/* Vehicle Details */}
      <DetailsSectionClient
        company={vehicle?.company}
        rentalDetails={vehicle?.rentalDetails}
        vehicleId={vehicleId}
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
                vehicleId={vehicleId}
              />

              <QuickLinks state={state} />
            </div>
          </div>
        </section>
      </DetailsSectionClient>

      {/* Description */}
      <Description description={vehicle.description} />

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
