import './PromotionCard.scss'
import { PromotionType } from '@/types'
import Link from 'next/link'

const PromotionCard = ({ promotionImage, promotionLink }: PromotionType) => {
  return (
    <Link href={promotionLink} target="_blank" rel="noopener noreferrer">
      <div className="promotion-card-container" style={{ cursor: 'pointer' }}>
        <figure className="img-container">
          <img src={promotionImage} alt="Promotion" className="promotion-img" />
          <div className="overlay">
            <span className="overlay-text">Visit </span>
          </div>
        </figure>
      </div>
    </Link>
  )
}

export default PromotionCard
