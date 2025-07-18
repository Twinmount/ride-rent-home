import React from "react";
import Link from "next/link";

interface FooterLinkProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  onClick,
  children,
  isExternal = false,
  className = ""
}) => {
  const baseClasses = "flex w-fit gap-[0.2rem] text-white hover:text-white";
  const linkContent = (
    <>
      &sdot;{" "}
      <span className="w-fit cursor-pointer text-sm text-text-tertiary transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow ">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${className}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {linkContent}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {linkContent}
    </div>
  );
};

export default FooterLink;