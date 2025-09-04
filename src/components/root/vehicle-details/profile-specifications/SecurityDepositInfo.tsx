import { HandCoins, CheckCircle } from 'lucide-react';
import Image from 'next/image';

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
        <Image
          src="/assets/icons/detail-page/deposits.svg"
          alt="deposit"
          width={20}
          height={20}
        />
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
