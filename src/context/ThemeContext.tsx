import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'twilight';

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceHover: string;
  header: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentFg: string;
  shadow: string;
  shadowHover: string;
  tags: Record<string, { bg: string; text: string }>;
}

const light: ThemeTokens = {
  bg: '#F8FAFC',
  surface: '#ffffff',
  surfaceHover: '#F3F4F6',
  header: '#ffffff',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  accent: '#4F46E5',
  accentFg: '#ffffff',
  shadow: '0 2px 8px rgba(0,0,0,0.05)',
  shadowHover: '0 8px 24px rgba(0,0,0,0.10)',
  tags: {
    Text:       { bg: '#EEF2FF', text: '#4338CA' },
    Speech:     { bg: '#ECFDF5', text: '#065F46' },
    TypeScript: { bg: '#EFF6FF', text: '#1D4ED8' },
    React:      { bg: '#EFF6FF', text: '#1D4ED8' },
    default:    { bg: '#F3F4F6', text: '#374151' },
  },
};

const twilight: ThemeTokens = {
  bg: '#0f0e17',
  surface: '#1a1a2e',
  surfaceHover: '#1f1e38',
  header: '#0d0c16',
  border: '#2d2b55',
  textPrimary: '#fffffe',
  textSecondary: '#a7a9be',
  textMuted: '#5c5e78',
  accent: '#7c6aff',
  accentFg: '#ffffff',
  shadow: '0 2px 8px rgba(0,0,0,0.35)',
  shadowHover: '0 8px 24px rgba(124,106,255,0.18)',
  tags: {
    Text:       { bg: '#1e1b4b', text: '#a5b4fc' },
    Speech:     { bg: '#064e3b', text: '#6ee7b7' },
    TypeScript: { bg: '#1e3a5f', text: '#93c5fd' },
    React:      { bg: '#1e3a5f', text: '#93c5fd' },
    default:    { bg: '#2d2b55', text: '#a7a9be' },
  },
};

const themes = { light, twilight };

interface ThemeContextType {
  theme: Theme;
  tokens: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  tokens: light,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.body.style.backgroundColor = themes[theme].bg;
    document.body.style.color = themes[theme].textPrimary;
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'light' ? 'twilight' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, tokens: themes[theme], toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
