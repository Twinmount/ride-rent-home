export const handleLanguageUpdate = (
  language: string,
  tempCurrency: string,
  hasLanguage: boolean,
  setCurrency: (currency: string) => void,
  country: string,
  setIsOpen: (open: boolean) => void
) => {
  if (hasLanguage) {
    if (language === 'en') {
      window.location.reload();
      setCurrency(tempCurrency);
      localStorage.setItem('currency', tempCurrency);
    } else {
      setCurrency(tempCurrency);
      localStorage.setItem('currency', tempCurrency);
      
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
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

export const getDropdownPosition = (position: 'left' | 'right') => {
  return position === 'right' 
    ? '-right-2 sm:right-0' 
    : 'left-3 sm:left-0';
};