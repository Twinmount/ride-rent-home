"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { COUNTRIES } from '@/data';
import Image from 'next/image';
import { Theme, themes, Size, sizeConfig } from '@/styles/themes';

// Types
type CountryValue = 'in' | 'ae';

interface CountrySelectorProps {
  currentCountry: CountryValue;
  theme?: Theme;
  size?: Size;
  variant?: 'default' | 'footer';
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  currentCountry,
  theme = 'light',
  size = 'md',
  variant = 'default'
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const themeConfig = themes[theme];
  const sizes = sizeConfig[size];
  
  // Get current country data based on URL
  const selectedCountry = COUNTRIES.find(c => c.value === currentCountry) || COUNTRIES[0];

  const handleCountryChange = (countryValue: CountryValue): void => {
    if (countryValue === currentCountry) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    
    // Simple navigation - just redirect to the country root
    // The app will automatically redirect to default state and category
    router.push(`/${countryValue}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest('.country-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative country-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${sizes.padding} ${sizes.text} font-medium ${themeConfig.trigger} ${themeConfig.triggerBorder || ''} transition-colors ${
          variant === 'footer' ? 'rounded-md' : ''
        }`}
        aria-label="Select Country"
        type="button"
      >
        <Image 
          src={selectedCountry.icon}
          alt={`${selectedCountry.name} flag`}
          width={20}
          height={15}
          className="object-contain"
        />
        <span className="max-sm:hidden">{selectedCountry.name}</span>
        <ChevronDown 
          className={`text-orange-500 h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`absolute z-50 mt-2 left-0 w-60 max-w-[calc(100vw-1rem)] sm:${sizes.dropdown} rounded-xl border ${themeConfig.dropdown}`}>
            <div className="p-4">
              <label
                className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
              >
                Country
              </label>
              <div className="space-y-1">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountryChange(country.value as CountryValue)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left ${sizes.text} rounded-lg transition-colors hover:bg-gray-700 ${
                      country.value === currentCountry
                        ? 'bg-gray-700 text-yellow'
                        : themeConfig.label
                    }`}
                    type="button"
                  >
                    <Image 
                      src={country.icon}
                      alt={`${country.name} flag`}
                      width={20}
                      height={15}
                      className="object-contain"
                    />
                    <span className="font-medium">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountrySelector;