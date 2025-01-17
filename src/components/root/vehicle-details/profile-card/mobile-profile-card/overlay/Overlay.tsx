import "./Overlay.scss";

type OverlayProps = {
  isVisible: boolean;
};

const Overlay = ({ isVisible }: OverlayProps) => {
  return (
    <div className={`black-overlay ${isVisible ? "visible" : "hidden"}`} />
  );
};

export default Overlay;
