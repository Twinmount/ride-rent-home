'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { rearrangeStates } from '@/helpers';
import { FetchStatesResponse, StateType } from '@/types';
import { fetchCategories } from '@/lib/api/general-api';
import { useRouter } from 'next/navigation';
import FooterSection from '../FooterSection'; // Adjust path as needed
import FooterLink from '../FooterLink'; // Adjust path as needed

export default function FooterLocations() {
  const params = useParams();
  const router = useRouter();
  const country = (params?.country as string) || 'ae';
  const category = (params?.category as string) || 'cars';

  const [states, setStates] = useState<StateType[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = category || 'cars';
  const selectedCountryURL = country === 'in' ? 'in' : 'ae';

  useEffect(() => {
    const baseUrl =
      country === 'in'
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;
    const countryId =
      country === 'in'
        ? '68ea1314-08ed-4bba-a2b1-af549946523d'
        : 'ee8a7c95-303d-4f55-bd6c-85063ff1cf48';

    const fetchStates = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/states/list?hasVehicle=true&countryId=${countryId}`,
          {
            cache: 'no-cache',
          }
        );
        const data: FetchStatesResponse = await response.json();
        let result =
          country === 'in'
            ? data.result
            : rearrangeStates(data.result, country);
        setStates(result);
      } catch (error) {
        console.error('Failed to fetch states:', error);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [country]);

  const gotoLocationCategory = async (stateValue: string) => {
    const res = await fetchCategories(stateValue, country);
    const categories: any = res?.result?.list;

    if (categories?.length > 0) {
      let isSelectedPresent = categories?.find(
        (category: any) => category?.value === selectedCategory
      );
      let hasCars = categories?.find(
        (category: any) => category?.value === 'cars'
      );
      router.push(
        `/${selectedCountryURL}/${stateValue}/${!!isSelectedPresent ? selectedCategory : !!hasCars ? 'cars' : categories[0]?.value}`
      );

      return;
    } else {
      router.push(`/${selectedCountryURL}/${stateValue}/${selectedCategory}`);
    }
  };

  if (loading || states.length === 0) return null;

  return (
    <FooterSection title="Locations" isLoading={loading}>
      {states.map((location) => (
        <FooterLink
          key={location.stateId}
          onClick={() => gotoLocationCategory(location.stateValue)}
        >
          {location.stateName}
        </FooterLink>
      ))}
    </FooterSection>
  );
}