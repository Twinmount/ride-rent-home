import { MdEmail } from "react-icons/md";
import { socials } from ".";
import { FaPhoneVolume } from "react-icons/fa6";
import MotionDiv from "../../general/framer-motion/MotionDiv";

const Social = () => {
  return (
    <MotionDiv className="notranslate flex flex-col items-center justify-center gap-3">
      {/* Social Media Icons */}
      <div className="flex flex-wrap justify-center gap-3">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-yellow hover:text-gray-900"
              aria-label={`Visit our ${social.label} page`}
            >
              <Icon className="text-lg" />
            </a>
          );
        })}
      </div>

      {/* Contact Information */}
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8">
        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-300 transition-colors hover:text-yellow">
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <FaPhoneVolume className="text-sm text-white" />
          </div>
          <a
            href="tel:+971502972335"
            className="text-white transition-colors hover:text-yellow"
          >
            +971 50 297 2335
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 text-gray-300 transition-colors hover:text-yellow">
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <MdEmail className="text-sm text-white" />
          </div>
          <a
            href="mailto:hello@ride.rent"
            className="text-white transition-colors hover:text-yellow"
          >
            hello@ride.rent
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-sm text-center text-sm leading-relaxed text-text-tertiary md:max-w-lg">
        <p>
          Ride.Rent is an on-demand platform to rent cars, bikes, buses, yachts,
          and more at the most affordable prices, operating in selected cities
          worldwide.
        </p>
      </div>
    </MotionDiv>
  );
};

export default Social;