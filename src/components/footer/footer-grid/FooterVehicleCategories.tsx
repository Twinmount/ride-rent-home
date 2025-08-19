'use client';

import { useFetchVehicleCategories } from '@/hooks/useFetchVehicleCategories';
import FooterSection from '../FooterSection'; // Adjust path as needed
import FooterLink from '../FooterLink'; // Adjust path as needed

export default function FooterVehicleCategories() {
  const {
    sortedCategories: categories,
    isCategoriesLoading,
    country,
    state,
  } = useFetchVehicleCategories({ needRedirection: false });

  if (categories.length === 0) return null;

  return (
    <FooterSection title="Vehicle Categories" isLoading={isCategoriesLoading}>
      {categories.map((category) => (
        <FooterLink
          key={category.categoryId}
          href={`/${country}/${state}/${category.value}`}
        >
          {category.name}
        </FooterLink>
      ))}
    </FooterSection>
  );
}