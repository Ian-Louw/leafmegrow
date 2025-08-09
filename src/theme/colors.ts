// Plant App color system
// --------------------------------------------------
// Palette is derived from your provided images.

export const palette = {
  forest: '#0F2A1D', // darkest
  moss:   '#375534',
  sage:   '#6B9071',
  mint:   '#AEC3B0',
  aloe:   '#E3EED4', // lightest
  // neutrals you might still want around the greens
  white:  '#FFFFFF',
  black:  '#000000',
};

// Utility to add alpha to a hex color (#RRGGBB)
export const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

// Semantic tokens (shared names your UI uses)
export type Theme = {
  name: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    primary: string;
    onPrimary: string;
    secondary: string;
    accent: string;

    text: string;
    textSecondary: string;
    muted: string;
    border: string;

    // feedback (kept within green family where possible)
    success: string;
    warning: string;
    error: string;

    // overlays
    overlay: string;         // scrim
    shadow: string;          // shadow color
    focus: string;           // focus ring / outline
  };
};

// Light theme — airy and planty 🌿
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: palette.aloe,        // #E3EED4
    surface: palette.white,          // cards / sheets
    surfaceAlt: palette.mint,

    primary: palette.moss,           // buttons / CTAs
    onPrimary: palette.aloe,         // text/icon on primary

    secondary: palette.sage,         // chips, secondary buttons
    accent: palette.forest,          // small highlights

    text: palette.forest,
    textSecondary: palette.moss,
    muted: palette.mint,
    border: withAlpha(palette.moss, 0.25),

    success: palette.sage,
    warning: '#E1B900',              // neutral warm accent (accessible)
    error: '#D23C3C',                // red for errors (kept minimal)

    overlay: withAlpha(palette.forest, 0.45),
    shadow: withAlpha('#000000', 0.15),
    focus: withAlpha(palette.moss, 0.5),
  },
};

// Dark theme — deeper greens with soft contrast 🌑
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: palette.forest,      // #0F2A1D
    surface: palette.moss,           // sheets/cards
    surfaceAlt: withAlpha(palette.moss, 0.85),

    primary: palette.sage,           // CTAs pop in dark
    onPrimary: palette.forest,       // text/icon on primary

    secondary: palette.mint,
    accent: palette.aloe,

    text: palette.aloe,
    textSecondary: palette.mint,
    muted: withAlpha(palette.mint, 0.6),
    border: withAlpha(palette.aloe, 0.18),

    success: palette.sage,
    warning: '#EAC444',
    error: '#FF6B6B',

    overlay: withAlpha('#000000', 0.5),
    shadow: withAlpha('#000000', 0.6),
    focus: withAlpha(palette.aloe, 0.55),
  },
};

// Simple helper to pick a theme by mode string
export const getTheme = (mode: 'light' | 'dark'): Theme =>
  mode === 'dark' ? darkTheme : lightTheme;
