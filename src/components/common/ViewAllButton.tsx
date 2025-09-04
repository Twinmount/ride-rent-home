import { cn } from '@/lib/utils';
import Link from 'next/link';

type ViewAllButtonProps = {
  link?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  align?: 'center' | 'end';
  type?: 'state' | 'default'; // Added optional type prop
};

const ViewAllButton = ({
  link = '/',
  target = '_blank',
  align = 'center',
  type = 'default', // Default value
}: ViewAllButtonProps) => {
  // Function to get button label based on type
  const getButtonLabel = () => {
    return type === 'state' ? 'All Locations' : 'View All';
  };

  return (
    <Link
      target={target}
      href={link}
      id="brands"
      className={cn(
        'mt-8 flex h-[37px] w-[120px] cursor-pointer items-center justify-center rounded border-2 border-[#DDE5EB] bg-white text-sm font-normal text-black transition-all duration-200 hover:border-yellow hover:text-yellow active:scale-95 lg:h-[43px] lg:w-[150px] lg:text-base',
        align === 'center' && 'mx-auto',
        align === 'end' && 'ml-auto'
      )}
    >
      {getButtonLabel()}
    </Link>
  );
};

export default ViewAllButton;