"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Languages } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "zh-CN", name: "Chinese", nativeName: "中文" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "de", name: "German", nativeName: "Deutsch" },
];

const currencySymbols: any = {
  AED: "د.إ",
  USD: "$",
  GBP: "£",
  EUR: "€",
  SAR: "﷼",
  KWD: "د.ك",
  RUB: "₽",
  INR: "₹",
  PKR: "₨",
  OMR: "ر.ع.",
  MAD: "د.م.",
  CNY: "¥",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [hasLanguage, setHasLanguage] = useState<boolean>(false);
  const [displayLanguage, setDisplayLanguage] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currency, setCurrency, exchangeRates } = useGlobalContext();
  const [tempCurrency, setTempCurrency] = useState(currency);
  // Retrieve stored language from localStorage

  const hideGoogleTranslateSpinner = () => {
    const circle = document.querySelector(
      'svg circle[stroke-width="6"][cx="33"][cy="33"][r="30"]',
    );

    if (circle) {
      const svg = circle.closest("svg");
      const div1 = svg?.closest("div");
      // const div2 = div1?.parentElement?.closest("div");

      if (svg) {
        svg.classList.add("d-none");
        svg.setAttribute("style", "display: none !important;");
      }

      if (div1) {
        div1.classList.add("d-none");
        div1.setAttribute("style", "display: none !important;");
      }

      // if (div2) {
      //   div2.classList.add("d-none");
      //   div2.setAttribute("style", "display: none !important;");
      // }
    }
  };

  useEffect(() => {
    setTempCurrency(currency);
  }, [currency]);

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
          new window.google.translate.TranslateElement(
            { pageLanguage: "en" },
            "google_translate_element",
          );
        }
      };

      if (window.google?.translate) {
        initializeGoogleTranslate();
      } else {
        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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

      // 🧹 Cleanup on unmount
      return () => observer.disconnect();
    }

    return;
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
    if (hasLanguage) {
      if (language === "en") {
        // Remove Google Translate styling and restore the original content
        window.location.reload();
        setCurrency(tempCurrency);
        localStorage.setItem("currency", tempCurrency);
      } else {
        setCurrency(tempCurrency);
        localStorage.setItem("currency", tempCurrency);
        // Trigger Google Translate for other languages
        const selectElement = document.querySelector(
          ".goog-te-combo",
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = language;
          selectElement.dispatchEvent(new Event("change"));

          // Retry logic if HTML lang is not updated
          let retries = 5;
          const checkLangChange = () => {
            const htmlLang = document.documentElement.lang;
            if (htmlLang !== language && retries > 0) {
              retries--;
              selectElement.dispatchEvent(new Event("change")); // try again
              setTimeout(checkLangChange, 500); // retry after 0.5s
            }
          };
          setTimeout(checkLangChange, 500); // initial check
        }
      }
    } else {
      setCurrency(tempCurrency);
      localStorage.setItem("currency", tempCurrency);
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
        className="flex items-center space-x-2 px-2 py-2 text-lg font-medium text-gray-900"
      >
        <Languages color="#ea7b0b" className="h-6 w-6" />
        <span className="max-sm:hidden">
          {languages.find((l) => l.code === displayLanguage)?.name || "English"}
        </span>
        <ChevronDown className="text-orange-500 h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
          style={{ left: "-36px" }}
        >
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600">
              Language
            </label>
            <select
              className="focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setHasLanguage(true);
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {`${lang.name} \u00A0\u00A0–\u00A0\u00A0 ${lang.nativeName}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Currency
            </label>
            <select
              className="focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={tempCurrency}
              onChange={(e) => setTempCurrency(e.target.value)}
            >
              {Object.keys(exchangeRates).map((curr) => (
                <option key={curr} value={curr}>
                  {`${curr} \u00A0\u00A0–\u00A0\u00A0 ${currencySymbols[curr] || ""}`}
                </option>
              ))}
            </select>
          </div>

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
