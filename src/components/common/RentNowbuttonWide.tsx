type RentNowButtonWideProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'wide' | 'compact';
};

const RentNowButtonWide = ({
  onClick,
  disabled = false,
  className = '',
  variant = 'wide',
}: RentNowButtonWideProps) => {
  // Define size classes based on variant
  const sizeClasses =
    variant === 'compact' ? 'py-2 px-6 text-sm' : 'py-3 px-6 text-lg';

  // Define width classes based on variant
  const widthClasses = variant === 'compact' ? 'w-auto' : 'w-full';

  // Define margin classes based on variant
  const marginClasses = variant === 'compact' ? 'mb-2' : 'mt-4';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` ${widthClasses} ${marginClasses} ${sizeClasses} relative transform overflow-hidden rounded-[0.34rem] bg-gradient-to-r from-orange to-yellow font-medium text-text-primary shadow-md transition-transform duration-200 ease-in-out before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow before:to-orange before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:shadow-lg hover:before:opacity-100 active:scale-[0.98] active:from-[#df7204] active:to-orange disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 ${className} `}
    >
      <span className="relative z-10">Rent Now</span>
    </button>
  );
};

export default RentNowButtonWide;
