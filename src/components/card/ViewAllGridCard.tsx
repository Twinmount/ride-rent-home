import Link from 'next/link';

type ViewAllGridCardProps = {
  thumbnails: string[];
  viewAllLink: string;
  totalCount: number;
  label: string;
};

/**
 * ViewAllGridCard displays a grid of vehicle thumbnails at the end of FeaturedVehicles carousel.
 * with a total count badge and a "View All" link.
 */
const ViewAllGridCard = ({
  thumbnails,
  viewAllLink,
  totalCount,
  label,
}: ViewAllGridCardProps) => {
  const placeholder = '/assets/img/placeholder/vehicle-grid-placeholder.webp';

  // Fill thumbnails to ensure we always have 4
  const filledThumbnails = [
    ...thumbnails,
    ...Array(4 - thumbnails.length).fill(placeholder),
  ];

  return (
    <div className="flex items-center">
      {' '}
      {/* Added flex container with items-center */}
      <Link
        href={viewAllLink}
        className="flex h-[12rem] w-[10rem] min-w-[10rem] cursor-pointer flex-col gap-2 rounded border border-border-default bg-white p-2 md:w-[10.5rem] md:min-w-[10.5rem] lg:w-[11rem] lg:min-w-[11rem]"
      >
        {/* Thumbnail grid */}
        <div className="relative grid h-auto min-h-[75%] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg border">
          {filledThumbnails.slice(0, 4).map((url, idx) => (
            <div key={idx} className="overflow-hidden rounded-[0.2rem]">
              <img
                src={url}
                alt={`Vehicle ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          {/* Absolute round badge in center */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-xs font-medium text-white">
            +{totalCount}
          </div>
        </div>

        {/* Label and View All */}
        <div className="text-center">
          <p className="text-xs text-gray-600">{label}</p>
          <span className="mt-1 text-sm font-semibold text-black">
            View All
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ViewAllGridCard;