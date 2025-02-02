import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import UserNavigation from './App/routes/UserNavigation'; // Pastikan path ini benar
import { CartProvider } from './App/orders/CartContext';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Memuat font DM Sans
  const loadFonts = async () => {
    await Font.loadAsync({
      "DMSans-Regular": require('./assets/fonts/DMSans-Regular.ttf'), // Path ke file font Anda
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  // Menampilkan indikator loading jika font belum dimuat
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <UserNavigation />
      </NavigationContainer>
    </CartProvider>

  );
}
