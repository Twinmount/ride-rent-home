import React from "react";
import { MdVerifiedUser } from "react-icons/md";
import { Languages } from "lucide-react";
import ContactIcons from "../common/contact-icons/ContactIcons";

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
  state: string | null;
  languages: string[];
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
    state,
    languages,
    contactDetails,
  } = companyDetails;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-start lg:justify-between lg:items-center p-4 bg-white rounded-lg border-b-2 border-gray-200">
      {/* Left side profile image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-center border-[.36rem] border-amber-400 mx-auto sm:mx-0">
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
            {companyName || "Company Name Not Available"}
          </h1>

          {/* Verified badge */}
          <div className="flex items-center gap-1 relative">
            <MdVerifiedUser className="text-yellow scale-125 sm:scale-150 absolute" />
            <span className="bg-gray-300 rounded-[0.56rem] py-[0.22rem] text-sm font-medium ml-3 px-2 pl-[0.65rem]">
              Verified Vendor
            </span>
          </div>
        </div>

        {/* Location */}
        <p className="text-sm sm:text-sm font-extralight text-center sm:text-left">
          {companyAddress || "Address Not Available"}
        </p>
        <p className="text-sm sm:text-base font-light text-center sm:text-left">
          {state || "State Not Available"}
          {companyAddress && (
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                companyAddress
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 bg-transparent text-xs sm:text-xs hover:bg-yellow font-light hover:text-white py-[0.15rem] px-1 border border-gray-700 hover:border-transparent rounded"
            >
              Locate in map
            </a>
          )}
        </p>

        {/* Multilingual support */}
        <div className="flex items-center space-x-2">
          <Languages className="text-yellow w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base text-gray-700">
            Multilingual Support: {languages && languages.length > 0 ? languages.join(", ") : "Not Available"}
          </span>
        </div>
      </div>

      {/* Right side contact options */}
      <div className="flex flex-col items-center mt-6 sm:mt-0 sm:ml-6 lg:items-center">
        {contactDetails ? (
          <ContactIcons
            vehicleId="test-vehicle-id" // Optional, can be dynamic if required
            whatsappUrl={contactDetails.whatsappPhone}
            email={contactDetails.email}
            phoneNumber={contactDetails.phone}
          />
        ) : (
          <p className="text-sm text-gray-500">Contact details not available</p>
        )}
        <span className="mt-3 text-xs sm:text-xs text-gray-700 text-center lg:text-right">
          {contactDetails ? "Available now for chat" : "Contact not available"}
        </span>
      </div>
    </div>
  );
};

export default AgentProfile;
