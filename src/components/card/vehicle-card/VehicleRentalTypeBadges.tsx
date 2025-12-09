import { cn } from "@/lib/utils";

type VehicleRentalTypeBadgesProps = {
  isSelfDriveAvailable?: boolean;
  isDriverAvailable?: boolean;
};

const VehicleRentalTypeBadges = ({
  isSelfDriveAvailable,
  isDriverAvailable,
}: VehicleRentalTypeBadgesProps) => {
  // Show only if ONE is true, not both
  const showOnlyOneType = isSelfDriveAvailable !== isDriverAvailable;

  if (!showOnlyOneType) return null;

  const badgeStyles = cn(
    // Layout
    "group relative inline-flex items-center gap-1.5 rounded-full overflow-hidden",
    // Responsive padding
    "px-3 py-1.5 w-full",
    "sm:px-3.5 sm:py-1.5 sm:w-auto sm:min-w-[160px]",
    "md:px-4 md:min-w-[170px]",
    // Colors - subtle gradient
    "bg-gradient-to-r from-gray-50 to-blue-50/30",
    "text-gray-800",
    // Shadow with glow
    "shadow-sm shadow-blue-100/50",
    // Hover
    "transition-all duration-300 ease-out",
    "hover:shadow-lg hover:shadow-blue-200/60 hover:-translate-y-0.5",
    "hover:from-gray-50 hover:to-blue-50/50"
  );

  return (
    <>
      <style>{`
        @keyframes border-glow {
          0%, 100% {
            background-position: 0% 50%;
            opacity: 0.6;
          }
          50% {
            background-position: 100% 50%;
            opacity: 1;
          }
        }
        
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animated-border {
          position: relative;
        }
        
        .animated-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1.5px;
          background: linear-gradient(90deg, 
            rgba(59, 130, 246, 0.2),
            rgba(96, 165, 250, 0.6),
            rgba(147, 197, 253, 0.8),
            rgba(59, 130, 246, 0.9),
            rgba(147, 197, 253, 0.8),
            rgba(96, 165, 250, 0.6),
            rgba(59, 130, 246, 0.2)
          );
          background-size: 300% 100%;
          animation: border-glow 3s ease-in-out infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          filter: blur(0.5px);
        }
        
        .shimmer-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.4), 
            transparent
          );
          animation: shimmer-slide 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex w-full items-center sm:w-auto">
        {isSelfDriveAvailable && (
          <div className={cn(badgeStyles, "animated-border")}>
            {/* Inner shimmer effect */}
            <div className="shimmer-effect" />

            <div className="relative z-10 flex w-full items-center gap-1.5">
              {/* Car icon with subtle glow */}
              <svg
                className="h-3.5 w-3.5 flex-shrink-0 text-blue-600 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
              </svg>

              <span className="truncate text-[10px] font-medium leading-none tracking-wide sm:text-[11px]">
                Self Drive Available
              </span>
            </div>
          </div>
        )}

        {isDriverAvailable && (
          <div className={cn(badgeStyles, "animated-border")}>
            {/* Inner shimmer effect */}
            <div className="shimmer-effect" />

            <div className="relative z-10 flex w-full items-center gap-1.5">
              {/* Driver icon with subtle glow */}
              <svg
                className="h-3.5 w-3.5 flex-shrink-0 text-blue-600 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>

              <span className="truncate text-[10px] font-medium leading-none tracking-wide sm:text-[11px]">
                Driver Available
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleRentalTypeBadges;
