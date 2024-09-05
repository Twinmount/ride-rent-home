import { GiCheckMark } from 'react-icons/gi'
import './DocumentsRequired.scss'
import Image from 'next/image'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import Link from 'next/link'

const DocumentsRequired = () => {
  return (
    <div className="documents_bottom">
      <div className="heading">
        <h2>Documents Required to Car & Drive in the UAE</h2>
        <hr />
      </div>
      <div className="box_container">
        {/* left doc */}
        <MotionDiv className="box">
          <div className="box_left">
            <Image
              width={100}
              height={100}
              src={'/assets/img/documents/Residents.webp'}
              alt="Resident's image"
            />
          </div>
          <div className="box_right">
            <h3>For UAE Residents</h3>
            <div>
              <p>
                <GiCheckMark className="tick_icon" /> Valid UAE Driving License
              </p>
              <p>
                <GiCheckMark className="tick_icon" /> Emirates ID
              </p>
              <p>
                <GiCheckMark className="tick_icon" /> (Residential Visa may be
                acceptable)
              </p>
            </div>
          </div>
        </MotionDiv>
        {/* right doc */}
        <MotionDiv className="box two">
          <div className="box_left">
            <Image
              width={100}
              height={100}
              src={'/assets/img/documents/UAE.webp'}
              alt="Tourist's image"
            />
          </div>
          <div className="box_right">
            <h3>For Tourists in UAE</h3>
            <div>
              <p>
                <GiCheckMark className="tick_icon" /> Valid Passport
              </p>
              <p>
                <GiCheckMark className="tick_icon" /> Visa Details
              </p>
              <p>
                <GiCheckMark className="tick_icon" /> Home Country Driving
                License
              </p>
              <p>
                <GiCheckMark className="tick_icon" /> International Driving
                Permit (IDP)
              </p>
            </div>
          </div>
        </MotionDiv>
      </div>

      <div className="bottom_description">
        <p>
          Travellers from the GCC, US, UK, Canada, Europe, and some other places
          can use their home country driver&apos;s license to drive in UAE,
          without needing an International Driving Permit (IDP) .
        </p>
        <br />
        <p>
          <Link href="/" target="_blank" className="text-blue-500">
            Click here{' '}
          </Link>{' '}
          to find out if your country&apos;s license is accepted in the UAE.
        </p>
      </div>
    </div>
  )
}
export default DocumentsRequired
