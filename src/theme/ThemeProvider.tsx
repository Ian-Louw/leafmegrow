// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme/colors';

type Preference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  preference: Preference;
  setPreference: (pref: Preference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'theme-preference';

function resolveTheme(pref: Preference, systemScheme: ColorSchemeName): Theme {
  const scheme: 'light' | 'dark' =
    pref === 'system'
      ? (systemScheme ?? 'light')
      : pref;

  return scheme === 'dark' ? darkTheme : lightTheme;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPrefState] = useState<Preference>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Load saved preference
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPrefState(stored);
        }
      } catch {}
    })();
  }, []);

  // Listen for system scheme updates
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const theme = useMemo(() => resolveTheme(preference, systemScheme), [preference, systemScheme]);

  const setPreference = async (pref: Preference) => {
    setPrefState(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch {}
  };

  const value = useMemo(() => ({ theme, preference, setPreference }), [theme, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
