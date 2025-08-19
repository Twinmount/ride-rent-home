"use client";

import { useParams } from 'next/navigation';
import LanguageSelector from '../navbar/LanguageSelector';
import CountrySelector from '../dropdown/CountrySelector';

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

const FooterSelectors: React.FC = () => {
  const { country } = useParams<RouteParams>();
  
  // Ensure we have a valid country value, default to 'in'
  const validCountry = country && isValidCountryValue(country) ? country : 'in';
  
  return (
    <div className="flex-center h-full w-fit gap-3">
      {/* Language Selector */}
      <LanguageSelector 
        theme="dark"
        variant="footer"
        showCurrency={true}
        showCountry={true}
        showLanguageText={true}
      />
      
      {/* Country Selector - Pass current country from URL with matching theme */}
      <CountrySelector 
        currentCountry={validCountry}
        theme="dark"
        variant="footer"
        size="md"
      />
    </div>
  );
};

export default FooterSelectors;