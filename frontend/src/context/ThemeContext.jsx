import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const ThemeContext = createContext();

// Predefined color schemes - All Pink Themed
export const colorSchemes = {
  default: {
    name: "Soft Rose",
    primary: "#E91E63", // Pink
    secondary: "#F8BBD9", // Light Pink
    accent: "#880E4F", // Dark Pink
    background: "#FDF2F8", // Pink tinted white
  },
  blush: {
    name: "Blush",
    primary: "#EC407A",
    secondary: "#F48FB1",
    accent: "#AD1457",
    background: "#FCE4EC",
  },
  coral: {
    name: "Coral Pink",
    primary: "#FF6B6B",
    secondary: "#FFA8A8",
    accent: "#C92A2A",
    background: "#FFF5F5",
  },
  hotPink: {
    name: "Hot Pink",
    primary: "#FF1493",
    secondary: "#FF69B4",
    accent: "#C71585",
    background: "#FFF0F5",
  },
  dustyRose: {
    name: "Dusty Rose",
    primary: "#D4A5A5",
    secondary: "#E8C4C4",
    accent: "#8B6969",
    background: "#FAF0F0",
  },
  mauve: {
    name: "Mauve",
    primary: "#C27BA0",
    secondary: "#E1BEE7",
    accent: "#7B1FA2",
    background: "#F3E5F5",
  },
  salmon: {
    name: "Salmon",
    primary: "#FA8072",
    secondary: "#FFC0CB",
    accent: "#CD5C5C",
    background: "#FFF0EE",
  },
  custom: {
    name: "Custom",
    primary: "#E91E63",
    secondary: "#F8BBD9",
    accent: "#880E4F",
    background: "#FDF2F8",
  },
};

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState("default");
  const [customColors, setCustomColors] = useState(colorSchemes.custom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    applyTheme();
  }, [colorScheme, customColors]);

  const fetchTheme = async () => {
    try {
      const config = await api.get("/config");
      if (config.COLOR_SCHEME) {
        setColorScheme(config.COLOR_SCHEME);
      }
      if (config.CUSTOM_COLORS) {
        setCustomColors((prev) => ({ ...prev, ...config.CUSTOM_COLORS }));
      }
    } catch (error) {
      console.error("Failed to fetch theme:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = () => {
    const colors =
      colorScheme === "custom"
        ? customColors
        : colorSchemes[colorScheme] || colorSchemes.default;

    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-background", colors.background);

    // Generate lighter/darker variants
    root.style.setProperty(
      "--color-primary-light",
      adjustColor(colors.primary, 40)
    );
    root.style.setProperty(
      "--color-primary-dark",
      adjustColor(colors.primary, -20)
    );
    root.style.setProperty(
      "--color-secondary-light",
      adjustColor(colors.secondary, 40)
    );
    root.style.setProperty(
      "--color-secondary-dark",
      adjustColor(colors.secondary, -20)
    );
  };

  const updateTheme = async (scheme, custom = null) => {
    setColorScheme(scheme);
    if (custom) {
      setCustomColors((prev) => ({ ...prev, ...custom }));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        customColors,
        updateTheme,
        colorSchemes,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper function to lighten/darken colors
function adjustColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
