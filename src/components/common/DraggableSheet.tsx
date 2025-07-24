'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';

type DraggableSheetProps = {
  children: React.ReactNode;
  mapContent: React.ReactNode;
};

export default function DraggableSheet({
  children,
  mapContent,
}: DraggableSheetProps) {
  const [containerHeight, setContainerHeight] = useState(600);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const y = useMotionValue(0);
  const controls = useAnimation();

  // Calculate positions based on container height (not screen height)
  const COLLAPSED_HEIGHT = containerHeight * 0.4; // Show 40% of sheet
  const EXPANDED_HEIGHT = containerHeight * 0.95; // Show 95% of sheet
  const HANDLE_HEIGHT = 60; // Handle area height

  const collapsedY = containerHeight - COLLAPSED_HEIGHT;
  const expandedY = containerHeight - EXPANDED_HEIGHT;

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height);
      }
    };

    // Initial measurement
    updateContainerHeight();

    // Update on resize
    window.addEventListener('resize', updateContainerHeight);

    // Use ResizeObserver for more accurate container size changes
    const resizeObserver = new ResizeObserver(updateContainerHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateContainerHeight);
      resizeObserver.disconnect();
    };
  }, []);

  // Initialize position after container height is measured
  useEffect(() => {
    if (containerHeight > 0) {
      const initialY = containerHeight - COLLAPSED_HEIGHT;
      controls.start({ y: initialY });
      y.set(initialY);
    }
  }, [containerHeight, COLLAPSED_HEIGHT, controls, y]);

  const handleDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const currentY = y.get();

    // Calculate the midpoint for snapping decision
    const midPoint = (collapsedY + expandedY) / 2;

    // Determine direction based on velocity and position
    const shouldExpand =
      velocity < -300 || // Fast upward swipe
      (Math.abs(velocity) < 300 && currentY < midPoint) || // Slow drag past midpoint
      (offset < -100 && !isExpanded); // Significant upward drag when collapsed

    const shouldCollapse =
      velocity > 300 || // Fast downward swipe
      (Math.abs(velocity) < 300 && currentY >= midPoint) || // Slow drag past midpoint
      (offset > 100 && isExpanded); // Significant downward drag when expanded

    if (shouldExpand && !isExpanded) {
      setIsExpanded(true);
      controls.start({
        y: expandedY,
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      });
    } else if (shouldCollapse && isExpanded) {
      setIsExpanded(false);
      controls.start({
        y: collapsedY,
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      });
    } else {
      // Snap back to current state
      controls.start({
        y: isExpanded ? expandedY : collapsedY,
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      });
    }
  };

  // Handle touch/scroll interactions within the content area
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExpanded) return;

    const content = contentRef.current;
    const handle = handleRef.current;

    if (!content || !handle) return;

    // Check if touch started on the handle area
    const rect = handle.getBoundingClientRect();
    const touch = e.touches[0];
    const isTouchingHandle =
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom &&
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right;

    // If touching the handle, allow drag behavior
    if (isTouchingHandle) {
      return;
    }

    // If at top of scroll and trying to scroll up, prepare to collapse
    if (content.scrollTop <= 0) {
      const startY = touch.clientY;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentTouch = moveEvent.touches[0];
        const deltaY = currentTouch.clientY - startY;

        // If scrolling down significantly, collapse the sheet
        if (deltaY > 50) {
          setIsExpanded(false);
          controls.start({
            y: collapsedY,
            transition: { type: 'spring', damping: 25, stiffness: 300 },
          });

          // Clean up listeners
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  return (
    <div
      ref={containerRef}
      className="no-global-padding relative overflow-hidden"
      style={{
        height: '80vh',
        minHeight: '500px',
      }}
    >
      {/* Map Background - Always visible */}
      <div className="absolute inset-0 z-10 bg-gray-100">{mapContent}</div>

      {/* Draggable Sheet */}
      <motion.div
        ref={sheetRef}
        className="absolute left-0 z-20 w-full bg-white shadow-2xl"
        style={{
          height: containerHeight,
          y,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        drag="y"
        dragConstraints={{ top: expandedY, bottom: collapsedY }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      >
        {/* Drag Handle */}
        <div
          ref={handleRef}
          className="flex w-full cursor-grab justify-center rounded-t-2xl border-b border-gray-100 bg-white py-3 active:cursor-grabbing"
          style={{ height: HANDLE_HEIGHT }}
        >
          <div className="h-1.5 w-16 rounded-full bg-gray-400" />
        </div>

        {/* Sheet Content */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto bg-white pb-20"
          style={{ height: `calc(100% - ${HANDLE_HEIGHT}px)` }}
          onTouchStart={handleTouchStart}
        >
          <div className="px-1 py-2">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
