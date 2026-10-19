import { useState } from "react";

const THEME_STORAGE_KEY = "foody-theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // The selected theme still applies to the current page.
    }
    setIsDark(nextIsDark);
  }

  return { isDark, toggleTheme };
}
