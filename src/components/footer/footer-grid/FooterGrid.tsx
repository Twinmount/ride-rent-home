import React, { Suspense } from 'react'
import './FooterGrid.scss'
import { company, quick_links } from './index'
import MotionDiv from '../../general/framer-motion/MotionDiv'
import FooterLocations from './locations/FooterLocations'
import FooterVehicleCategories from './vehicle-categories/FooterVehicleCategories'
import FooterQuickLinks from './quick-links/FooterQuickLinks'
import Link from 'next/link'
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
