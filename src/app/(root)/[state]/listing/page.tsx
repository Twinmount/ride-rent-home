import './ListingPage.scss'
import Filter from '@/components/root/listing/filter/Filter'
import GridSwitch from '@/components/root/listing/grid-switch/GridSwitch'
import LimitDropdown from '@/components/root/listing/limit-dropdown/LimitDropdown'
import VehicleGrid from '@/components/root/listing/vehicle-grids/VehicleGrid'
import { ListingPageMetaResponse, PageProps } from '@/types'
import { Metadata } from 'next'
import { FC } from 'react'

export async function generateMetadata({
  params: { state },
  searchParams,
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL

  // Default to 'cars' if category is undefined, otherwise use the value from searchParams
  const category = searchParams.category || 'cars'

  // Get vehicleTypes and use 'other' if not provided
  const vehicleType = searchParams.vehicleTypes
    ? searchParams.vehicleTypes.split(',')[0] // Split by comma and take the first one
    : 'other' // Use 'other' as the default value if vehicleType is not available

  // Construct the API URL with state, category, and vehicleType
  let url = `${baseUrl}/metadata/listing?state=${state}`

  if (category) {
    url += `&category=${category}`
  }

  if (vehicleType) {
    url += `&vehicleType=${vehicleType}`
  }

  try {
    // Fetch brand data from your API endpoint
    const response = await fetch(url, {
      method: 'GET',
    })

    // Parse the JSON response
    const data: ListingPageMetaResponse = await response.json()

    // Check if the API returned valid meta data
    if (data?.result?.metaTitle && data?.result?.metaDescription) {
      return {
        title: data.result.metaTitle,
        description: data.result.metaDescription,
      }
    } else {
      // If metadata is not found or incomplete, fall back to default meta information
      return {
        title: `Explore the best ${category} for rent in ${state}`,
        description:
          'Find and rent top-quality vehicles including cars, bikes, and more across various locations.',
      }
    }
  } catch (error) {
    // If there is an error with the API call, return fallback metadata
    return {
      title: `Explore the best ${category} for rent in ${state}`,
      description:
        'Find and rent top-quality vehicles including cars, bikes, and more across various locations.',
    }
  }
}

const ListingPage: FC<PageProps> = ({ searchParams, params: { state } }) => {
  // Determine the initial view based on URL parameters
  const isGridView = searchParams.view === 'grid'
  const page = parseInt(searchParams.page || '1', 10)

  return (
    <div className="listing-section wrapper">
      <div className="listing-navbar">
        <div className="list-navbar-right">
          {/* Limit dropdown */}
          <LimitDropdown />
          {/* grid vs list switch button */}
          <GridSwitch isGridView={isGridView} />
        </div>
      </div>

      <div className="listing-container">
        {/*dynamically imported filter */}
        <Filter category={searchParams.category} isMobile={false} />

        {/* vehicle grid */}
        <VehicleGrid isGridView={isGridView} page={page} state={state} />
      </div>
    </div>
  )
}

export default ListingPage
