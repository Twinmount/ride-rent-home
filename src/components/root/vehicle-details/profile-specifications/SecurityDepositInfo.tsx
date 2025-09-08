import { CheckCircle } from 'lucide-react';
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
        <div className="relative h-5 w-5 flex-shrink-0">
          <Image
            src="/assets/icons/detail-page/deposits.svg"
            alt="deposit"
            fill
            className="object-contain"
            sizes="20px"
          />
        </div>
      ) : (
        <CheckCircle className="h-4 w-4 flex-shrink-0" />
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
