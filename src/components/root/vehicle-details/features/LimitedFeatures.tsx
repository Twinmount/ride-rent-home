'use client';
import React, { useState, useMemo } from 'react';
import { FeatureType } from '@/types/vehicle-types';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import { FeatureItem } from './FeatureSidebarItem';

const LimitedFeatures = ({
  features,
}: {
  features: Record<string, FeatureType[]>;
}) => {
  // Get available categories (only those with selected features)
  const availableCategories = useMemo(() => {
    return Object.entries(features)
      .filter(([_, featureList]) =>
        featureList.some((feature) => feature.selected)
      )
      .map(([category, _]) => category);
  }, [features]);

  // Set first available category as default active
  const [activeCategory, setActiveCategory] = useState<string>(
    availableCategories[0] || ''
  );

  // Get selected features for the active category
  const activeFeatures = useMemo(() => {
    if (!activeCategory || !features[activeCategory]) return [];

    return features[activeCategory]
      .filter((feature) => feature.selected)
      .slice(0, 15); // Show up to 15 features for the active category
  }, [features, activeCategory]);

  // If no categories available, show empty state
  if (availableCategories.length === 0) {
    return (
      <MotionDiv className="py-8 text-center text-gray-500">
        No features available
      </MotionDiv>
    );
  }

  // Get only the first 4 available categories
  const visibleCategories = availableCategories.slice(0, 4);

  // Calculate how many more categories there are
  const extraCategoriesCount = availableCategories.length - 4;

  return (
    <MotionDiv className="mt-4">
      {/* Category Tabs */}
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap border-b-4 px-4 py-2 text-sm transition-colors duration-200 ${
                activeCategory === category
                  ? 'border-accent font-medium text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}

          {/* Show extra categories indicator */}
          {extraCategoriesCount > 0 && (
            <div className="flex cursor-pointer items-center whitespace-nowrap px-3 py-2 text-sm text-accent">
              +{extraCategoriesCount} More
            </div>
          )}
        </div>

        {/* Right fade indicator  */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      {/* Active Category Features */}
      <div className="mt-6">
        {activeFeatures.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeFeatures.map((feature) => (
              <FeatureItem key={feature.value} feature={feature} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No features available in this category
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default LimitedFeatures;
