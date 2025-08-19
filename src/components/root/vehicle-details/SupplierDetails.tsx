import { generateCompanyProfilePageLink } from '@/helpers';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import LinkSVG from './icons/LinkSVG';
import VerifiedSVG from './icons/VerifiedSVG';

type Props = {
  companyName: string | null;
  companyId: string;
  country: string;
  companyProfile: string | null;
};

export default function SupplierDetails({
  companyName,
  companyId,
  country,
  companyProfile,
}: Props) {
  const companyPortfolioPageLink = generateCompanyProfilePageLink(
    companyName,
    companyId,
    country
  );

  const isCompanyValid = !!companyName && !!companyProfile;
  return (
    <div className="flex flex-col">
      {/* title */}
      <div className={cn('mb-6 flex w-full flex-col gap-y-3 text-left')}>
        <h4 className="text-lg font-medium text-text-primary md:text-xl lg:text-2xl">
          Supplier Details
        </h4>

        <p className="heading-secondary">
          Lorem ipsum dolor sit amet consectetur.
        </p>
      </div>

      {/* details */}

      <Link
        href={companyPortfolioPageLink}
        className="flex-between gap-x-2 rounded-[0.5rem] border bg-white px-2 py-2 transition-all hover:shadow lg:px-4"
      >
        <div className="flex w-full items-center space-x-2 lg:space-x-4">
          <div className="h-12 w-12 min-w-12 overflow-hidden rounded-full lg:h-16 lg:w-16 lg:min-w-16">
            <img
              src={
                isCompanyValid
                  ? companyProfile
                  : '/assets/img/blur-profile.webp'
              }
              alt={isCompanyValid ? companyName : 'Company logo'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-full space-y-2">
            <div className="text-wrap text-sm font-medium sm:text-base lg:text-lg">
              {isCompanyValid ? companyName : 'Not Available'}
            </div>

            {isCompanyValid && (
              <div className="flex items-center gap-x-2 text-sm text-gray-500">
                <VerifiedSVG />
                Verified Vendor
              </div>
            )}
          </div>
        </div>

        <LinkSVG />
      </Link>
    </div>
  );
}
