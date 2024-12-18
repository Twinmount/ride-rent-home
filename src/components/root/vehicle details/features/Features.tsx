import "./Features.scss";
import FeaturesSidebar from "./features-sidebar/FeaturesSidebar";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { MotionH2 } from "@/components/general/framer-motion/MotionElm";
import { FeatureType } from "@/types/vehicle-types";

type VehicleFeaturesProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
};

const VehicleFeatures = ({
  features,
  vehicleCategory,
}: VehicleFeaturesProps) => {
  const getLimitedFeatures = (
    features: Record<string, FeatureType[]>,
    maxCategories: number,
    maxFeaturesPerCategory: number
  ) => {
    const limited: { category: string; features: FeatureType[] }[] = [];

    // Loop over the entries in the features object
    for (let [category, featureList] of Object.entries(features)) {
      if (limited.length >= maxCategories) break;

      // Select a limited number of features per category
      const filteredFeatures = featureList
        .filter((f) => f.selected)
        .slice(0, maxFeaturesPerCategory);

      if (filteredFeatures.length > 0) {
        limited.push({
          category,
          features: filteredFeatures,
        });
      }
    }

    return limited;
  };

  const limitedFeatures = getLimitedFeatures(features, 2, 8);

  // console.log("features : ", features);
  // console.log("limited features : ", limitedFeatures);

  return (
    <div className="features-section">
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", duration: 0.5, delay: 0.1 }}
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
  );
};

export default VehicleFeatures;
