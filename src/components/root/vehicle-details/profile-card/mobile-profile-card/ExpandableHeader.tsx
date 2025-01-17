import { MdOutlineExpandCircleDown } from "react-icons/md";

type ExpandableHeaderProps = {
  isExpanded: boolean;
  onToggle: () => void;
  onMouseLeave?: () => void;
  heading: string;
  isUnavailable?: boolean;
};

const ExpandableHeader = ({
  isExpanded,
  onToggle,
  onMouseLeave,
  heading,
  isUnavailable = false,
}: ExpandableHeaderProps) => {
  return (
    <div
      className="profile-heading top-heading"
      onMouseLeave={onMouseLeave || (() => {})}
    >
      <h2 className="custom-heading mobile-profile-heading">
        {heading}
        {isUnavailable && (
          <span className="disabled-text">&#40;Currently unavailable&#41;</span>
        )}
      </h2>
      <button className="expand" onClick={onToggle}>
        {isExpanded ? "show less" : "show more"}{" "}
        <MdOutlineExpandCircleDown className="icon" />
      </button>
    </div>
  );
};

export default ExpandableHeader;
