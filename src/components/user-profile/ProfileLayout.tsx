import * as React from "react";

type ProfileLayoutProps = {
  className?: string;
  children: React.ReactNode;
};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 lg:space-y-8 lg:px-8 ${className}`}
  >
    {children}
  </div>
);
