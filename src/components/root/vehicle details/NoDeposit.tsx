import React from "react";

const NoDeposit: React.FC = () => {
  return (
    <div className="inline-flex py-[0.3rem] animate-shimmer items-center justify-center rounded-[0.3rem] border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#707070,55%,#000103)] bg-[length:200%_100%] px-2 font-medium text-yellow transition-colors focus:outline-none text-sm md:text-base">
      No Deposit Required
    </div>
  );
};

export default NoDeposit;
