import { FeatureType } from '@/types/vehicle-types';
import { memo } from 'react';
import CheckMarkSVG from '../icons/CheckMarkSVG';

// Extracted FeatureItem component
export const FeatureItem = memo(({ feature }: { feature: FeatureType }) => (
  <div className="flex items-center gap-2">
    <CheckMarkSVG />

    <div className="text-sm font-normal text-text-secondary">
      {feature.name}
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';
