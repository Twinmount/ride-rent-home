'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';

// Constants moved to separate file in real implementation
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

const currencySymbols: Record<string, string> = {
  AED: 'د.إ',
  USD: '$',
  GBP: '£',
  EUR: '€',
  SAR: '﷼',
  KWD: 'د.ك',
  RUB: '₽',
  INR: '₹',
  PKR: '₨',
  OMR: 'ر.ع.',
  MAD: 'د.م.',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥',
};

// Theme configuration
type Theme = 'light' | 'dark' | 'navbar';

interface ThemeConfig {
  dropdown: string;
  label: string;
  select: string;
  button: string;
  trigger: string;
  triggerBorder?: string;
}

const themes: Record<Theme, ThemeConfig> = {
  light: {
    dropdown: 'bg-white border-gray-200 shadow-lg',
    label: 'text-gray-700',
    select:
      'bg-white border-gray-300 text-gray-900 focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-orange-500 text-white hover:bg-orange-600',
    trigger: 'text-gray-900 hover:text-orange-500',
  },
  dark: {
    dropdown: 'bg-text-primary border-gray-700 shadow-xl',
    label: 'text-text-secondary',
    select:
      'bg-gray-700 border-gray-600 text-white focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-yellow text-black hover:opacity-90',
    trigger: 'text-text-tertiary hover:text-orange-400',
    triggerBorder: 'border border-text-tertiary',
  },
  navbar: {
    dropdown: 'bg-white border-gray-200 shadow-lg',
    label: 'text-gray-600',
    select:
      'bg-white border-gray-200 text-gray-900 focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-orange-500 text-white hover:bg-orange-600',
    trigger: 'text-gray-900',
  },
};

// Types
interface LanguageSelectorProps {
  theme?: Theme;
  showCurrency?: boolean;
  showCountry?: boolean;
  showLanguageText?: boolean;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Custom hooks for better separation of concerns
const useLanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('IN');
  const [hasLanguage, setHasLanguage] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currency, setCurrency, exchangeRates } = useGlobalContext();
  const [tempCurrency, setTempCurrency] = useState(currency);

  // Load saved preferences
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedCountry = localStorage.getItem('selectedCountry');

    if (savedLanguage) {
      setLanguage(savedLanguage);
      setDisplayLanguage(savedLanguage);
    }
    if (savedCountry) {
      setCountry(savedCountry);
    }
  }, []);

  // Sync temp currency with global currency
  useEffect(() => {
    setTempCurrency(currency);
  }, [currency]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    isOpen,
    setIsOpen,
    language,
    setLanguage,
    country,
    setCountry,
    hasLanguage,
    setHasLanguage,
    displayLanguage,
    setDisplayLanguage,
    dropdownRef,
    tempCurrency,
    setTempCurrency,
    setCurrency,
    exchangeRates,
  };
};

// Google Translate utilities
const useGoogleTranslate = (language: string) => {
  const hideGoogleTranslateSpinner = () => {
    const circle = document.querySelector(
      'svg circle[stroke-width="6"][cx="33"][cy="33"][r="30"]'
    );

    if (circle) {
      const svg = circle.closest('svg');
      const div1 = svg?.closest('div');

      if (svg) {
        svg.classList.add('d-none');
        svg.setAttribute('style', 'display: none !important;');
      }

      if (div1) {
        div1.classList.add('d-none');
        div1.setAttribute('style', 'display: none !important;');
      }
    }
  };

  useEffect(() => {
    if (language === 'en') return;

    const initializeGoogleTranslate = () => {
      if (document.getElementById('google_translate_element')) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      }
    };

    if (window.google?.translate) {
      initializeGoogleTranslate();
    } else {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = initializeGoogleTranslate;
    }

    const observer = new MutationObserver(() => {
      hideGoogleTranslateSpinner();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);
};

// Size configurations
const sizeConfig = {
  sm: {
    icon: 'h-3 w-3',
    text: 'text-xs',
    padding: 'px-2 py-1',
    dropdown: 'w-20',
  },
  md: {
    icon: 'h-4 w-4',
    text: 'text-sm',
    padding: 'px-3 py-2',
    dropdown: 'w-40',
  },
  lg: {
    icon: 'h-5 w-5',
    text: 'text-base',
    padding: 'px-4 py-3',
    dropdown: 'w-72',
  },
};

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
    if (hasLanguage) {
      if (language === 'en') {
        window.location.reload();
        setCurrency(tempCurrency);
        localStorage.setItem('currency', tempCurrency);
      } else {
        setCurrency(tempCurrency);
        localStorage.setItem('currency', tempCurrency);
        const selectElement = document.querySelector(
          '.goog-te-combo'
        ) as HTMLSelectElement;

        if (selectElement) {
          selectElement.value = language;
          selectElement.dispatchEvent(new Event('change'));

          let retries = 5;
          const checkLangChange = () => {
            const htmlLang = document.documentElement.lang;
            if (htmlLang !== language && retries > 0) {
              retries--;
              selectElement.dispatchEvent(new Event('change'));
              setTimeout(checkLangChange, 500);
            }
          };
          setTimeout(checkLangChange, 500);
        }
      }
    } else {
      setCurrency(tempCurrency);
      localStorage.setItem('currency', tempCurrency);
    }

    setIsOpen(false);
    localStorage.setItem('selectedLanguage', language);
    localStorage.setItem('selectedCountry', country);
  };

  const selectedLanguage = languages.find((l) => l.code === displayLanguage);
  const selectedCountry = countries.find((c) => c.code === country);

  // Mobile-responsive positioning - center on mobile, respect position on desktop
  const getDropdownPosition = () => {
    if (position === 'right') {
      return '-right-2 sm:right-0'; // Slightly offset on mobile, right on desktop
    }
    return 'left-3  sm:left-0'; // Slightly offset on mobile, left on desktop
  };

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
          {/* Mobile backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`absolute z-50 mt-2 ${getDropdownPosition()} w-60 max-w-[calc(100vw-1rem)] sm:${sizes.dropdown} rounded-xl border ${themeConfig.dropdown}`}
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

              {/* Update Button */}
              <button
                onClick={handleUpdate}
                className={`w-full rounded-lg py-3 ${sizes.text} font-medium transition-all ${themeConfig.button} min-h-[44px]`}
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
