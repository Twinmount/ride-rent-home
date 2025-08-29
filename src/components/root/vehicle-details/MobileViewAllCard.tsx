import { ChevronRight } from 'lucide-react';

interface MobileViewAllCardProps {
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const MobileViewAllCard: React.FC<MobileViewAllCardProps> = ({
  onClick,
  title,
  description,
  icon,
}) => {
  return (
    <div className="w-full rounded-[0.3rem] border xl:hidden">
      <button
        onClick={onClick}
        className="w-full rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center text-gray-400">
              {icon}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">{title}</div>
              <div className="text-xs text-gray-500">{description}</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>
    </div>
  );
};

export default MobileViewAllCard;
