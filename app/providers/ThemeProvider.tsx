/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // ==========================================================
  // DEFAULT THEME
  // ==========================================================

  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // ==========================================================
  // APPLY THEME TO HTML
  // ==========================================================

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.setAttribute("data-theme", newTheme);
  };

  // ==========================================================
  // LOAD SAVED GLOBAL THEME
  // ==========================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    setMounted(true);
  }, []);

  // ==========================================================
  // SET GLOBAL THEME
  // ==========================================================

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Save globally
    localStorage.setItem("theme", newTheme);

    // Apply globally
    applyTheme(newTheme);
  };

  // ==========================================================
  // TOGGLE GLOBAL THEME
  // ==========================================================

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mounted,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ==========================================================
// USE THEME
// ==========================================================

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
