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
    <div className="card-payments">
      <div className="card-payments-text">{message}</div>
      <div className="card-payments-icons">
        {creditDebitCards && (
          <img
            src="/assets/icons/profile icons/cards.svg"
            alt="credit/debit card"
            className="card-icon"
          />
        )}
        {tabby && (
          <img
            src="/assets/icons/profile icons/tabby.svg"
            alt="tabby card"
            className={`card-icon card-icon-tabby`}
          />
        )}
      </div>
    </div>
  );
}

export default CardPayments;
