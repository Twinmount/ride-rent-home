import './HeadingBanner.scss'
import { MotionH1 } from '../framer-motion/MotionElm'

export default function HeadingBanner({ heading }: { heading: string }) {
  return (
    <div
      style={{
        backgroundImage: `url('/assets/img/general/texture.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="heading-banner"
    >
      <MotionH1
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.5, delay: 0 }}
        viewport={{ once: true }}
        className="heading-banner-heading text-white"
        style={{ color: 'white', opacity: 1 }}
      >
        {heading}
      </MotionH1>
    </div>
  )
}
