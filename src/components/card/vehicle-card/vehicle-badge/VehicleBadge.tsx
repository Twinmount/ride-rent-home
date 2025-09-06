'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { BadgeId, VehicleBadgeConfig } from './vehicleBadgesConfig';

type VehicleBadgeProps = Omit<VehicleBadgeConfig, 'id'> & {
  id: BadgeId;
};

const colorThemes: Record<BadgeId, string> = {
  'zero-deposit': 'bg-green-100 text-green-800',
  'fancy-number': 'bg-blue-100 text-blue-800',
  'hourly-rental': 'bg-red-100 text-red-500',
};

export const VehicleBadge = ({
  id,
  icon: Icon,
  title,
  description,
}: VehicleBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the color theme based on the badge ID
  const color = colorThemes[id];

  return (
    <HoverCard openDelay={500} closeDelay={50}>
      <HoverCardTrigger asChild>
        <motion.div
          className={cn(
            'relative flex h-8 cursor-default items-center overflow-hidden rounded-full',
            color
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            width: isHovered ? 'auto' : '2rem',
            paddingRight: isHovered ? '0.75rem' : '0rem',
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1], // Smooth easing
          }}
          style={{ minWidth: '2rem' }}
        >
          {/* Icon container - always visible */}
          <div className="flex h-full w-8 flex-shrink-0 items-center justify-center">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>

          {/* Text container - with smooth clip animation */}
          <motion.div
            className="flex h-full items-center overflow-hidden"
            animate={{
              width: isHovered ? 'auto' : '0px',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
              delay: isHovered ? 0.05 : 0,
            }}
          >
            <span className="ml-1 whitespace-nowrap text-sm font-medium">
              {title}
            </span>
          </motion.div>
        </motion.div>
      </HoverCardTrigger>

      {/* HoverCard popup */}
      <HoverCardContent className="w-64 bg-white" side="bottom" align="start">
        <h4 className="font-semibold text-accent">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
