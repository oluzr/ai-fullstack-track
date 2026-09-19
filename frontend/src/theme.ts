export type ThemeColors = {
  background: string
  text: string
  surface: string
  border: string
  borderLight: string
  muted: string
  mutedStrong: string
  primary: string
  primaryText: string
  secondary: string
  secondaryText: string
  error: string
  highlight: string
  overlay: string
}

export type AppTheme = {
  name: 'light' | 'dark'
  colors: ThemeColors
}

export const lightTheme: AppTheme = {
  name: 'light',
  colors: {
    background: '#f7f7f8',
    text: '#1a1a1a',
    surface: '#ffffff',
    border: '#dddddd',
    borderLight: '#eeeeee',
    muted: '#888888',
    mutedStrong: '#666666',
    primary: '#3a3aff',
    primaryText: '#ffffff',
    secondary: '#e5e5ea',
    secondaryText: '#1a1a1a',
    error: '#c0392b',
    highlight: '#f5f5ff',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
}

export const darkTheme: AppTheme = {
  name: 'dark',
  colors: {
    background: '#17171b',
    text: '#e8e8ea',
    surface: '#232329',
    border: '#3a3a42',
    borderLight: '#2e2e35',
    muted: '#9a9aa2',
    mutedStrong: '#b7b7bf',
    primary: '#7676ff',
    primaryText: '#ffffff',
    secondary: '#3a3a42',
    secondaryText: '#e8e8ea',
    error: '#ff6b5b',
    highlight: '#272740',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
}
