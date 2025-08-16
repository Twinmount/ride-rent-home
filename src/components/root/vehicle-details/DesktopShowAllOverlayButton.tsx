import { FC } from 'react';

interface Props {
  onClick: () => void;
  show: boolean;
  text?: string;
}

const DesktopShowAllOverlayButton: FC<Props> = ({
  onClick,
  show,
  text = 'Show All',
}) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 hidden h-24 items-end justify-center bg-gradient-to-b from-transparent to-white/90 xl:flex">
      <button
        onClick={onClick}
        className="mb-2 flex cursor-pointer items-center gap-x-2 rounded-2xl border border-orange bg-white p-1 px-4 text-orange shadow-sm transition-transform ease-in-out hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
      >
        {text}
      </button>
    </div>
  );
};

export default DesktopShowAllOverlayButton;
