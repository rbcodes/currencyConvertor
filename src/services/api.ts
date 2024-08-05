import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/rates'; // Replace with your machine's IP address

interface Currency {
  name: string;
  rate: number;
  symbol: string;
}

export const fetchRates = async (currency: Currency): Promise<{ [key: string]: Currency }> => {
  try {
    const response = await axios.get(`${API_URL}/${currency.name}`, {
      headers: {
        'x-api-key': '85f7ccfd-677a-4e5a-a5eb-21c19734edf7',
      },
    });
    const rates = response.data;
    delete rates["JPY"];
    rates[currency.name] = { name: currency.name, rate: 1, symbol: currency.symbol };
    return rates;
  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
};

export const transformRates = (rates: { [key: string]: Currency }) => {
  return Object.keys(rates).map(key => ({
    label: `${key}`,
    value: key,
  }));
};
