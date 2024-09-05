import './Features.scss'
import { featureCards } from './index'
import FeaturesCard from '@/components/card/features-card/FeaturesCard'
import FeatureLocation from './FeatureLocation'
import MotionSection from '@/components/general/framer-motion/MotionSection'

const Features = () => {
  return (
    <MotionSection className="features_section wrapper">
      <FeatureLocation />
      <div className="description">
        <p>
          Discover the best of Dubai with our affordable and reliable car rental
          service.
          <br /> Whether you&apos;re visiting the main locations or exploring
          hidden gems, our diverse fleet offers the perfect match for your
          travel needs. <br /> Experience hassle-free car rental with
          transparent pricing and no hidden fees.
        </p>
        <br />
        <p className="second-paragraph">
          Our commitment to reliability means your vehicle will be ready and
          waiting, wherever and whenever you need it. Choose us for a
          stress-free car rental experience in Dubai, and drive away with
          confidence and comfort.
        </p>
      </div>

      <div className="feature_card_container">
        {featureCards.map((feature) => (
          <FeaturesCard key={feature.key} data={feature} />
        ))}
      </div>
    </MotionSection>
  )
}
export default Features
