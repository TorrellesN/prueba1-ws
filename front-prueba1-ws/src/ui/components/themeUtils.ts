export type Theme = 'light' | 'dark' | 'system';

export function getCurrentTheme(): Theme {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // Si no hay nada en ls, se devuelve el tema del sistema
  return 'system';
}

// Apply theme to document
export function applyTheme(theme: Theme): void {
  // Remove existing theme classes
  document.documentElement.classList.remove('light-theme', 'dark-theme');
  
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }
  // For 'system', we rely on the media query in CSS
  
  // Save theme preference
  localStorage.setItem('theme', theme);
}

// Initialize theme
export function initTheme(): void {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
}
