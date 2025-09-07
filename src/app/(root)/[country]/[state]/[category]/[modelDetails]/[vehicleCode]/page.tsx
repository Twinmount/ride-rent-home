import Description from '@/components/root/vehicle-details/description/Description';
import Specification from '@/components/root/vehicle-details/specification/Specification';
import DetailsSectionClientWrapper from '@/components/root/vehicle-details/DetailsSectionClientWrapper';
import VehicleFeatures from '@/components/root/vehicle-details/features/Features';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import RelatedResults from '@/components/root/vehicle-details/RelatedResults';
import {
  ProfileCardDataType,
  VehicleDetailsPageResponse,
} from '@/types/vehicle-details-types';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import DynamicFAQ from '@/components/common/FAQ/DynamicFAQ';
import { generateVehicleMetadata, getVehicleJsonLd } from './metadata';
import CurrentPageBreadcrumb from '@/components/root/vehicle-details/CurrentPageBreadcrumb';
import { restoreVehicleCodeFormat } from '@/helpers';
import { ENV } from '@/config/env';
import { Suspense } from 'react';
import SectionLoading from '@/components/skelton/section-loading/SectionLoading';
import JsonLd from '@/components/common/JsonLd';
import ImagesGrid from '@/components/root/vehicle-details/ImagesGrid';
import { generateModelDetailsUrl } from '@/helpers';
import SupplierDetails from '@/components/root/vehicle-details/SupplierDetails';
import VehicleHeading from '@/components/root/vehicle-details/VehicleHeading';
import ProfileCard from '@/components/root/vehicle-details/profile-card/main-profile-card/ProfileCard';
import ProtectedVehicleDetails from '@/components/common/ProtectedVehicleDetails';

type ParamsProps = {
  params: Promise<{
    state: string;
    category: string;
    vehicleCode: string;
    modelDetails: string;
    country: string;
  }>;
};

// dynamic meta data generate
export async function generateMetadata(props: ParamsProps): Promise<Metadata> {
  const params = await props.params;

  const { state, category, vehicleCode, country } = params;

  return generateVehicleMetadata(state, category, vehicleCode, country);
}

