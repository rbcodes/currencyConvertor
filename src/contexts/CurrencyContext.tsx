import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Currency {
  name: string;
  rate: number;
  symbol: string;
}

interface CurrencyContextProps {
  rates: { [key: string]: Currency };
  setRates: React.Dispatch<React.SetStateAction<{ [key: string]: Currency }>>;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<{ [key: string]: Currency }>({});

  return (
    <CurrencyContext.Provider value={{ rates, setRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextProps => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
