import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import DescriptionToggle from "./DescriptionToggle";

const Description = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }

  const formattedDescription = description.replace(/\n/g, "<br>");

  return (
    <MotionDiv className="relative mx-auto my-4 mb-8 h-auto max-w-[80%] overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 pb-12 shadow-sm lg:max-w-[80%]">
      <h2 className="custom-heading mb-8 text-gray-900">Description</h2>
      {/* Hidden checkbox for toggling */}
      <input
        type="checkbox"
        id="toggle-description"
        className="hidden"
        aria-hidden="true"
      />
      <div
        className="max-h-60 overflow-hidden whitespace-pre-wrap break-words transition-[max-height] duration-300 ease-in-out"
        id="description-content"
      >
        <div dangerouslySetInnerHTML={{ __html: formattedDescription }}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-24 items-end justify-center bg-gradient-to-b from-transparent to-white pb-2">
        <DescriptionToggle isExpanded={false} />
      </div>
    </MotionDiv>
  );
};

export default Description;
