"use client";

import { Info, Languages } from "lucide-react";
import { Tooltip } from "react-tooltip";

type Props = {
  companyLanguages: string[];
};
export default function LanguageSupport({ companyLanguages }: Props) {
  return (
    <div className="flex items-start space-x-2">
      <Languages className="text-yellow w-4 h-4 sm:w-5 sm:h-5 -mr-1 mt-1" />
      <span className="text-sm sm:text-base text-gray-700 max-sm:text-center flex items-center">
        {!companyLanguages || companyLanguages.length === 0
          ? "Language Information Not Available"
          : companyLanguages && companyLanguages.length === 1
          ? `Language Support: ${companyLanguages[0]}`
          : `Multilingual Support: ${companyLanguages.join(", ")}`}

        {/* Tooltip Trigger */}
        <a
          data-tooltip-id="info-tooltip"
          data-tooltip-content="Languages the staff can speak or understand, ensuring customer communication comfort"
          href="#"
          className="mb-1 ml-2"
        >
          <Info width={15} className="text-blue-500" />
        </a>

        {/* Tooltip Component */}
        <Tooltip
          id="info-tooltip"
          place="bottom"
          className="bg-slate-900 text-white max-w-64"
          style={{
            zIndex: 40,
          }}
        />
      </span>
    </div>
  );
}
