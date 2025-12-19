import { cn } from "@/lib/utils";

type VehicleRentalTypeBadgesProps = {
  isSelfDriveAvailable?: boolean;
  isDriverAvailable?: boolean;
};

const VehicleRentalTypeBadges = ({
  isSelfDriveAvailable,
  isDriverAvailable,
}: VehicleRentalTypeBadgesProps) => {
  // Convert undefined to false for consistent comparison
  const hasSelfDrive = isSelfDriveAvailable === true;
  const hasDriver = isDriverAvailable === true;

  const showOnlyOneType = hasSelfDrive !== hasDriver;
  const showFlexibleOptions = !showOnlyOneType; // Both true OR both false

  const badgeStyles = cn(
    "group relative inline-flex items-center gap-1.5 rounded-full overflow-hidden",
    "px-3 py-1.5 w-full",
    "sm:px-3.5 sm:py-1.5 sm:w-auto sm:min-w-[160px]",
    "md:px-4 md:min-w-[170px]",
    "bg-gradient-to-r from-gray-50 to-blue-50/30",
    "text-gray-800",
    "shadow-sm shadow-blue-100/50",
    "transition-all duration-300 ease-out",
    "hover:shadow-lg hover:shadow-blue-200/60 hover:-translate-y-0.5",
    "hover:from-gray-50 hover:to-blue-50/50",
    "animated-border"
  );

  const iconStyles =
    "h-3.5 w-3.5 flex-shrink-0 text-blue-600 drop-shadow-sm transition-transform duration-300 group-hover:scale-110";

  const textStyles =
    "truncate text-[10px] font-medium leading-none tracking-wide sm:text-[11px]";

  const renderBadge = (icon: React.ReactNode, text: string) => (
    <div className={badgeStyles}>
      <div className="shimmer-effect" />
      <div className="relative z-10 flex w-full items-center gap-1.5">
        {icon}
        <span className={textStyles}>{text}</span>
      </div>
    </div>
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
        {showOnlyOneType &&
          hasSelfDrive &&
          renderBadge(
            <svg
              className={iconStyles}
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
            </svg>,
            "Self Drive Rental"
          )}

        {showOnlyOneType &&
          hasDriver &&
          renderBadge(
            <svg
              className={iconStyles}
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>,
            "Driver Available"
          )}

        {showFlexibleOptions &&
          renderBadge(
            <svg
              className={iconStyles}
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 10h10v4H7zm0-6h10v4H7zm0 12h10v4H7z" opacity="0.3" />
              <path d="M3 14h4v-4H3v4zm0 5h4v-3H3v3zM3 9h4V5H3v4zm5 6h13v-4H8v4zm0 5h13v-3H8v3zM8 5v4h13V5H8z" />
            </svg>,
            "Flexible Rental Options"
          )}
      </div>
    </>
  );
};

export default VehicleRentalTypeBadges;
