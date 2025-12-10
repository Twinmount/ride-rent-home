import { CheckCircle } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";
import { usePriceConverter } from "@/hooks/usePriceConverter";

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
  const { convert } = usePriceConverter();

  return (
    <div
      className={`mx-2 my-4 flex items-center text-xs ${
        isDisabled ? "text-gray-400" : "text-text-secondary"
      }`}
    >
      {securityDeposit?.enabled ? (
        <div className="relative h-[18px] w-[18px] flex-shrink-0">
          <SafeImage
            src="/assets/icons/detail-page/deposits.svg"
            alt="deposit"
            fill
            className={`object-contain ${isDisabled ? "opacity-50" : ""}`}
            sizes="18px"
          />
        </div>
      ) : (
        <CheckCircle
          className={`h-[18px] w-[18px] flex-shrink-0 ${isDisabled ? "opacity-50" : ""}`}
        />
      )}
      <span
        className={`ml-1.5 whitespace-nowrap text-xs font-normal capitalize leading-[18px] ${
          isDisabled ? "text-gray-400" : ""
        }`}
      >
        {securityDeposit?.enabled
          ? `${convert(Number(securityDeposit?.amountInAED))} deposit applies`
          : "No security deposit"}
      </span>
    </div>
  );
};

export default SecurityDepositInfo;
