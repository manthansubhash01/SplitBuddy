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

// Color schemes
const lightTheme = {
    // Background colors
    background: "#F8F9FA",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    // Text colors
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",

    // Primary colors
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    primaryLight: "#60A5FA",

    // Border colors
    border: "#E5E7EB",
    borderLight: "#F3F4F6",

    // Status colors
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",

    // Input colors
    inputBackground: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#1F2937",
    placeholder: "#9CA3AF",

    // Button colors
    buttonPrimary: "#3B82F6",
    buttonSecondary: "#F3F4F6",
    buttonText: "#FFFFFF",
    buttonTextSecondary: "#6B7280",

    // Shadow
    shadow: "#000000",

    // Special
    overlay: "rgba(0, 0, 0, 0.5)",
    divider: "#E5E7EB",
};

const darkTheme = {
    // Background colors
    background: "#0F172A",
    surface: "#1E293B",
    card: "#1E293B",

    // Text colors
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",

    // Primary colors
    primary: "#4F46E5",
    primaryDark: "#4338CA",
    primaryLight: "#6366F1",

    // Border colors
    border: "#334155",
    borderLight: "#475569",

    // Status colors
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",

    // Input colors
    inputBackground: "#0F172A",
    inputBorder: "#334155",
    inputText: "#FFFFFF",
    placeholder: "#64748B",

    // Button colors
    buttonPrimary: "#4F46E5",
    buttonSecondary: "#334155",
    buttonText: "#FFFFFF",
    buttonTextSecondary: "#E2E8F0",

    // Shadow
    shadow: "#000000",

    // Special
    overlay: "rgba(0, 0, 0, 0.7)",
    divider: "#334155",
};

const THEME_STORAGE_KEY = "@splitbuddy_theme";

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState("system"); // 'light', 'dark', 'system'
    const [isDark, setIsDark] = useState(systemColorScheme === "dark");

    // Load saved theme preference
    useEffect(() => {
        loadThemePreference();
    }, []);

    // Update theme when system theme changes
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
            console.error("Error loading theme preference:", error);
        }
    };

    const saveThemePreference = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error("Error saving theme preference:", error);
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
