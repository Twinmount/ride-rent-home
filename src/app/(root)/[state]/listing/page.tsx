import './ListingPage.scss'
import Filter from '@/components/root/listing/filter/Filter'
import GridSwitch from '@/components/root/listing/grid-switch/GridSwitch'
import LimitDropdown from '@/components/root/listing/limit-dropdown/LimitDropdown'
import VehicleGrid from '@/components/root/listing/vehicle-grids/VehicleGrid'
import { PageProps } from '@/types'
import { FC } from 'react'

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
