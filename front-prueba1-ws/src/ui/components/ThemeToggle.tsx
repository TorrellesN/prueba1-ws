import { useState, useEffect } from 'react';
import { getCurrentTheme, applyTheme, Theme } from './themeUtils';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme());
  
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="btn"
      aria-label="Toggle theme"
    >
      {theme === 'light' && '🌞'} 
      {theme === 'dark' && '🌙'}
      {theme === 'system' && '⚙️'}
      {' '}Theme: {theme}
    </button>
  );
}
