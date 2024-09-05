import './Social.scss'
import { socialMediaData } from '.'
import Link from 'next/link'

const Social = () => {
  return (
    <div className="social">
      {socialMediaData.map((data) => {
        const Icon = data.icon
        return (
          <Link
            href={data.link}
            key={data.id}
            target="_blank"
            className="icon-box"
          >
            <Icon className={`icon facebook ${data.customClass}`} />
          </Link>
        )
      })}
    </div>
  )
}
export default Social
