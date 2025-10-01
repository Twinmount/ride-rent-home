import React from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import AgentContactIcons from "../general/AgentContactIcons";
import {
  generateAgentProfileWhatsappUrl,
  getAgentFormattedPhoneNumber,
} from "@/helpers";
import GreenNotificationPing from "../common/GreenNotificationPing";

import SharePortfolio from "./SharePortfolio";
import LanguageSupport from "./LanguageSupport";

interface ContactDetails {
  email: string;
  phone: string;
  countryCode: string;
  whatsappPhone: string;
  whatsappCountryCode: string;
}

interface CompanyDetails {
  companyName: string | null;
  companyLogo: string | null;
  companyAddress: string | null;
  companyLanguages: string[];
  contactDetails: ContactDetails | null;
}

interface AgentProfileProps {
  companyDetails: CompanyDetails;
}

export default function AgentProfile({ companyDetails }: AgentProfileProps) {
  const { companyName, companyLogo, contactDetails, companyAddress } =
    companyDetails;

  const companyLanguages = companyDetails.companyLanguages || [];

  // whatsapp url
  const whatsappUrl = contactDetails
    ? generateAgentProfileWhatsappUrl(
        companyName,
        contactDetails.whatsappCountryCode,
        contactDetails.whatsappPhone,
      )
    : null;

  // formatted phone number
  const formattedPhoneNumber = contactDetails
    ? getAgentFormattedPhoneNumber(
        contactDetails.countryCode,
        contactDetails.phone,
      )
    : null;

  const isCompanyValid = !!companyName || !!companyLogo;

  return (
    <div className="mx-auto flex flex-col items-center justify-center border-b-2 border-gray-300 p-4 max-md:gap-y-6 md:flex-row lg:max-w-[90%] lg:justify-between">
      {/* left box logo and company details*/}
      <div className="flex flex-col items-center sm:flex-row">
        {/* Left side profile image */}
        <div className="flex-center mx-auto h-24 w-24 overflow-hidden rounded-full border-[.36rem] border-amber-400 sm:mx-0 sm:h-32 sm:w-32">
          <div className="h-[85%] w-[85%] overflow-hidden rounded-full">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${companyName || "Company"} Logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/assets/img/blur-profile.webp"
                alt="profile-icon"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="mt-4 flex flex-col items-center space-y-2 sm:ml-4 sm:mt-0 sm:items-start lg:ml-6 lg:flex-1">
          {/* Agent name and verified badge */}
          <div className="flex flex-col items-center space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <h1 className="text-center text-base font-bold text-gray-800 sm:text-left sm:text-2xl">
              {companyName || "Company Not Available"}
            </h1>

            {/* Verified badge */}
            {isCompanyValid && (
              <div className="relative flex items-center gap-1">
                <ShieldCheck
                  fill="#ffa733"
                  className="absolute rounded-full text-slate-700"
                />
                <span className="ml-3 rounded-[0.56rem] bg-gray-300 px-2 py-[0.22rem] pl-[0.65rem] text-sm">
                  Verified Vendor
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-center text-sm font-extralight sm:text-left">
            {companyAddress || "Address Not Available"}
          </p>

          <div className="flex-center -ml-1 gap-x-3 text-center text-sm sm:text-left sm:text-base">
            {companyName && (
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  companyName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-center cursor-pointer gap-x-2 rounded-[0.5rem] bg-gray-200 px-1 text-sm text-gray-700 hover:border-transparent sm:text-base"
              >
                <MapPin
                  width={16}
                  height={16}
                  className="h-4 w-4 text-yellow"
                />
                Locate in map
              </a>
            )}

            {/* Share portfolio button */}
            <SharePortfolio />
          </div>

          {/* Multilingual support */}
          <LanguageSupport companyLanguages={companyLanguages} />
        </div>
      </div>

      {/* Right side contact options */}
      {/* <div className="flex h-fit w-fit items-center justify-center">
        {isCompanyValid && <GreenNotificationPing classes="mb-6 !mr-2" />}
        <div className="flex flex-col items-center lg:items-center">
          <AgentContactIcons
            whatsappUrl={whatsappUrl}
            email={contactDetails?.email || null}
            phoneNumber={formattedPhoneNumber}
          />

          <span className="mt-3 text-center text-xs text-gray-700 sm:text-xs lg:text-right">
            {contactDetails
              ? "Available now for chat"
              : "Contact not available"}
          </span>
        </div>
      </div> */}
    </div>
  );
}
