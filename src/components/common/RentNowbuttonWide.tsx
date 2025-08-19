import React from 'react';

type RentNowButtonWideProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const RentNowButtonWide = ({ 
  onClick, 
  disabled = false, 
  className = "" 
}: RentNowButtonWideProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        mt-4   
        py-3 px-6
        relative overflow-hidden
        bg-gradient-to-r from-orange to-yellow
        active:from-[#df7204] active:to-orange
        disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
        text-text-primary font-medium text-lg
        rounded-[0.34rem]
        transform active:scale-[0.98]
        shadow-md hover:shadow-lg
        transition-transform duration-200 ease-in-out
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow before:to-orange
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300 before:ease-in-out
        ${className}
      `}
    >
      <span className="relative z-10">Rent Now</span>
    </button>
  );
};

export default RentNowButtonWide;