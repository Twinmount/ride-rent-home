import { CircleCheck } from 'lucide-react';
import { CompanySpecs } from '@/types/vehicle-details-types';

type CompanySpecificationsProps = {
  specs: CompanySpecs;
};

const CompanySpecifications = ({ specs }: CompanySpecificationsProps) => {
  const specifications = [
    {
      key: 'crypto',
      label: 'Crypto Accepted',
      isActive: specs.isCryptoAccepted,
    },
    {
      key: 'delivery',
      label: specs.isSpotDeliverySupported
        ? 'Free Spot Delivery'
        : 'Collect At Point',
      isActive: true, // Always show delivery option
    },
    {
      key: 'cards',
      label: 'Accepts all cards',
      isActive: specs.isCreditOrDebitCardsSupported,
    },
    {
      key: 'tabby',
      label: 'Tabby Supported',
      isActive: specs.isTabbySupported,
    },
  ];

  // Filter to only show active specifications
  const activeSpecs = specifications.filter((spec) => spec.isActive);

  if (activeSpecs.length === 0) return null;
  console.log('Active Specifications:', activeSpecs);

  return (
    <div className="border-b-2 border-[E2E2E2] px-4 py-6 text-xs font-light text-text-secondary">
      {/* Desktop view - horizontal layout */}
      <div className="hidden items-center justify-between sm:flex">
        {activeSpecs.map((spec) => (
          <div key={spec.key} className="flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full text-green-500">
              <CircleCheck />
            </div>
            <span>{spec.label}</span>
          </div>
        ))}
      </div>

      {/* Mobile view - 2 per row with centering for odd last item */}
      <div className="sm:hidden">
        {/* First row - always 2 items if available */}
        <div className="mb-4 flex items-center justify-between">
          {activeSpecs.slice(0, 2).map((spec) => (
            <div key={spec.key} className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-green-500">
                <CircleCheck />
              </div>
              <span className="whitespace-nowrap text-xs leading-tight">
                {spec.label}
              </span>
            </div>
          ))}
        </div>

        {/* Second row - center if only one item */}
        {activeSpecs.length > 2 && (
          <div className="flex items-center justify-center">
            {activeSpecs.slice(2, 3).map((spec) => (
              <div key={spec.key} className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-green-500">
                  <CircleCheck />
                </div>
                <span className="whitespace-nowrap text-xs leading-tight">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySpecifications;
