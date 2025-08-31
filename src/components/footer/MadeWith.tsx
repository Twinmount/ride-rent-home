"use client"

import { useParams } from 'next/navigation';
import React from 'react';

interface RouteParams {
  country?: string;
  state?: string;
  category?: string;
  [key: string]: string | string[] | undefined;
}

// Type guard to check if a string is a valid CountryValue
const isValidCountryValue = (value: string): value is 'in' | 'ae' => {
  return value === 'in' || value === 'ae';
};

const MadeWith = () => {
  // Move useParams inside the component
  const { country } = useParams<RouteParams>();

  // Ensure we have a valid country value, default to 'in'
  const validCountry = country && isValidCountryValue(country) ? country : 'in';

  return (
    <div className="pt-4 text-sm text-white lg:mt-2">
      Crafted with ❤️ from {validCountry === 'in' ? 'Namma Bengaluru' : 'Dubai'}
    </div>
  );
};

export default MadeWith