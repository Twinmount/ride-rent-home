import { MdEmail } from "react-icons/md";
import { socials } from ".";
import { FaPhoneVolume } from "react-icons/fa6";
import MotionDiv from "../../general/framer-motion/MotionDiv";

const Social = () => {
  return (
    <MotionDiv className="mx-auto my-12 mb-8 flex w-full flex-col items-center justify-evenly gap-4 md:w-[70%] md:flex-row">
      {/* social */}
      <div className="flex flex-col items-start justify-center max-md:items-center">
        <div className="mb-2 font-bold text-yellow">We are Social!</div>
        <div className="ml-[-0.5rem] flex gap-1.5">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-yellow"
                aria-label={`Visit our ${social.label} page`}
              >
                <Icon className="text-lg" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="flex h-fit flex-col md:gap-2">
        {/* contact */}
        <div className="flex flex-col items-center gap-2">
          {/* mobile  */}
          <div className="group flex items-center gap-2">
            <FaPhoneVolume className="text-yellow" />
            <a
              href="tel:+971502972335"
              className="h-fit max-h-fit w-fit max-w-fit p-0 text-gray-500 group-hover:text-yellow"
            >
              +971 50 297 2335
            </a>
          </div>
          {/* mail */}
          <div className="group flex items-center gap-2">
            <MdEmail className="text-yellow" />
            <a
              href="mailto:hello@ride.rent"
              className="h-fit max-h-fit w-fit max-w-fit p-0 text-gray-500 group-hover:text-yellow"
            >
              hello@ride.rent
            </a>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};
export default Social;
