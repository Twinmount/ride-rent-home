"use client";
import { useParams } from "next/navigation";
import LanguageSelector from "../navbar/LanguageSelector";
import CountrySelector from "../dropdown/CountrySelector";

const isValidCountryValue = (value: string): value is "in" | "ae" => {
  return value === "in" || value === "ae";
};

const FooterSelectors = () => {
  const params = useParams();
  const country = typeof params.country === "string" ? params.country : "in";
  const validCountry = isValidCountryValue(country) ? country : "in";

  return (
    <div className="flex-center h-full w-fit gap-3">
      <LanguageSelector
        theme="dark"
        variant="footer"
        showCurrency={true}
        showCountry={true}
        showLanguageText={true}
      />
      <CountrySelector
        currentCountry={validCountry}
        theme="dark"
        variant="footer"
        size="md"
      />
    </div>
  );
};

export default FooterSelectors;
