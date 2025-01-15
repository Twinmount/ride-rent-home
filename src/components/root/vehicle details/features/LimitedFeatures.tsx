"use client";
import React from "react";
import { FeatureType } from "@/types/vehicle-types";
import { useMemo } from "react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";

const LimitedFeatures = ({ features }: { features: Record<string, FeatureType[]> }) => {

    const getLimitedFeatures = (
    features: Record<string, FeatureType[]>,
    maxCategories: number,
    maxFeaturesPerCategory: number,
  ) => {
    const limited: { category: string; features: FeatureType[] }[] = [];

    for (const [category, featureList] of Object.entries(features)) {
      if (limited.length >= maxCategories) break;

      const filteredFeatures = featureList
        .filter((f) => f.selected)
        .slice(0, maxFeaturesPerCategory);

      if (filteredFeatures.length > 0) {
        limited.push({ category, features: filteredFeatures });
      }
    }

    return limited;
  };

  // Memoize the limited features computation
  const limitedFeatures = useMemo(
    () => getLimitedFeatures(features, 2, 8),
    [features],
  );

  // Extracted FeatureItem component for rendering each feature
  const FeatureItem = React.memo(({ feature }: { feature: FeatureType }) => (
    <div className="flex items-center gap-1.5">
      <span className="text-lg text-yellow">&raquo;</span>
      <div className="whitespace-nowrap text-xs font-normal text-gray-600 md:text-sm">
        {feature.name}
      </div>
    </div>
  ));

  return (
    <MotionDiv className="grid h-auto max-h-80 gap-4 rounded-2xl md:grid-cols-3">
      {limitedFeatures.map(({ category, features }) => (
        <div key={category} className="mt-3 min-w-fit">
          <h3 className="mb-2 text-base">{category}</h3>
          {features.map((feature) => (
            <FeatureItem key={feature.value} feature={feature} />
          ))}
        </div>
      ))}
    </MotionDiv>
  );
};
export default LimitedFeatures;
