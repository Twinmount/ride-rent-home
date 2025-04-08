export {};

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}
