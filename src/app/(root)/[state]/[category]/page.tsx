import type { Metadata } from 'next'
import FAQ from '@/components/common/FAQ/FAQ'
import SectionLoading from '@/components/general/section-loading/SectionLoading'
import Affordable from '@/components/root/landing/affordable/Affordable'
import Documents from '@/components/root/landing/documents/Documents'
import RideRentFeatures from '@/components/root/landing/features/Features'
import Landing from '@/components/root/landing/landing/Landing'
import Latest from '@/components/root/landing/latest/Latest'
import Locations from '@/components/common/locations/Locations'
import States from '@/components/root/landing/states/States'
import MostPopular from '@/components/root/landing/most-popular/MostPopular'
import NewlyArrived from '@/components/root/landing/newly-arrived/NewlyArrived'
import Promotions from '@/components/root/landing/promotion/Promotions'
import TopBrands from '@/components/root/landing/top-brands/TopBrands'
import VehicleTypes from '@/components/root/landing/vehicle-types/VehicleTypes'
import { Suspense } from 'react'
import { HomePageMetaResponse, PageProps } from '@/types'

export async function generateMetadata({
  params: { state },
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL
  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/metadata/homepage?state=${state}`, {
    method: 'GET',
  })

  // Parse the JSON response
  const data: HomePageMetaResponse = await response.json()

  return {
    title: data.result.metaTitle,
    description: data.result.metaDescription,
  }
}

export default function Home({ params: { state, category } }: PageProps) {
  return (
    <>
      <Landing state={state} category={category} />
      <VehicleTypes state={state} category={category} />

      <Suspense fallback={<SectionLoading />}>
        <MostPopular state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <TopBrands state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Latest state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <NewlyArrived state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Affordable state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <States category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Promotions state={state} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <RideRentFeatures state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Documents state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <FAQ stateValue={state || 'dubai'} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Locations state={state} category={category} />
      </Suspense>
    </>
  )
}
