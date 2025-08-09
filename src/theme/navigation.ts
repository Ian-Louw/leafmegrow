// src/theme/navigation.ts
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import type { Theme as AppTheme } from '../theme/colors';

export function toNavigationTheme(appTheme: AppTheme): NavigationTheme {
  const base = appTheme.name === 'dark'
    ? NavigationDarkTheme
    : NavigationDefaultTheme;

  // Spread `base` to keep `fonts` (and any future fields) intact
  return {
    ...base,
    dark: appTheme.name === 'dark',
    colors: {
      ...base.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.primary,
    },
  };
}
