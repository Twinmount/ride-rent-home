import { MdEmail } from 'react-icons/md'
import { socials } from '.'
import './Social.scss'
import { FaPhoneVolume } from 'react-icons/fa6'
import MotionDiv from '../../general/framer-motion/MotionDiv'

const Social = () => {
  return (
    <MotionDiv className="social-container">
      <div className="left">
        {/* contact */}
        <div className="contact">
          {/* mobile  */}
          <div className="contact-box">
            <FaPhoneVolume className="icon" />
            <a
              href="tel:+971502972335"
              className="p-0 max-h-fit max-w-fit w-fit h-fit"
            >
              +971 50 297 2335
            </a>
          </div>
          {/* mail */}
          <div className="contact-box">
            <MdEmail className="icon" />
            <a href="mailto:hello@ride.rent" className="">
              hello@ride.rent
            </a>
          </div>
        </div>
      </div>

      {/* social */}
      <div className="social-media">
        <div className="title">We are Social!</div>
        <div className="icons">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-container"
              >
                <Icon className="icon" />
              </a>
            )
          })}
        </div>
      </div>
    </MotionDiv>
  )
}
export default Social
