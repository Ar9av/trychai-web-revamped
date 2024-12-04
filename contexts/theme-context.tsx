"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ThemeContextType {
  currentTheme: string | undefined;
  backgroundColor: string;
  waveColors: string[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'light',
  backgroundColor: 'white',
  waveColors: [],
});

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>('dark');

  const [backgroundColor, setBackgroundColor] = useState('white');
  
  const lightWaveColors = [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const darkWaveColors = [
    "#0284c7",
    "#4f46e5",
    "#7e22ce",
    "#a21caf",
    "#0891b2",
  ];

  const [waveColors, setWaveColors] = useState(lightWaveColors);

  useEffect(() => {
    setCurrentTheme(theme);
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setBackgroundColor(prefersDark ? 'black' : 'white');
      setWaveColors(prefersDark ? darkWaveColors : lightWaveColors);
    } else {
      setBackgroundColor(theme === 'dark' ? 'black' : 'white');
      setWaveColors(theme === 'dark' ? darkWaveColors : lightWaveColors);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, backgroundColor, waveColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext); 