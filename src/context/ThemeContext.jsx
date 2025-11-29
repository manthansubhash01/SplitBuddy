import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

import { lightTheme, darkTheme } from "../styles/theme";

const THEME_STORAGE_KEY = "@splitbuddy_theme";

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system"); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference().catch(() => {
      // Ignore errors and use system default
    });
  }, []); // Update theme when system theme changes
  useEffect(() => {
    if (themeMode === "system") {
      setIsDark(systemColorScheme === "dark");
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeMode(savedTheme);
        if (savedTheme === "dark") {
          setIsDark(true);
        } else if (savedTheme === "light") {
          setIsDark(false);
        } else {
          setIsDark(systemColorScheme === "dark");
        }
      }
    } catch (error) {
      // Silently fail - theme will use system default
      console.log("Theme storage not available, using system default");
    }
  };

  const saveThemePreference = async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      // Silently fail - theme change will still work in current session
      console.log("Theme storage not available");
    }
  };

  const setTheme = (mode) => {
    setThemeMode(mode);
    saveThemePreference(mode);

    if (mode === "dark") {
      setIsDark(true);
    } else if (mode === "light") {
      setIsDark(false);
    } else {
      setIsDark(systemColorScheme === "dark");
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    setTheme(newMode);
  };

  const colors = isDark ? darkTheme : lightTheme;

  const value = {
    colors,
    isDark,
    themeMode,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
