import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SplashScreen from '../src/screens/SplashScreen';
import { useCurrency } from '../src/contexts/CurrencyContext';
import { fetchRates } from '../src/services/api';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../src/contexts/CurrencyContext');
jest.mock('../src/services/api');

const mockedNavigation = { replace: jest.fn() };

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);  
    AsyncStorage.setItem.mockResolvedValue(); 
    useCurrency.mockReturnValue({
      setRates: jest.fn(),
    });
  });

  it('should display loading animation', () => {
    const { getByTestId } = render(<SplashScreen navigation={mockedNavigation} />);
    expect(getByTestId('loading-animation')).toBeTruthy();
  });

  it('should load initial currencies and navigate to Home', async () => {
    fetchRates.mockResolvedValue({ USD: { name: 'USD', rate: 1.2, symbol: '$' } });

    const setRates = jest.fn();
    useCurrency.mockReturnValue({ setRates });

    render(
      <NavigationContainer>
        <SplashScreen navigation={mockedNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(setRates).toHaveBeenCalled();
      expect(mockedNavigation.replace).toHaveBeenCalledWith('Home');
    }, { timeout: 5000 });
  });
});
