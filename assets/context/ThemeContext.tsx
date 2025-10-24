import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
  };
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
  colors: {
    background: "#FFF",
    text: "#2D0C57",
    card: "#F5F5F5",
    border: "#E6E6E6",
    primary: "#0BCE83",
  },
});

const THEME_KEY = "@app_theme"; // key for AsyncStorage

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  // Load saved theme or system theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setTheme(storedTheme);
        } else {
          // If nothing is stored, use system preference
          const systemTheme = Appearance.getColorScheme();
          setTheme(systemTheme === "dark" ? "dark" : "light");
        }
      } catch (e) {
        console.log("Failed to load theme from storage", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeType = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.log("Failed to save theme", e);
    }
  };

  const colors =
    theme === "light"
      ? {
          background: "#FFFFFF",
          text: "#2D0C57",
          card: "#F5F5F5",
          border: "#E6E6E6",
          primary: "#0BCE83",
        }
      : {
          background: "#121212",
          text: "#FFFFFF",
          card: "#1E1E1E",
          border: "#333333",
          primary: "#0BCE83",
        };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
