import './Features.scss'
import FeaturesSidebar from './features-sidebar/FeaturesSidebar'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import { MotionH2 } from '@/components/general/framer-motion/MotionElm'
import { FeatureType } from '@/types/vehicle-types'

type VehicleFeaturesProps = {
  features: Record<string, FeatureType[]>
  vehicleCategory: string
}

const VehicleFeatures = ({
  features,
  vehicleCategory,
}: VehicleFeaturesProps) => {
  // Flatten the features object to get a limited number of features
  const featureEntries = Object.entries(features)
  const limitedFeatures: { category: string; features: FeatureType[] }[] = []

  // Loop over the categories and features to pick up to 2 categories
  for (let [category, featureList] of featureEntries) {
    if (limitedFeatures.length >= 2) break

    limitedFeatures.push({
      category,
      features: featureList,
    })
  }

  return (
    <div className="features-section">
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="custom-heading"
      >
        Features
      </MotionH2>
      <MotionDiv className="features">
        {limitedFeatures.map(({ category, features }) => (
          <div key={category} className="feature-category">
            <h3 className="feature-category-heading">{category}</h3>
            {features.map((feature) => (
              <div key={feature.value} className="feature">
                <span className="entity">&raquo;</span>
                <div className="feature-details">
                  <span className="feature-label">{feature.name}</span>
                  {/* Optionally display the feature value */}
                  <span className="feature-value">{feature.value}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </MotionDiv>

      {/* Features Sidebar */}
      <div className="overlay">
        <FeaturesSidebar
          features={features}
          vehicleCategory={vehicleCategory}
        />
      </div>
    </div>
  )
}

export default VehicleFeatures
