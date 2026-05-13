import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({});

const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((prev) => !prev), []);

  const value = useMemo(() => ({ dark, toggleTheme }), [dark, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext };
