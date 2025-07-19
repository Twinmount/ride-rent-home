'use client';

import { countries, currencySymbols, languages } from '@/constants/languages';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { useLanguageSelector } from '@/hooks/useLanguageSelector';
import { Size, sizeConfig, Theme, themes } from '@/styles/themes';
import {
  getDropdownPosition,
  handleLanguageUpdate,
} from '@/utils/languageUtils';
import { ChevronDown, Languages } from 'lucide-react';

interface LanguageSelectorProps {
  theme?: Theme;
  showCurrency?: boolean;
  showCountry?: boolean;
  showLanguageText?: boolean;
  position?: 'left' | 'right';
  size?: Size;
  className?: string;
}

export default function LanguageSelector({
  theme = 'light',
  showCurrency = true,
  showCountry = true,
  showLanguageText = true,
  position = 'left',
  size = 'md',
  className = '',
}: LanguageSelectorProps) {
  const {
    isOpen,
    setIsOpen,
    language,
    setLanguage,
    country,
    setCountry,
    hasLanguage,
    setHasLanguage,
    displayLanguage,
    dropdownRef,
    tempCurrency,
    setTempCurrency,
    setCurrency,
    exchangeRates,
  } = useLanguageSelector();

  useGoogleTranslate(language);

  const themeConfig = themes[theme];
  const sizes = sizeConfig[size];

  const handleUpdate = () => {
    handleLanguageUpdate(
      language,
      tempCurrency,
      hasLanguage,
      setCurrency,
      country,
      setIsOpen
    );
  };

  const selectedLanguage = languages.find((l) => l.code === displayLanguage);
  const selectedCountry = countries.find((c) => c.code === country);

  return (
    <div className={`notranslate relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${sizes.padding} ${sizes.text} font-medium ${themeConfig.trigger} ${themeConfig.triggerBorder} transition-colors`}
      >
        <Languages
          color="#ea7b0b"
          className={`${sizes.icon} lg:${sizes.icon.replace('h-4 w-4', 'h-6 w-6')}`}
        />
        {showLanguageText && (
          <span className="max-sm:hidden">
            {selectedLanguage?.name || 'English'}
          </span>
        )}
        <ChevronDown className="text-orange-500 h-4 w-4" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`absolute z-50 mt-2 ${getDropdownPosition(position)} w-60 max-w-[calc(100vw-1rem)] sm:${sizes.dropdown} rounded-xl border ${themeConfig.dropdown}`}
          >
            <div className="p-4">
              {/* Language Selection */}
              <div className="mb-3">
                <label
                  className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
                >
                  Language
                </label>
                <select
                  className={`block w-full rounded-lg border p-2 ${sizes.text} ${themeConfig.select} min-h-[40px]`}
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setHasLanguage(true);
                  }}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {`${lang.name} – ${lang.nativeName}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Selection */}
              {showCountry && (
                <div className="mb-3">
                  <label
                    className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
                  >
                    Country
                  </label>
                  <select
                    className={`block w-full rounded-lg border p-2 ${sizes.text} ${themeConfig.select} min-h-[40px]`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countries.map((ctry) => (
                      <option key={ctry.code} value={ctry.code}>
                        {`${ctry.flag} ${ctry.name}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Currency Selection */}
              {showCurrency && (
                <div className="mb-4">
                  <label
                    className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
                  >
                    Currency
                  </label>
                  <select
                    className={`block w-full rounded-lg border p-2 ${sizes.text} ${themeConfig.select} min-h-[40px]`}
                    value={tempCurrency}
                    onChange={(e) => setTempCurrency(e.target.value)}
                  >
                    {Object.keys(exchangeRates).map((curr) => (
                      <option key={curr} value={curr}>
                        {`${curr} – ${currencySymbols[curr] || ''}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleUpdate}
                className={`w-full rounded-lg py-3 ${sizes.text} min-h-[44px] bg-yellow text-black hover:opacity-90`}
              >
                UPDATE
              </button>
            </div>
          </div>
        </>
      )}

      {/* Google Translate Element */}
      {language !== 'en' && (
        <div className="hidden">
          <div id="google_translate_element"></div>
        </div>
      )}
    </div>
  );
}