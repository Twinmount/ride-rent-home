import React, { Suspense } from 'react'
import './FooterGrid.scss'
import { company, quick_links } from './index'
import MotionDiv from '../../general/framer-motion/MotionDiv'
import FooterLocations from './locations/FooterLocations'
import FooterVehicleCategories from './vehicle-categories/FooterVehicleCategories'
import FooterQuickLinks from './quick-links/FooterQuickLinks'
import Link from 'next/link'

const FooterGrid = () => {
  return (
    <MotionDiv className="footer-grid wrapper ">
      <FooterLocations />

      {/* links for the company */}
      <div className="footer-section">
        <h3 className="footer-grid-headings">Company</h3>
        <div className="footer-links">
          {company.map((item) => (
            <Link href={item.link} className="link-wrapper" key={item.id}>
              &sdot; <span className="link">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* links related to vehicles */}
      <FooterVehicleCategories />

      {/* quick links */}
      <Suspense fallback={<div>Loading..</div>}>
        <FooterQuickLinks />
      </Suspense>
    </MotionDiv>
  )
}

export default FooterGrid
