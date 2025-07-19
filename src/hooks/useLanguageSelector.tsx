import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';

export const useLanguageSelector = () => {
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
    if (savedCountry) setCountry(savedCountry);
  }, []);

  // Sync temp currency with global currency
  useEffect(() => {
    setTempCurrency(currency);
  }, [currency]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    isOpen, setIsOpen, language, setLanguage, country, setCountry,
    hasLanguage, setHasLanguage, displayLanguage, setDisplayLanguage,
    dropdownRef, tempCurrency, setTempCurrency, setCurrency, exchangeRates,
  };
};