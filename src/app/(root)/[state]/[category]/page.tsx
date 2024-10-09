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
  params: { state, category },
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL
  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/metadata/homepage?state=${state}`, {
    method: 'GET',
  })

  // Parse the JSON response
  const data: HomePageMetaResponse = await response.json()

  // Construct the canonical URL dynamically
  const canonicalUrl = `https://ride.rent/${state}/${category}`

  // Fallback image for OpenGraph/Twitter if not provided by the API
  const ogImage = '/assets/icons/ride-rent.png'

  // Construct short versions for social media
  const shortTitle =
    data?.result?.metaTitle.length > 60
      ? `${data?.result?.metaTitle.substring(0, 57)}...`
      : data?.result?.metaTitle

  const shortDescription =
    data?.result?.metaDescription.length > 155
      ? `${data?.result?.metaDescription.substring(0, 152)}...`
      : data?.result?.metaDescription

  return {
    title: data?.result?.metaTitle, // Dynamic title from API
    description: data?.result?.metaDescription, // Dynamic description from API
    keywords: [
      'ride rent',
      'vehicle rental near me',
      `${category} rent near me`,
      `${category} rent in ${state}`,
    ],
    openGraph: {
      title: shortTitle, // Shortened title for OpenGraph
      description: shortDescription, // Shortened description for OpenGraph
      url: canonicalUrl, // Canonical URL for the page
      type: 'website', // Type of content (website)
      images: [
        {
          url: ogImage, // OpenGraph image URL
          alt: `${data?.result?.metaTitle} `,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image', // Twitter card type
      title: shortTitle, // Shortened title for Twitter
      description: shortDescription, // Shortened description for Twitter
      images: [ogImage], // Twitter image
    },
    manifest: '/manifest.webmanifest', // PWA manifest
    robots: {
      index: true, // Allow page to be indexed
      follow: true, // Allow search engines to follow links
      nocache: true, // Don't cache the page
      googleBot: {
        index: true, // Google should index the page
        follow: true, // Google should follow links
        noimageindex: true, // Prevent images from being indexed
        'max-video-preview': -1, // No limit on video preview length
        'max-image-preview': 'large', // Allow large image previews
        'max-snippet': -1, // No limit on snippet length
      },
    },
    alternates: {
      canonical: canonicalUrl, // Canonical URL
    },
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
