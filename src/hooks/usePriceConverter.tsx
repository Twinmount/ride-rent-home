import { useGlobalContext } from "@/context/GlobalContext";

export const usePriceConverter = () => {
  const { currency, exchangeRates } = useGlobalContext();

  const convert = (
    price: number,
    position: "current" | "prefix" = "current",
  ): string => {
    const rate = exchangeRates[currency];
    const converted = Math.round(price * rate);

    return position === "prefix"
      ? `${currency} ${converted}`
      : `${converted} ${currency}`;
  };

  return { convert };
};
