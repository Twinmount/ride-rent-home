import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import styles from "./Description.module.scss";
import DescriptionToggle from "./DescriptionToggle";

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }

  return (
    <MotionDiv className={styles["description-section"]}>
      <h2 className="custom-heading">Description</h2>

      {/* Hidden checkbox for toggling */}
      <input
        type="checkbox"
        id="toggle-description"
        className={styles["toggle-checkbox"]}
        aria-hidden="true"
      />

      {/* Render the description content */}
      <div className={styles["description-content"]} id="description-content">
        <div
          dangerouslySetInnerHTML={{
            __html: description, // Render HTML content
          }}
        ></div>
      </div>

      {/* Gradient overlay and toggle button */}
      <div className={styles.overlay}>
        <DescriptionToggle isExpanded={false} />
      </div>
    </MotionDiv>
  );
};

export default Description;
