import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import { darkTheme } from "@styles/themes/dark-theme";

const COLOR_MODE_KEY = "color-mode";

type ColorMode = "light" | "dark";
type ThemeContextValue = {
  colorMode: ColorMode;
  setColorMode: (newValue: ColorMode) => void;
};

const getInitialColorMode = (): ColorMode => {
  const persistedColorPreference = window.localStorage.getItem(COLOR_MODE_KEY);

  const hasPersistedPreference = typeof persistedColorPreference === "string";

  if (hasPersistedPreference) {
    return persistedColorPreference as ColorMode;
  } else {
    let newColorMode: ColorMode = "dark";

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasMediaQueryPreference = typeof mql.matches === "boolean";
    if (hasMediaQueryPreference) {
      newColorMode = mql.matches ? "dark" : "light";
    }

    window.localStorage.setItem(COLOR_MODE_KEY, newColorMode);
    return newColorMode;
  }
};

const themes = {
  light: "light-theme",
  dark: darkTheme.className,
};

export const ThemeContext = createContext<ThemeContextValue>({
  colorMode: "light",
  setColorMode: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [colorMode, rawSetColorMode] = useState<ColorMode>("light");

  const setColorMode = useCallback((newValue: ColorMode) => {
    const prevValue: ColorMode = newValue === "dark" ? "light" : "dark";

    document.documentElement.classList.remove(themes[prevValue]);
    document.documentElement.classList.add(themes[newValue]);
    localStorage.setItem(COLOR_MODE_KEY, newValue);
    document.documentElement.style.setProperty("color-scheme", newValue);
    rawSetColorMode(newValue);

    if (document !== null) {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", newValue === "dark" ? "#191F2C" : "#ffffff");
    }
  }, []);

  useEffect(() => {
    const initialColorMode = getInitialColorMode();
    const prevValue: ColorMode = initialColorMode === "dark" ? "light" : "dark";
    document.documentElement.classList.remove(themes[prevValue]);
    document.documentElement.classList.add(themes[initialColorMode]);
    document.documentElement.style.setProperty(
      "color-scheme",
      initialColorMode
    );
    rawSetColorMode(initialColorMode);
    if (document !== null) {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          initialColorMode === "dark" ? "#191F2C" : "#ffffff"
        );
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    if (mql) {
      mql.addEventListener?.("change", (e) => {
        const newColorScheme = e.matches ? "dark" : "light";
        setColorMode(newColorScheme);
      });
    }
  }, []);

  const contextValue: ThemeContextValue = React.useMemo(() => {
    return {
      colorMode,
      setColorMode,
    };
  }, [colorMode, setColorMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return { colorMode, setColorMode, toggleTheme };
};
