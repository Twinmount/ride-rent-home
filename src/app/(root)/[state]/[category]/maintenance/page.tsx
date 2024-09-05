import Image from 'next/image'
import './Maintenance.scss'
import Social from '@/components/root/vehicle details/social-media-links/Social'
import MotionSection from '@/components/general/framer-motion/MotionSection'

export default function Maintenance() {
  return (
    <MotionSection className="wrapper maintenance-section">
      <div className="maintenance-top">
        <Image
          width={400}
          height={400}
          alt="maintenance image"
          src={'/assets/img/general/maintenance.webp'}
          className="maintenance-img"
        />
      </div>
      <div className="maintenance-bottom">
        <h1>We&apos;re Down For Maintenance</h1>
        <p className="sub">
          Our Website is currently undergoing scheduled maintenance, will be
          right back in a few minutes
        </p>

        <p className="will-be-back">We&apos;ll Be Back Shortly</p>
        <Social />
      </div>
    </MotionSection>
  )
}
