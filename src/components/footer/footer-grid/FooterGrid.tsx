import './FooterGrid.scss'
import React, { Suspense } from 'react'
import MotionDiv from '../../general/framer-motion/MotionDiv'
import FooterLocations from './locations/FooterLocations'
import FooterVehicleCategories from './vehicle-categories/FooterVehicleCategories'
import FooterQuickLinks from './quick-links/FooterQuickLinks'
import { CompanyLinks } from './company-links/CompanyLinks'

const FooterGrid = () => {
  return (
    <MotionDiv className="footer-grid wrapper ">
      <FooterLocations />

      {/* links for the company */}
      <Suspense fallback={<div>Loading..</div>}>
        <CompanyLinks />
      </Suspense>

      {/* links related toW vehicles */}
      <FooterVehicleCategories />

      {/* quick links */}
      <Suspense fallback={<div>Loading..</div>}>
        <FooterQuickLinks />
      </Suspense>
    </MotionDiv>
  )
}

export default FooterGrid
