"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Languages } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "nl", name: "Dutch" },
  { code: "zh-CN", name: "Chinese" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "tr", name: "Turkish" },
  { code: "it", name: "Italian" },
  { code: "de", name: "German" },
];

// const currencies = ["AED", "USD", "EUR"];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [displayLanguage, setDisplayLanguage] = useState<string>("en");
  // const [currency, setCurrency] = useState<string>("AED");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Retrieve stored language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setDisplayLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (language !== "en") {
      const initializeGoogleTranslate = () => {
        if (document.getElementById("google_translate_element")) {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: "en" },
            "google_translate_element",
          );
        }
      };

      if ((window as any).google?.translate) {
        initializeGoogleTranslate();
      } else {
        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        (window as any).googleTranslateElementInit = initializeGoogleTranslate;
      }
    }
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = () => {
    if (language === "en") {
      // Remove Google Translate styling and restore the original content
      window.location.reload();
    } else {
      // Trigger Google Translate for other languages
      const selectElement = document.querySelector(
        ".goog-te-combo",
      ) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = language;
        selectElement.dispatchEvent(new Event("change"));
      }
    }

    setDisplayLanguage(language);
    setIsOpen(false);

    // Save selected language to localStorage
    localStorage.setItem("selectedLanguage", language);
  };

  return (
    <div className="notranslate relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 text-lg font-medium text-gray-900"
        >
          <Languages color="#ea7b0b" className="h-6 w-6" />
          <span className="max-sm:hidden">
            {languages.find((l) => l.code === displayLanguage)?.name || "English"}
          </span>
          <ChevronDown className="text-orange-500 h-4 w-4" />
        </button>

      {isOpen && (
        <div className="absolute mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg" style={{left:"-36px"}}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600">
              Language
            </label>
            <select
              className="focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Currency
            </label>
            <select
              className="focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div> */}

          <button
            onClick={handleUpdate}
            className="w-full rounded bg-yellow py-2 text-white"
          >
            UPDATE
          </button>
        </div>
      )}

      {/* Load Google Translate only if language is not English */}
      {language !== "en" && (
        <div className="hidden">
          <div id="google_translate_element"></div>
        </div>
      )}
    </div>
  );
}
