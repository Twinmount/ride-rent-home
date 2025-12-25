"use client";
import { useParams } from "next/navigation";

const isValidCountryValue = (value: string): value is "in" | "ae" => {
  return value === "in" || value === "ae";
};

const MadeWith = () => {
  const params = useParams();
  const country = typeof params.country === "string" ? params.country : "in";
  const validCountry = isValidCountryValue(country) ? country : "in";

  return (
    <div className="pt-4 text-sm text-white lg:mt-2">
      Crafted with ❤️ from {validCountry === "in" ? "Namma Bengaluru" : "Dubai"}
    </div>
  );
};

export default MadeWith;
