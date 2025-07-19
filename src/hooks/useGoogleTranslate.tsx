import { useEffect } from 'react';

export const useGoogleTranslate = (language: string) => {
  const hideGoogleTranslateSpinner = () => {
    const circle = document.querySelector('svg circle[stroke-width="6"][cx="33"][cy="33"][r="30"]');
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
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = initializeGoogleTranslate;
    }

    const observer = new MutationObserver(() => hideGoogleTranslateSpinner());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [language]);
};
