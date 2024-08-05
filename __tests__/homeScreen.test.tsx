import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { fetchRates, transformRates } from '../src/services/api';
import { CurrencyProvider } from '../src/contexts/CurrencyContext';
import { SvgXml } from 'react-native-svg';

// Mock modules
jest.mock('../src/services/api', () => ({
  fetchRates: jest.fn(),
  transformRates: jest.fn(), 
}));
jest.mock('react-native-svg', () => ({ SvgXml: () => null }));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchRates as jest.Mock).mockResolvedValue({
      "USD": {
        rate: 1.0837761,
        name: 'US Dollar',
        symbol: '$',
      },
      "GBP": {
        rate: 0.8575239,
        name: 'British Pound',
        symbol: '£',
      },
    });

    (transformRates as jest.Mock).mockImplementation(rates => 
      Object.keys(rates).map(key => ({
        label: `${key}`,
        value: key,
      }))
    );
  });

  it('should render dropdowns and input fields', async () => {
    render(
      <CurrencyProvider>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </CurrencyProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Swap from')).toBeTruthy();
      expect(screen.getByText('to')).toBeTruthy();
    });
  });
});
