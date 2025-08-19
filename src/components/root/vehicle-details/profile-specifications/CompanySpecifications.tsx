import { Check, CircleCheck } from "lucide-react";
import { CompanySpecs } from "@/types/vehicle-details-types";

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
      label: specs.isSpotDeliverySupported ? 'Free Spot Delivery' : 'Collect At Point',
      isActive: true, // Always show delivery option
    },
    {
      key: 'cards',
      label: 'Accepts Credit/Debit Cards',
      isActive: specs.isCreditOrDebitCardsSupported,
    },
    {
      key: 'tabby',
      label: 'Tabby Supported',
      isActive: specs.isTabbySupported,
    },
  ];

  // Filter to only show active specifications
  const activeSpecs = specifications.filter(spec => spec.isActive);

  if (activeSpecs.length === 0) return null;
  console.log('Active Specifications:', activeSpecs);

  return (
    <div className="flex flex-wrap items-center text-sm font-light justify-between px-4 text-text-secondary py-6 border-b-2 border-[E2E2E2]">
      {activeSpecs.map((spec) => (
        <div key={spec.key} className="flex items-center gap-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full text-green-500">
            <CircleCheck  />
          </div>
          <span >
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CompanySpecifications;