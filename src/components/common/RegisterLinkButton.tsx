import Link from 'next/link';

type RegisterLinkButtonProps = {
  country: string;
  children?: React.ReactNode;
  className?: string;
};

export default function RegisterLinkButton({
  country,
  children,
  className = '',
}: RegisterLinkButtonProps) {
  return (
    <Link
      href={`https://agent.ride.rent/${country}/register`}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-fit whitespace-nowrap rounded border border-black/10 bg-theme-gradient px-4 py-2 text-sm font-medium text-black shadow lg:text-base ${className}`}
    >
      {children || 'List Your Vehicle for FREE'}
    </Link>
  );
}
