import React from "react";
import { MdVerifiedUser } from "react-icons/md";
import { Languages, MapPin } from "lucide-react";
import ContactIcons from "../common/contact-icons/ContactIcons";
import AgentContactIcons from "../common/agent-contact-icons/AgentContactIcons";
import { formatPhoneNumber } from "@/helpers";
import GreenNotificationPing from "../common/GreenNotificationPing";

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

const AgentProfile: React.FC<AgentProfileProps> = ({ companyDetails }) => {
  const {
    companyName,
    companyLogo,
    companyAddress,
    companyLanguages,
    contactDetails,
  } = companyDetails;

  const message = `Hello, I am interested in renting a vehicle from *_${companyName}_*. Could you provide more information?`;
  const encodedMessage = encodeURIComponent(message);

  // whatsapp url
  const whatsappUrl = contactDetails
    ? `https://wa.me/${contactDetails.whatsappCountryCode}${contactDetails.whatsappPhone}?text=${encodedMessage}`
    : null;

  // formatted phone number
  const formattedPhoneNumber =
    contactDetails?.countryCode && contactDetails.phone
      ? formatPhoneNumber(contactDetails?.countryCode, contactDetails.phone)
      : null;

  const isCompanyValid = !!companyName || !!companyLogo;

  return (
    <div className="flex flex-col md:flex-row  justify-center lg:justify-between items-center p-4 bg-white rounded-lg border-b-2 max-md:gap-y-6 border-gray-200 lg:max-w-[90%] xl:max-w-[80%] mx-auto">
      {/* left box logo and company details*/}
      <div className="flex flex-col items-center sm:flex-row">
        {/* Left side profile image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-center border-[.36rem] border-amber-400 mx-auto sm:mx-0 ">
          <div className="w-[85%] h-[85%] rounded-full overflow-hidden">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${companyName || "Company"} Logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/assets/img/blur-profile.webp"
                alt="profile-icon"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center sm:items-start sm:ml-4 lg:ml-6 space-y-2 mt-4 sm:mt-0 lg:flex-1">
          {/* Agent name and verified badge */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <h1 className="text-base sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
              {companyName || "Company Not Available"}
            </h1>

            {/* Verified badge */}
            {isCompanyValid && (
              <div className="flex items-center gap-1 relative">
                <MdVerifiedUser className="text-yellow scale-125 sm:scale-150 absolute" />
                <span className="bg-gray-300 rounded-[0.56rem] py-[0.22rem] text-sm font-medium ml-3 px-2 pl-[0.65rem]">
                  Verified Vendor
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-sm sm:text-sm font-extralight text-center sm:text-left">
            {companyAddress || "Address Not Available"}
          </p>
          <p className="text-sm sm:text-base -ml-1 font-light text-center sm:text-left">
            {companyName && (
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  companyName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-sm sm:text-base text-gray-700  flex-center gap-x-2  hover:underline font-normal py-[0.15rem] px-1 hover:border-transparent rounded group"
              >
                <MapPin
                  width={16}
                  height={16}
                  className="text-yellow w-4 h-4 "
                />
                Locate in map
              </a>
            )}
          </p>

          {/* Multilingual support */}
          <div className="flex items-start space-x-2">
            <Languages className="text-yellow w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base text-gray-700 max-sm:text-center">
              {!companyLanguages || companyLanguages.length === 0
                ? "Language Information Not Available"
                : companyLanguages && companyLanguages.length === 1
                ? `Language Support: ${companyLanguages[0]}`
                : `Multilingual Support: ${companyLanguages.join(", ")}`}
            </span>
          </div>
        </div>
      </div>

      {/* Right side contact options */}
      <div className="flex items-center w-fit justify-center  h-fit">
        {isCompanyValid && <GreenNotificationPing classes="mb-6 !mr-2" />}
        <div className="flex flex-col items-center lg:items-center">
          <AgentContactIcons
            whatsappUrl={whatsappUrl}
            email={contactDetails?.email || null}
            phoneNumber={formattedPhoneNumber}
          />

          <span className="mt-3 text-xs sm:text-xs text-gray-700 text-center lg:text-right">
            {contactDetails
              ? "Available now for chat"
              : "Contact not available"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
