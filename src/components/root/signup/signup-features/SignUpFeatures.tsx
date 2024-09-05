import './SignUpFeatures.scss'
import { GiCheckMark } from 'react-icons/gi'

const SignUpFeatures = () => {
  return (
    <div className="feature-container">
      <ul>
        <li>
          <GiCheckMark className="check-icon" /> No Middlemen of Commission
        </li>
        <li>
          <GiCheckMark className="check-icon" />
          Faster On-boarding
        </li>
        <li>
          <GiCheckMark className="check-icon" /> Get Booking details via direct
          SMS/Email/Call
        </li>
        <li>
          <GiCheckMark className="check-icon" /> Dedicated Profiles
        </li>
      </ul>
    </div>
  )
}
export default SignUpFeatures
