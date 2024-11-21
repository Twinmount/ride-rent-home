import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import "./Description.scss";
import DescriptionToggle from "./DescriptionToggle";

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }

  const formattedDescription = description.replace(/\n/g, "<br>");

  return (
    <MotionDiv className="description-section">
      <h2 className="custom-heading">Description</h2>
      {/* Hidden checkbox for toggling */}
      <input
        type="checkbox"
        id="toggle-description"
        className="toggle-checkbox"
        aria-hidden="true"
      />
      <div className="description-content" id="description-content">
        <div dangerouslySetInnerHTML={{ __html: formattedDescription }}></div>
      </div>

      <div className="overlay">
        <DescriptionToggle isExpanded={false} />
      </div>
    </MotionDiv>
  );
};

export default Description;
