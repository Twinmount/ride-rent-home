import React from "react";

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  children,
  isLoading = false,
  loadingText = "Loading..."
}) => {
  return (
    <div>
      <h3 className="mb-4 text-[1.1rem] text-white">{title}</h3>
      {isLoading ? (
        <div className="text-base font-light text-gray-400">{loadingText}</div>
      ) : (
        <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
          {children}
        </div>
      )}
    </div>
  );
};

export default FooterSection;