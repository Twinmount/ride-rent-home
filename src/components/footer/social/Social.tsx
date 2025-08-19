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

      {/* Description */}
      <div className="max-w-sm text-center text-sm leading-relaxed text-text-tertiary md:max-w-2xl">
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