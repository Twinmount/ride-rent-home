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
  position?: "left" | "right";
  size?: Size;
  className?: string;
  variant?: "default" | "footer";
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
  const IconComponent = variant === "footer" ? Globe : Languages;

  // Dynamic icon colors based on variant and theme
  const getIconColor = () => {
    if (variant === "footer") {
      return theme === "dark" ? "text-white" : "text-text-primary";
    }
    return "text-text-primary"; // Match navbar text color
  };

  const getChevronColor = () => {
    if (variant === "footer") {
      return theme === "dark" ? "text-white" : "text-text-primary";
    }
    return "text-text-primary"; // Match navbar text color
  };

  return (
    <div className={`notranslate relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 ${sizes.padding} ${sizes.text} font-medium ${themeConfig.trigger} ${themeConfig.triggerBorder || ""} transition-colors ${
          variant === "footer" ? "rounded-md" : ""
        }`}
        aria-label={`Language and currency selector. Current language: ${selectedLanguage?.name || "English"}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <IconComponent
          className={`${sizes.icon} lg:${sizes.icon.replace("h-4 w-4", "h-6 w-6")} ${getIconColor()}`}
          aria-hidden="true"
        />
        {showLanguageText && (
          <span className="max-sm:hidden">
            {selectedLanguage?.name || "English"}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 ${getChevronColor()}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className={`absolute left-1/2 z-50 mt-2 -translate-x-1/2 transform sm:transform-none sm:${getDropdownPosition(position)} w-[calc(100vw-2rem)] min-w-[280px] max-w-[280px] rounded-xl border sm:w-60 sm:max-w-[280px] ${themeConfig.dropdown}`}
            role="dialog"
            aria-label="Language and currency settings"
          >
            <div className="p-4">
              <div className="mb-3">
                <label
                  htmlFor="language-select"
                  className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
                >
                  Language
                </label>
                <select
                  id="language-select"
                  className={`block w-full rounded-lg border p-2 ${sizes.text} ${themeConfig.select} min-h-[40px]`}
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setHasLanguage(true);
                  }}
                  aria-describedby="language-help"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {`${lang.name} – ${lang.nativeName}`}
                    </option>
                  ))}
                </select>
                <div id="language-help" className="sr-only">
                  Select your preferred language for the website
                </div>
              </div>

              {showCurrency && (
                <div className="mb-4">
                  <label
                    htmlFor="currency-select"
                    className={`block ${sizes.text} font-medium ${themeConfig.label} mb-1`}
                  >
                    Currency
                  </label>
                  <select
                    id="currency-select"
                    className={`block w-full rounded-lg border p-2 ${sizes.text} ${themeConfig.select} min-h-[40px]`}
                    value={tempCurrency}
                    onChange={(e) => setTempCurrency(e.target.value)}
                    aria-describedby="currency-help"
                  >
                    {Object.keys(exchangeRates).map((curr) => (
                      <option key={curr} value={curr}>
                        {`${curr} – ${currencySymbols[curr] || ""}`}
                      </option>
                    ))}
                  </select>
                  <div id="currency-help" className="sr-only">
                    Select your preferred currency for pricing
                  </div>
                </div>
              )}

              <button
                onClick={handleUpdate}
                className={`w-full rounded-lg py-3 ${sizes.text} min-h-[44px] bg-yellow font-medium text-text-primary transition-opacity hover:opacity-90`}
                aria-label="Apply language and currency settings"
                type="button"
              >
                UPDATE
              </button>
            </div>
          </div>
        </>
      )}

      {language !== "en" && (
        <div className="hidden">
          <div id="google_translate_element"></div>
        </div>
      )}
    </div>
  );
}
