import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TempUnit = 'C' | 'F';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  toggleTempUnit: () => void;
  convertTemp: (celsius: number) => number;
  formatTemp: (celsius: number, decimals?: number) => string;
  tempSymbol: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [tempUnit, setTempUnitState] = useState<TempUnit>(() => {
    const saved = localStorage.getItem('tempUnit');
    return saved === 'F' ? 'F' : 'C';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const setTempUnit = (unit: TempUnit) => {
    setTempUnitState(unit);
    localStorage.setItem('tempUnit', unit);
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'C' ? 'F' : 'C');
  };

  const convertTemp = (celsius: number): number => {
    if (isNaN(celsius) || celsius === null || celsius === undefined) return 0;
    if (tempUnit === 'F') {
      return (celsius * 1.8) + 32;
    }
    return celsius;
  };

  const formatTemp = (celsius: number, decimals: number = 1): string => {
    if (isNaN(celsius) || celsius === null || celsius === undefined) return `0.0 °${tempUnit}`;
    const converted = convertTemp(celsius);
    return `${converted.toFixed(decimals)} °${tempUnit}`;
  };

  const tempSymbol = `°${tempUnit}`;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        tempUnit,
        setTempUnit,
        toggleTempUnit,
        convertTemp,
        formatTemp,
        tempSymbol,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
