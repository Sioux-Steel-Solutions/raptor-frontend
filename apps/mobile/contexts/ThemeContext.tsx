import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

export const colors = {
  light: {
    background: '#e5e7eb',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#d1d5db',
    accent: '#fad512',
    logo: '#1f2937',
    logoBackground: '#fad512',
  },
  dark: {
    background: '#1a1d29',
    card: '#2d3548',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    border: '#475569',
    accent: '#fad512',
    logo: '#1a1d29',
    logoBackground: '#fad512',
  },
};

interface ThemeContextType {
  theme: Theme;
  colors: typeof colors.dark;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Load saved theme
    AsyncStorage.getItem('theme').then((savedTheme) => {
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value = {
    theme,
    colors: colors[theme],
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
