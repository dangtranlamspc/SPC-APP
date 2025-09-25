// contexts/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface Colors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  drawerBackground: string;
  drawerSurface: string;
  drawerText: string;
  drawerTextSecondary: string;
  drawerActiveBackground: string;
  drawerActiveTint: string;
  drawerInactiveTint: string;
  headerBackground: string;
  headerText: string;
  buttonBackground: string;
  buttonText: string;
  avatarBackground: string;
}

export const lightTheme: Colors = {
  primary: '#2563eb',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  card: '#ffffff',
  notification: '#ff4444',
  error: '#ff4444',
  success: '#4caf50',
  warning: '#ff9800',
  drawerBackground: '#ffffff',
  drawerSurface: '#2563eb',
  drawerText: '#ffffff',
  drawerTextSecondary: '#e1bee7',
  drawerActiveBackground: '#e3f2fd',
  drawerActiveTint: '#2563eb',
  drawerInactiveTint: '#666666',
  headerBackground: '#2563eb',
  headerText: '#ffffff',
  buttonBackground: '#ffffff',
  buttonText: '#2563eb',
  avatarBackground: '#2563eb',
};

export const darkTheme: Colors = {
  primary: '#3b82f6',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#2d2d2d',
  card: '#1e1e1e',
  notification: '#ff6b6b',
  error: '#ff6b6b',
  success: '#69db7c',
  warning: '#ffd43b',
  drawerBackground: '#1e1e1e',
  drawerSurface: '#2d2d2d',
  drawerText: '#ffffff',
  drawerTextSecondary: '#b3b3b3',
  drawerActiveBackground: '#1e3a8a',
  drawerActiveTint: '#3b82f6',
  drawerInactiveTint: '#9ca3af',
  headerBackground: '#1e1e1e',
  headerText: '#ffffff',
  buttonBackground: '#2d2d2d',
  buttonText: '#3b82f6',
  avatarBackground: '#3b82f6',
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Colors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadThemeMode();
    
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => listener?.remove();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('themeMode') as ThemeMode;
      if (savedThemeMode) {
        setThemeModeState(savedThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      isDark,
      setThemeMode,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};