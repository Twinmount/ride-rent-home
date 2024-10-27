import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import "./Description.scss";

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }

  const formattedDescription = description.replace(/\n/g, "<br>");
  return (
    <MotionDiv className="description-section">
      <h2 className="custom-heading">Description</h2>
      <div dangerouslySetInnerHTML={{ __html: formattedDescription }}></div>
    </MotionDiv>
  );
};
export default Description;
