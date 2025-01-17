import { ThumbsUp } from "lucide-react";

type LeaseInfoProps = {
  isLease: boolean;
};

const LeaseInfo = ({ isLease }: LeaseInfoProps) => {
  if (!isLease) return null;

  return (
    <div className="mx-auto -mb-3 -mt-2 flex w-[97%] items-center justify-center rounded-md p-1.5 px-3">
      <ThumbsUp className="text-yellow-500 mb-1 h-auto w-5" />
      <span className="ml-1 whitespace-nowrap text-sm font-light capitalize">
        This vehicle is also available for lease
      </span>
    </div>
  );
};

export default LeaseInfo;
