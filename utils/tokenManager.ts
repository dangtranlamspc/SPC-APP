// Tạo file utils/tokenManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const clearTokens = async (reason: string) => {
  console.log(`🔴 CLEARING TOKENS - Reason: ${reason}`);
  console.trace(); // Hiện call stack
  
  await SecureStore.deleteItemAsync('token').catch(() => {});
  await AsyncStorage.removeItem('token').catch(() => {});
  await AsyncStorage.removeItem('user').catch(() => {});
};

export const getToken = async () => {
  let token = await AsyncStorage.getItem("token");
  if (!token) {
    try {
      token = await SecureStore.getItemAsync("token");
    } catch (error) {
      console.log("SecureStore error:", error);
    }
  }
  
  console.log(`🔍 Token retrieved: ${token ? 'EXISTS' : 'NULL'}`);
  return token;
};