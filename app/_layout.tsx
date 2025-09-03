import { AuthProvider } from '@/contexts/AuthContext';
import { FavouriteProvider } from '@/contexts/FavouriteContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { SliderProvider } from '@/contexts/SliderContext';
// import { Drawer } from "expo-router/drawer";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
// import { Text } from 'react-native';
import { Stack } from 'expo-router';
import "../global.css";
export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <FavouriteProvider>
          <SliderProvider>
            <StatusBar style="light" />
            {/* <Drawer
              screenOptions={{
                headerShown: false, drawerActiveTintColor: "#007AFF",
                drawerLabelStyle: {
                  fontSize: 16,
                },
              }}
            >
              <Drawer.Screen
                name="(tabs)"
                options={{
                  drawerLabel: "Trang chủ",
                  drawerIcon: ({ size, color }) => (
                    <Text style={{ fontSize: size, color }}>🏠</Text>
                  ),
                }}
              />
              <Drawer.Screen
                name="(app)"
                options={{
                  drawerLabel: "Ứng dụng",
                  drawerIcon: ({ size, color }) => (
                    <Text style={{ fontSize: size, color }}>📱</Text>
                  ),
                }}
              />
              <Drawer.Screen
                name="(auth)"
                options={{
                  drawerLabel: "Đăng nhập",
                  drawerIcon: ({ size, color }) => (
                    <Text style={{ fontSize: size, color }}>🔑</Text>
                  ),
                }}
              />
              <Drawer.Screen
                name="index"
                options={{ drawerItemStyle: { display: "none" } }}
              />
              <Drawer.Screen
                name="product/[id]"
                options={{ drawerItemStyle: { display: "none" } }}
              />
              <Drawer.Screen
                name="productbycategory/[id]"
                options={{ drawerItemStyle: { display: "none" } }}
              />
            </Drawer> */}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </SliderProvider>
        </FavouriteProvider>
      </ProductProvider>
    </AuthProvider>
  );
}