import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize with system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Create media query for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Handler for system theme changes
    const handleThemeChange = (e) => {
      setIsDark(e.matches);
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Initial theme setup
    setIsDark(mediaQuery.matches);
    document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Update theme when isDark changes
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;