import Link from "next/link";

const ViewAllButton = ({ link = "/" }: { link?: string }) => {
  return (
    <Link
      target="_blank"
      href={link}
      id="brands"
      className="flex items-center justify-center mx-auto mt-8 w-[150px] h-[43px] cursor-pointer rounded border-2 border-[#DDE5EB] bg-white text-black font-normal transition-all duration-200 hover:border-yellow hover:text-yellow active:scale-95"
    >
      View All
    </Link>
  );
};

export default ViewAllButton;