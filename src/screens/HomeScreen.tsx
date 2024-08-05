import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomDropdown from '../components/CustomDropdown'; 
import { transformRates, fetchRates } from '../services/api';
import { saveCurrencySelection, loadCurrencySelection } from '../utils/storage';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencyIcons from '../assets/CurrencyIcons'; 
import SwapFromImage from '../assets/SwapFrom.svg';
import debounce from 'lodash.debounce'; 

interface Currency {
  name: string;
  rate: number;
  symbol: string;
}

const getCurrencyIcon = (currencyCode: string) => {
  return CurrencyIcons[currencyCode] || null;
};

const HomeScreen: React.FC = () => {
  const { rates, setRates } = useCurrency();
  const [currencies, setCurrencies] = useState<{ label: string; value: string; image: React.FC }[]>([]);
  const [fromCurrency, setFromCurrency] = useState<Currency>({ name: 'GBP', rate: 1, symbol: '£' });
  const [toCurrency, setToCurrency] = useState<Currency>({ name: 'USD', rate: 1, symbol: '$' });
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [previousFromCurrency, setPreviousFromCurrency] = useState<Currency>(fromCurrency);
  const [previousToCurrency, setPreviousToCurrency] = useState<Currency>(toCurrency);

  useEffect(() => {
    const initializeData = async () => {
      const { from, to } = await loadCurrencySelection();
      setFromCurrency(from);
      setToCurrency(to);
      setPreviousFromCurrency(from);
      setPreviousToCurrency(to);
      const fetchedRates = await fetchRates(from);
      setRates(fetchedRates);
      setCurrencies(transformRates(fetchedRates).map(currency => ({
        ...currency,
        image: getCurrencyIcon(currency.value),
      })));
    };

    initializeData();
  }, []);

  const debouncedConvert = useCallback(
    debounce((value: string, fieldType: 'from' | 'to') => {
      if (rates[fromCurrency.name] && rates[toCurrency.name]) {
        const fromRate = rates[fromCurrency.name].rate;
        const toRate = rates[toCurrency.name].rate;
        const conversionRate = toRate / fromRate;

        if (fieldType === 'from') {
          const convertedToValue = (parseFloat(value) * conversionRate).toFixed(toCurrency.name === 'JPY' ? 0 : 2);
          setToValue(convertedToValue);
        } else if (fieldType === 'to') {
          const convertedFromValue = (parseFloat(value) / conversionRate).toFixed(fromCurrency.name === 'JPY' ? 0 : 2);
          setFromValue(convertedFromValue);
        }
      }
    }, 500), 
    [rates, fromCurrency, toCurrency]
  );

  useEffect(() => {
    if (fromValue !== '') {
      debouncedConvert(fromValue, 'from');
    } else {
      setToValue('');
    }
  }, [fromValue]);

  useEffect(() => {
    if (toValue !== '') {
      debouncedConvert(toValue, 'to');
    } else {
      setFromValue('');
    }
  }, [toValue]);

  const handleCurrencyChange = async (type: 'from' | 'to', value: string) => {
    const selectedCurrency = currencies.find(currency => currency.value === value);
    if (!selectedCurrency) return;

    const selectedCurrencyData = {
      name: value,
      rate: rates[value]?.rate || 1,
      symbol: rates[value]?.symbol || '',
    };

    if (type === 'from') {
      if (value === toCurrency.name) {
        Alert.alert('Error', 'Cannot select the same currency for both fields.');
        setFromCurrency(previousFromCurrency);
        return;
      }
      
      setPreviousFromCurrency(selectedCurrencyData);
      setFromCurrency(selectedCurrencyData);
      const updatedRates = await fetchRates(selectedCurrencyData);
      setRates(updatedRates);
      setCurrencies(transformRates(updatedRates).map(currency => ({
        ...currency,
        image: getCurrencyIcon(currency.value),
      })));
      setFromValue("1.00")
      await saveCurrencySelection(selectedCurrencyData, toCurrency);
    } else {
      if (value === fromCurrency.name) {
        Alert.alert('Error', 'Cannot select the same currency for both fields.');
        setToCurrency(previousToCurrency);
        return;
      }
      setPreviousToCurrency(selectedCurrencyData);
      setToCurrency(selectedCurrencyData);
      setFromValue("1.00")
      await saveCurrencySelection(fromCurrency, selectedCurrencyData);
    }
  };

  const fromSymbol = fromCurrency.symbol || '';
  const toSymbol = toCurrency.symbol || '';
  const conversionRate = rates[toCurrency.name]?.rate / rates[fromCurrency.name]?.rate;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <SwapFromImage style={styles.swapImage} />
        <Text style={styles.title}>Swap from</Text>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            style={styles.dropdown}
            placeholder="Select currency"
            searchPlaceholder="Search..."
            value={fromCurrency.name}
            data={currencies}
            onChange={item => handleCurrencyChange('from', item.value)}
            screenPosition={180}
          />
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{fromSymbol}</Text>
            <TextInput
              testID='fromAmount'
              style={styles.input}
              keyboardType="numeric"
              value={fromValue}
              onChangeText={text => {
                setFromValue(text);
                if (text.trim() === '') {
                  setToValue(''); 
                }
              }}
            />
          </View>
        </View>
        <Text style={styles.toText}>to</Text>
        <Text style={styles.rateText}>
          {fromCurrency.name} {fromSymbol}1.00 = {toCurrency.name} {toSymbol}{conversionRate?.toFixed(2)}
        </Text>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            style={styles.dropdown}
            placeholder="Select currency"
            searchPlaceholder="Search..."
            value={toCurrency.name}
            data={currencies}
            onChange={item => handleCurrencyChange('to', item.value)}
            screenPosition={400}
          />
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>{toSymbol}</Text>
            <TextInput
              testID='toAmount'
              style={styles.input}
              keyboardType="numeric"
              value={toValue}
              onChangeText={text => {
                setToValue(text);
                if (text.trim() === '') {
                  setFromValue(''); 
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 24, 
    alignItems: 'center',
  },
  swapImage: {
    width: 100, 
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333', 
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 30, 
  },
  dropdown: {
    width: '100%',
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', 
    marginRight: 10,
  },
  toText: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333', 
  },
  rateText: {
    fontSize: 18,
    color: '#333', 
    marginTop: 15,
    marginBottom: 40,
    textAlign: 'center', 
    paddingHorizontal: 16, 
  },
});

export default HomeScreen;
