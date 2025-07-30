import { FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ViewAllLinkButtonProps {
  link: string;
  text?: string;
  className?: string;
}

export default function ViewAllLinkButton({
  link,
  text = 'View All',
  className = '',
}: ViewAllLinkButtonProps) {
  return (
    <Link
      href={link}
      className={`inline-flex h-[35px] w-[100px] items-center justify-center gap-2 rounded-lg bg-white px-2 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 sm:h-[43px] sm:w-[120px] sm:text-sm md:border md:border-gray-300 ${className}`}
    >
      <span className="pb-[0.8rem] text-yellow sm:pb-0 md:text-text-primary">
        {text}
      </span>
      <FaExternalLinkAlt className="hidden h-3 w-3 md:block" />
    </Link>
  );
}