'use client';

import { VehicleBadge } from './VehicleBadge';
import { BadgeId, vehicleBadgesConfig } from './vehicleBadgesConfig';
import { cn } from '@/lib/utils';

type VehicleBadgesGroupProps = {
  hasZeroDeposit: boolean;
  hasFancyNumber: boolean;
  hasHourlyRental: boolean;
  className?: string;
};

export const VehicleBadgesGroup = ({
  hasZeroDeposit,
  hasFancyNumber,
  hasHourlyRental,
  className,
}: VehicleBadgesGroupProps) => {
  // Build array of badge IDs based on props
  const activeBadgeIds = [
    hasZeroDeposit && BadgeId.ZeroDeposit,
    hasFancyNumber && BadgeId.FancyNumber,
    hasHourlyRental && BadgeId.HourlyRental,
  ];

  // Build array of badge objects
  const badgesToRender = activeBadgeIds.map((badgeId) => {
    const badge = vehicleBadgesConfig.find((b) => b.id === badgeId);
    return badge;
  });

  if (badgesToRender.length === 0) return null;

  return (
    <div className={cn('absolute left-2 top-2 z-10 flex gap-1', className)}>
      {badgesToRender.map((badge) => {
        return badge ? <VehicleBadge key={badge.id} {...badge} /> : null;
      })}
    </div>
  );
};
