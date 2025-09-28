import { CheckCircle } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

type SecurityDepositInfoProps = {
  securityDeposit: {
    enabled: boolean;
    amountInAED: string;
  };
  isDisabled?: boolean;
};

const SecurityDepositInfo = ({
  securityDeposit,
  isDisabled = false,
}: SecurityDepositInfoProps) => {
  return (
    <div
      className={`mx-4 flex items-center justify-center text-sm ${
        isDisabled ? "text-gray-400" : "text-text-secondary"
      }`}
    >
      {securityDeposit?.enabled ? (
        <div className="relative h-5 w-5 flex-shrink-0">
          <SafeImage
            src="/assets/icons/detail-page/deposits.svg"
            alt="deposit"
            fill
            className={`object-contain ${isDisabled ? "opacity-50" : ""}`}
            sizes="20px"
          />
        </div>
      ) : (
        <CheckCircle
          className={`h-4 w-4 flex-shrink-0 ${isDisabled ? "opacity-50" : ""}`}
        />
      )}
      <span
        className={`ml-1 whitespace-nowrap text-sm font-normal capitalize ${
          isDisabled ? "text-gray-400" : ""
        }`}
      >
        {securityDeposit?.enabled
          ? `${securityDeposit?.amountInAED} AED deposit applies`
          : "No security deposit"}
      </span>
    </div>
  );
};

export default SecurityDepositInfo;
