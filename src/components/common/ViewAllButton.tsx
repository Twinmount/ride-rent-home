import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

const ViewAllButton = ({ link = "/" }: { link?: string }) => {
  return (
    <Link
      target="_blank"
      href={link}
      id="brands"
      className="flex-center mx-auto mt-8 h-8 w-fit cursor-pointer gap-1 self-end rounded border border-gray-300 bg-white px-2 text-black shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
    >
      View All <SquareArrowOutUpRight size={16} strokeWidth={1.5} />
    </Link>
  );
};
export default ViewAllButton;
