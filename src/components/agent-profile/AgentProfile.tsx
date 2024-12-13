import React from 'react'
import { MdVerifiedUser } from 'react-icons/md'
import { Languages } from 'lucide-react'
import ContactIcons from '../common/contact-icons/ContactIcons'

// Define the interface for props
interface AgentProfileProps {
  companyName: string
  agentAddress: string
  state: string
  languages: string[]
}

const AgentProfile: React.FC<AgentProfileProps> = () => {
  // Variables to store text
  const companyName = 'AL SAQR AL GHAWI'
  const agentAddress = 'AL SAQR AL GHAWI, Office No. 9, Hela Abdulla No-03, Al Karama, Dubai,'
  const state = 'United Arab Emirates'
  const languages = ['English', 'Hindi', 'Arabic']

  return (
    <div className="wrapper flex flex-col sm:flex-row sm:justify-start lg:justify-between lg:items-center p-4 bg-white shadow-lg rounded-lg">
      {/* Left side profile image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-center border-[.36rem] border-amber-400  mx-auto sm:mx-0">
        <div className="w-[85%] h-[85%] rounded-full overflow-hidden">
          <img
            src="/assets/img/blur-profile.webp"
            alt="profile-icon"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center sm:items-start sm:ml-4 lg:ml-6 space-y-2 mt-4 sm:mt-0 lg:flex-1">
        {/* Agent name and verified badge */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <h1 className="text-base sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
            {companyName}
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
          {agentAddress}
        </p>
        <p className="text-sm sm:text-base font-light text-center sm:text-left">
          {state}
          <a
            href="https://www.google.com/maps/search/(add the location here)"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-transparent text-xs sm:text-xs hover:bg-yellow font-light hover:text-white py-[0.15rem] px-1 border border-gray-700 hover:border-transparent rounded"
          >
            Locate in map
          </a>
        </p>

        {/* Multilingual support */}
        <div className="flex items-center space-x-2">
          <Languages className="text-yellow w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base text-gray-700">
            Multilingual Support: {languages.join(', ')}
          </span>
        </div>
      </div>

      {/* Right side contact options */}
      <div className="flex flex-col items-center mt-6 sm:mt-0 sm:ml-6  lg:items-center">
        <ContactIcons
          vehicleId="test-vehicle-id"
          whatsappUrl="https://wa.me/1234567890"
          email="test@example.com"
          phoneNumber="123-456-7890"
        />
        <span className="mt-3 text-xs sm:text-xs text-gray-700 text-center lg:text-right">
          Available now for chat
        </span>
      </div>
    </div>
  )
}

export default AgentProfile
