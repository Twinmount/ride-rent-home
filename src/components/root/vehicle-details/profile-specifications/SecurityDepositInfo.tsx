import { HandCoins, CheckCircle } from 'lucide-react';

type SecurityDepositInfoProps = {
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
};

const SecurityDepositInfo = ({ securityDeposit }: SecurityDepositInfoProps) => {
  return (
    <div className="mx-4 flex items-center justify-center text-sm text-text-secondary">
      {securityDeposit?.enabled ? (
        <HandCoins className="w-2" />
      ) : (
        <CheckCircle className="w-4" />
      )}
      <span className="ml-1 whitespace-nowrap text-sm font-normal capitalize">
        {securityDeposit?.enabled
          ? `${securityDeposit?.amountInAED} AED deposit applies`
          : 'No security deposit'}
      </span>
    </div>
  );
};

export default SecurityDepositInfo;
