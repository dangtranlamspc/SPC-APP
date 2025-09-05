import { AuthProvider } from '@/contexts/AuthContext';
import { FavouriteProvider } from '@/contexts/FavouriteContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { SliderProvider } from '@/contexts/SliderContext';
// import { Drawer } from "expo-router/drawer";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { Text } from 'react-native';
import { BSCTProvider } from '@/contexts/BsctContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <FavouriteProvider>
          <SliderProvider>
            <BSCTProvider>
              <GestureHandlerRootView style={{flex:1}}>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" />
                </Stack>
              </GestureHandlerRootView>
            </BSCTProvider>
          </SliderProvider>
        </FavouriteProvider>
      </ProductProvider>
    </AuthProvider>
  );
}