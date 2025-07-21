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
    <Link
      href={viewAllLink}
      className="flex h-[19.8rem] w-[16.37rem] min-w-[16.37rem] cursor-pointer flex-col gap-4 rounded border border-border-default bg-white p-3 md:w-[17.18rem] md:min-w-[17.18rem] lg:w-[18.43rem] lg:min-w-[18.43rem]"
    >
      {/* Thumbnail grid */}
      <div className="relative grid h-auto min-h-[80%] grid-cols-3 grid-rows-2 gap-1 overflow-hidden rounded-lg border">
        {filledThumbnails.map((url, idx) => (
          <div
            key={idx}
            className={`overflow-hidden rounded-[0.3rem] ${idx === 0 ? 'col-span-2' : ''} ${idx === 3 ? 'col-span-2' : ''}`}
          >
            <img
              src={url}
              alt={`Vehicle ${idx + 1}`}
              className={`h-full w-full object-cover`}
            />
          </div>
        ))}

        {/* Absolute round badge in center */}
        <div className="text-md absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 font-medium text-white">
          +{totalCount}
        </div>
      </div>

      {/* Label and View All */}
      <div className="text-center">
        <p className="text-sm text-gray-600">{label}</p>
        <span className="mt-2 text-base font-semibold text-black">
          View All
        </span>
      </div>
    </Link>
  );
};

export default ViewAllGridCard;
