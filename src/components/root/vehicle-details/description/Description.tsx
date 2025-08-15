import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import styles from './Description.module.scss';
import DescriptionToggle from './DescriptionToggle';

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }

  return (
    <MotionDiv className={styles['description-section']}>
      <h2 className="border-b pb-4 text-base font-medium lg:text-lg">
        Description
      </h2>

      {/* Hidden checkbox for toggling */}
      <input
        type="checkbox"
        id="toggle-description"
        className={styles['toggle-checkbox']}
        aria-hidden="true"
      />

      {/* Inject description content */}
      <div className={styles['description-content']} id="description-content">
        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>

      {/* Gradient overlay and toggle button */}
      <div className={styles.overlay}>
        <DescriptionToggle isExpanded={false} />
      </div>
    </MotionDiv>
  );
};

export default Description;
