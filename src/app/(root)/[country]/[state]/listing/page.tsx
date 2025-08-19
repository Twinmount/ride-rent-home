import { PageProps } from '@/types';
import { normalizeSingleQueryParam } from '@/utils/url';
import { redirect } from 'next/navigation';
import qs from 'query-string';

/**
 * Redirects old-style listing URLs (e.g. /listing?brand=...,vehicleTypes=...)
 * to the new SEO-friendly dynamic paths (e.g. /listing/cars or /luxury/brand/bmw).
 */
export default async function ListingPage(props: PageProps) {
  const { country, state } = await props.params;
  const searchParams = await props.searchParams;

  // Extract values from old query format
  const category = searchParams?.category as string;
  const vehicleTypes = searchParams?.vehicleTypes;
  const brand = searchParams?.brand;

  // Use 'cars' as fallback category
  const resolvedCategory = category || 'cars';

  // Extract valid single values (omit if multiple)
  const singleVehicleType = normalizeSingleQueryParam(vehicleTypes);
  const singleBrand = normalizeSingleQueryParam(brand);

  // Build base path
  let path = `/${country}/${state}/listing/${resolvedCategory}`;
  if (singleVehicleType) path += `/${singleVehicleType}`;
  if (singleBrand) path += `/brand/${singleBrand}`;

  // Clean up query by removing keys used in path
  const remainingQuery = { ...searchParams };
  delete remainingQuery.category;
  delete remainingQuery.vehicleTypes;
  delete remainingQuery.brand;

  // Reconstruct the query string
  const queryString = qs.stringify(remainingQuery, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
  });

  // Final redirect URL
  const finalUrl = queryString ? `${path}?${queryString}` : path;

  // Decode for human-friendly format
  redirect(decodeURIComponent(finalUrl));
}