export default async function VehicleDetails(props: ParamsProps) {
  const params = await props.params;

  const { country, state, category, vehicleCode, modelDetails } = params;

  const baseUrl = country === 'in' ? ENV.API_URL_INDIA : ENV.API_URL;

  const formattedVehicleCode = restoreVehicleCodeFormat(vehicleCode);

  const formattedModelDetails = modelDetails.replace(/-for-rent$/, '');

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleCode=${formattedVehicleCode}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const data: VehicleDetailsPageResponse = await response.json();

  // if the vehicle data is not found, return 404 not found
  if (
    data?.status === 'NOT_SUCCESS' ||
    response.status === 400 ||
    !data.result
  ) {
    return notFound();
  }

  // 🆕 If the modelDetails in the URL (slug) doesn't match actual vehicle title, redirect to canonical URL

  const normalizedActualTitle = generateModelDetailsUrl(
    data.result.vehicleTitle
  );

  if (formattedModelDetails !== normalizedActualTitle) {
    redirect(
      `/${country}/${state}/${category}/${normalizedActualTitle}-for-rent/${vehicleCode}`
    );
  }

  // if the state in the url doesn't match the state in the data , return 404 not found
  if (state !== data.result.state.value) {
    return notFound();
  }

  const vehicle = data.result;

  // generating prop data for profile card and mobile profile card
  const ProfileCardData: ProfileCardDataType = {
    company: vehicle?.company,
    rentalDetails: vehicle?.rentalDetails,
    vehicleId: vehicle.vehicleId,
    vehicleCode: vehicle.vehicleCode,
    isLease: vehicle.isAvailableForLease,
    vehicleData: {
      brandName: vehicle.brand.value,
      model: vehicle.modelName,
      state: state,
      category: category,
    },
    securityDeposit: vehicle.securityDeposit,
    vehicleTitle: vehicle.vehicleTitle,
    vehicleTitleH1: vehicle.vehicleTitle,
    seriesDescription: vehicle.vehicleSeries?.vehicleSeriesInfoDescription,
  };

  // Generate JSON-LD
  const jsonLdData = getVehicleJsonLd(
    vehicle,
    state,
    category,
    vehicleCode,
    country
  );

  type MediaItem = {
    source: string;
    type: 'video' | 'image';
  };

  const mediaSourceList: MediaItem[] = [];

  // const videos = vehicle?.vehicleVideos ?? [];
  const images = vehicle?.vehiclePhotos ?? [];

  // // Add all videos first
  // for (const video of videos) {
  //   mediaSourceList.push({
  //     source: video,
  //     type: "video",
  //   });
  // }

  if (vehicle?.vehicleVideos?.length) {
    // Add video as the first item
    mediaSourceList.push({
      source: vehicle.vehicleVideos[0],
      type: 'video',
    });
  }

  // Add all images next
  for (const image of images) {
    mediaSourceList.push({
      source: image,
      type: 'image',
    });
  }
  const brandValue = vehicle?.brand?.value;
  let brandListingPageHref = `/${country}/${state}/listing/${category}`;

  if (!!brandValue) {
    brandListingPageHref += `/brand/${brandValue}`;
  }
  const vehicleTitleH1 = vehicle.vehicleTitleH1;
  const vehicleSubTitle = vehicle.subTitle || vehicle.vehicleTitle;

  const SupplierDetailsPropsData = {
    companyName: vehicle?.company?.companyName,
    companyId: vehicle?.company?.companyId,
    country,
    companyProfile: vehicle?.company?.companyProfile,
  };

  const VehicleHeadingPropsData = {
    brandListingPageHref,
    category,
    brandValue,
    state,
    vehicleTitleH1,
    vehicleSubTitle,
    model: vehicle.modelName,
    heading:
      vehicle?.vehicleTitleH1 || vehicle?.vehicleTitle || vehicle?.modelName,
  };

  return (
    <ProtectedVehicleDetails>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd
        key={vehicleCode}
        jsonLdData={jsonLdData}
        id={`json-ld-vehicle-${vehicleCode}`}
      />

      <div className="h-auto min-h-screen w-full pb-8 pt-4">
        {/* Details heading */}
        <MotionDiv className="">
          {/* breadcrumb for current page path*/}
          <CurrentPageBreadcrumb
            category={category}
            state={state}
            country={country}
            brand={vehicle?.brand}
            vehicleTitle={vehicle?.vehicleTitleH1 || vehicle?.vehicleTitle}
          />

          {/* Heading and Brand logo */}
          <VehicleHeading {...VehicleHeadingPropsData} />
        </MotionDiv>

        {/* Wrapper to handle client side logic regarding mobile profile card */}
        <DetailsSectionClientWrapper
          profileData={ProfileCardData}
          country={country}
        >
          {/* Vehicle Images Grid */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
            <div className="w-full p-2 lg:w-[55%]">
              <ImagesGrid
                mediaItems={mediaSourceList}
                imageAlt={vehicle?.vehicleTitleH1}
                className="h-full"
              />
            </div>

            <div className="w-full p-2 lg:w-[45%]">
              <ProfileCard profileData={ProfileCardData} country={country} />
            </div>
          </div>

          {/* Specifications and Features */}
          <div className="flex-center mt-8 w-full flex-col gap-4 xl:mt-4 xl:flex-row xl:items-stretch">
            {/* Vehicle Specifications */}
            <Specification
              specifications={vehicle?.specs}
              vehicleCategory={category}
            />
            {/* Vehicle Features */}
            <VehicleFeatures
              features={vehicle?.features}
              vehicleCategory={category}
            />
          </div>

          {/* Description */}
          <Description description={vehicle.description} />
        </DetailsSectionClientWrapper>

        {/* related result */}
        <Suspense fallback={<SectionLoading />}>
          <RelatedResults
            state={state}
            category={category}
            vehicleCode={vehicleCode}
            country={country}
          />
        </Suspense>

        {/* FAQ */}
        <Suspense fallback={<SectionLoading />}>
          <DynamicFAQ vehicle={vehicle} country={country} />
        </Suspense>

        {/* Supplier Details */}
        <SupplierDetails {...SupplierDetailsPropsData} />
      </div>
    </ProtectedVehicleDetails>
  );
}
