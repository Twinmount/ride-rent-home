import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

const ViewAllButton = ({ link = "/" }: { link?: string }) => {
  return (
    <Link
      target="_blank"
      href={link}
      className="ml-auto mt-4 flex h-8 w-fit cursor-pointer items-center gap-1 self-end rounded border border-gray-800 px-2 text-black shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
    >
      View All <GoArrowRight />
    </Link>
  );
};
export default ViewAllButton;
