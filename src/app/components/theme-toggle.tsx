'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-lg" />;
  }

  // Light theme colors from design system
  const lightThemeColors = {
    buttonBg: 'rgba(75, 101, 84, 0.08)', // primary with 8% opacity
    buttonColor: '#4b6554', // primary
    hoverGradient: 'radial-gradient(circle, rgba(75, 101, 84, 0.12) 0%, rgba(75, 101, 84, 0) 70%)',
  };

  // Dark theme colors
  const darkThemeColors = {
    buttonBg: 'rgba(149, 212, 179, 0.08)',
    buttonColor: '#95d4b3',
    hoverGradient: 'radial-gradient(circle, rgba(149, 212, 179, 0.15) 0%, rgba(149, 212, 179, 0) 70%)',
  };

  const colors = isDarkMode ? darkThemeColors : lightThemeColors;

  return (
    <button
      onClick={onToggle}
      className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group"
      style={{
        background: colors.buttonBg,
        color: colors.buttonColor,
      }}
      title="Toggle Theme"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Icon container with smooth fade transition */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
        {isDarkMode ? (
          <Moon
            size={18}
            className="animate-fadeIn transition-all duration-300"
            style={{ opacity: 1 }}
          />
        ) : (
          <Sun
            size={18}
            className="animate-fadeIn transition-all duration-300"
            style={{ opacity: 1 }}
          />
        )}
      </div>

      {/* Hover effect overlay with smooth transition */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: colors.hoverGradient,
        }}
      />
    </button>
  );
}
