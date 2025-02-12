import { HandCoins } from "lucide-react";

type SecurityDepositInfoProps = {
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
};

const SecurityDepositInfo = ({ securityDeposit }: SecurityDepositInfoProps) => {
  if (!securityDeposit?.enabled) return null;

  return (
    <div className="-mb-1 flex items-center justify-center">
      <HandCoins className="text-yellow-500 h-auto w-5" />
      <span className="ml-1 whitespace-nowrap text-sm font-normal capitalize">
        {`${securityDeposit?.amountInAED} AED deposit applies`}
      </span>
    </div>
  );
};

export default SecurityDepositInfo;
