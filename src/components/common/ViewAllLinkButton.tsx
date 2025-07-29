import { FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ViewAllLinkButtonProps {
  link: string;
  text?: string;
  className?: string;
}

export default function ViewAllLinkButton({ 
  link, 
  text = "View All",
  className = "" 
}: ViewAllLinkButtonProps) {
  return (
    <Link 
      href={link}
      className={`inline-flex justify-center items-center h-[43px] w-[120px] gap-2 px-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm ${className}`}
    >
      <span>{text}</span>
      <FaExternalLinkAlt className="w-3 h-3" />
    </Link>
  );
}