import { AuthProvider } from '@/contexts/AuthContext';
import { BSCTProvider } from '@/contexts/BsctContext';
import { FavouriteProvider } from '@/contexts/FavouriteContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ProductCTGDProvider } from '@/contexts/ProductCTGDContext';
import { ProductNNDTProvider } from '@/contexts/ProductNNDTContext';
import { SliderProvider } from '@/contexts/SliderContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ThuVienProvider } from '@/contexts/ThuVienContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";

function AppContent() {
    useNotifications();
  const { theme, isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // For Android, you might want to handle system UI visibility
    }
  }, [isDark]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.headerBackground} // chỉ có tác dụng trên Android
        translucent
      />
      <Stack
        screenOptions={{
          headerShown: false, 
          // statusBarStyle: isDark ? "light" : "dark",
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      > 
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false}} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        {/* <Stack.Screen name="productbycategory/[id]" options={{ headerShown: false }} /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex : 1}}>
      <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <FavouriteProvider>
            <SliderProvider>
              <BSCTProvider>
                <ThuVienProvider>
                  <NotificationProvider>
                    <ProductCTGDProvider>
                      <ProductNNDTProvider>
                        {/* <GestureHandlerRootView style={{ flex: 1 }}>
                          <StatusBar style={isDark ? "light" : "dark"} />
                          <Stack screenOptions={{
                            headerShown: false,
                          }}>
                            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)" />
                          </Stack>
                        </GestureHandlerRootView> */}
                        <AppContent />
                      </ProductNNDTProvider>
                    </ProductCTGDProvider>
                  </NotificationProvider>
                </ThuVienProvider>
              </BSCTProvider>
            </SliderProvider>
          </FavouriteProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}