import Link from 'next/link';

type ViewAllButtonProps = {
  link?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
};

const ViewAllButton = ({
  link = '/',
  target = '_blank',
}: ViewAllButtonProps) => {
  return (
    <Link
      target={target}
      href={link}
      id="brands"
      className="mx-auto mt-8 flex h-[43px] w-[150px] cursor-pointer items-center justify-center rounded border-2 border-[#DDE5EB] bg-white font-normal text-black transition-all duration-200 hover:border-yellow hover:text-yellow active:scale-95"
    >
      View All
    </Link>
  );
};

export default ViewAllButton;
