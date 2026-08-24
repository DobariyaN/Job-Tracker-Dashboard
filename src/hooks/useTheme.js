import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('trackline-theme');
    if (stored) return stored;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('trackline-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
