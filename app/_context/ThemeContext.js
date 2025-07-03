import { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();
// define all your colors in one place
const palettes = {
  dark: {
    background: '#121212',
    card:       '#1E1E1E',
    text:       '#FFFFFF',
    subText:    '#AAA',
    border:     '#333',
    accent:     '#3D8BFD',
    navBg:      '#1E1E1E',
    navInactive:'#8A8A8A'
  },
  light: {
    background: '#FFFFFF',
    card:       '#F2F2F2',
    text:       '#000000',
    subText:    '#555555',
    border:     '#CCC',
    accent:     '#3D8BFD',
    navBg:      '#F8F8F8',
    navInactive:'#888888'
  }
};

//default to system or dark
const defaultMode = Appearance.getColorScheme() || 'dark';

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(defaultMode);
  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  //expose both mode and the palette
  return (
    <ThemeContext.Provider value={{ mode, toggleMode, colors: palettes[mode] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};