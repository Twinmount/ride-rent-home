'use client';

import { countries, currencySymbols, languages } from '@/constants/languages';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { useLanguageSelector } from '@/hooks/useLanguageSelector';
import { Size, sizeConfig, Theme, themes } from '@/styles/themes';
import {
  getDropdownPosition,
  handleLanguageUpdate,
} from '@/utils/languageUtils';
import { ChevronDown, Languages, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  theme?: Theme;
  showCurrency?: boolean;
  showCountry?: boolean;
  showLanguageText?: boolean;
  position?: 'left' | 'right';
  size?: Size;
  className?: string;
  variant?: 'default' | 'footer'; // Add variant prop to distinguish footer usage
}

export default function LanguageSelector({
  theme = 'light',
  showCurrency = true,
  showCountry = true,
  showLanguageText = true,
  position = 'left',
  size = 'md',
  className = '',
  variant = 'default',
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

  // Choose icon based on variant
  const IconComponent = variant === 'footer' ? Globe : Languages;

  return (
    <div className={`notranslate relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 ${sizes.padding} ${sizes.text} font-medium ${themeConfig.trigger} ${themeConfig.triggerBorder || ""} transition-colors ${
          variant === "footer" ? "rounded-md" : ""
        }`}
      >
        <IconComponent
          className={`${sizes.icon} lg:${sizes.icon.replace("h-4 w-4", "h-6 w-6")} ${
            variant === "footer" ? "text-tertiary" : "text-orange-500"
          }`}
        />
        {showLanguageText && (
          <span className="max-sm:hidden">
            {selectedLanguage?.name || "English"}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-orange-500" />
      </button>

      {/* Dropdown */}
      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`absolute left-1/2 z-50 mt-2 -translate-x-1/2 transform sm:transform-none sm:${getDropdownPosition(position)} w-[calc(100vw-2rem)] min-w-[280px] max-w-[280px] rounded-xl border sm:w-60 sm:max-w-[280px] ${themeConfig.dropdown}`}
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

              {/* Country Selection - Always show if showCountry is true */}
              {/* {showCountry && (
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
              )} */}

              {/* Currency Selection - Always show if showCurrency is true */}
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
                        {`${curr} – ${currencySymbols[curr] || ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleUpdate}
                className={`w-full rounded-lg py-3 ${sizes.text} min-h-[44px] bg-yellow font-medium text-text-primary transition-opacity hover:opacity-90`}
              >
                UPDATE
              </button>
            </div>
          </div>
        </>
      )}

      {/* Google Translate Element */}
      {language !== "en" && (
        <div className="hidden">
          <div id="google_translate_element"></div>
        </div>
      )}
    </div>
  );
}
