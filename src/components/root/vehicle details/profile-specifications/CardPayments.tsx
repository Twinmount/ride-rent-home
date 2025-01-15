type CardPaymentsProps = {
  creditDebitCards: boolean;
  tabby: boolean;
};

function CardPayments({ creditDebitCards, tabby }: CardPaymentsProps) {
  // If neither is available, return null or a message
  if (!creditDebitCards && !tabby) return null;

  let message = "";
  if (creditDebitCards && tabby) {
    message = "Accepts all card payments";
  } else if (creditDebitCards) {
    message = "Accepts credit/debit cards";
  } else if (tabby) {
    message = "Accepts Tabby card";
  }

  return (
    <div className="-mb-3 flex items-center justify-center gap-2">
      <div className="text-sm font-normal">{message}</div>
      <div className="flex gap-1">
        {creditDebitCards && (
          <img
            src="/assets/icons/profile-icons/cards.svg"
            alt="credit/debit card"
            className="w-7"
          />
        )}
        {tabby && (
          <img
            src="/assets/icons/profile-icons/tabby.svg"
            alt="tabby card"
            className="w-8"
          />
        )}
      </div>
    </div>
  );
}

export default CardPayments;
