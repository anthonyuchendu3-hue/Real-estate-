import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // When in dark mode, show Sun icon (click to switch to light)
        <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
      ) : (
        // When in light mode, show Moon icon (click to switch to dark)
        <Moon className="w-5 h-5 text-gray-600 hover:text-primary-600 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;