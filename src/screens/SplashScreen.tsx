import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { fetchRates } from '../services/api';
import { loadCurrencySelection, saveCurrencySelection } from '../utils/storage';
import { useCurrency } from '../contexts/CurrencyContext';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { setRates } = useCurrency();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { from: fromCurrency, to: toCurrency } = await loadCurrencySelection();

        const ratesData = await fetchRates(fromCurrency);
        setRates(ratesData);

        await saveCurrencySelection(fromCurrency, toCurrency);

        setTimeout(() => {
          navigation.replace('Home');
        }, 3000); 

      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [navigation, setRates]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/loading.json')} 
        autoPlay
        loop
        style={styles.animation}
        testID="loading-animation" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', 
  },
  animation: {
    width: 200, 
    height: 200,
  },
});

export default SplashScreen;
