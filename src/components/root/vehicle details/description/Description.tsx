import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import './Description.scss'

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null
  }
  return (
    <MotionDiv className="description-section">
      <h2 className="custom-heading">Description</h2>
      <p>{description}</p>
    </MotionDiv>
  )
}
export default Description
