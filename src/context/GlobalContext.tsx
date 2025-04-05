"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { VehicleCardContextProvider } from "./VehicleCardContext";
import { useImmer } from "use-immer";
import { useFetchExchangeRates } from "@/hooks/useFetchExchangeRates";

type GlobalContextType = {
  isPageLoading: boolean;
  setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  exchangeRates: { [key: string]: number };
};

type ExchangeValue = {
  sourceCurrency: string;
  exchangeRates: { [key: string]: number };
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useImmer<{ [key: string]: number }>(
    {
      AED: 1,
    },
  );
  const [currency, setCurrency] = useImmer<string>("AED");

  const {
    exchangeValue,
    isLoading,
  }: { exchangeValue: ExchangeValue | any; isLoading: boolean } =
    useFetchExchangeRates();

  useEffect(() => {
    if (isLoading) return;
    const mergedRates = {
      [exchangeValue.sourceCurrency]: 1,
      ...exchangeValue.exchangeRates,
    };

    setExchangeRates(mergedRates);
  }, [exchangeValue]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");

    if (storedCurrency && exchangeRates[storedCurrency]) {
      setCurrency(storedCurrency);
    } else {
      setCurrency("AED");
    }
  }, [exchangeRates]);

  return (
    <GlobalContext.Provider
      value={{
        isPageLoading,
        setIsPageLoading,
        currency,
        setCurrency,
        exchangeRates,
      }}
    >
      <VehicleCardContextProvider>{children}</VehicleCardContextProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }

  return context;
};
