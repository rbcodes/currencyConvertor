import AsyncStorage from '@react-native-async-storage/async-storage';

const FROM_CURRENCY_KEY = 'from_currency';
const TO_CURRENCY_KEY = 'to_currency';

interface Currency {
  name: string;
  rate: number;
  symbol: string;
}

export const saveCurrencySelection = async (fromCurrency: Currency, toCurrency: Currency): Promise<void> => {
  try {
    await AsyncStorage.setItem(FROM_CURRENCY_KEY, JSON.stringify(fromCurrency));
    await AsyncStorage.setItem(TO_CURRENCY_KEY, JSON.stringify(toCurrency));
  } catch (error) {
    console.error('Error saving currency selection:', error);
  }
};

export const loadCurrencySelection = async (): Promise<{ from: Currency; to: Currency }> => {
  try {
    const fromCurrency = await AsyncStorage.getItem(FROM_CURRENCY_KEY);
    const toCurrency = await AsyncStorage.getItem(TO_CURRENCY_KEY);

    return {
      from: fromCurrency ? JSON.parse(fromCurrency) : { name: 'GBP', rate: 1, symbol: '£' },
      to: toCurrency ? JSON.parse(toCurrency) : { name: 'USD', rate: 1, symbol: '$' },
    };
  } catch (error) {
    console.error('Error loading currency selection:', error);
    return {
      from: { name: 'GBP', rate: 1, symbol: '£' },
      to: { name: 'USD', rate: 1, symbol: '$' },
    };
  }
};
