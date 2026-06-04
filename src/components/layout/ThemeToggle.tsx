'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light');
      localStorage.setItem('rink-theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('rink-theme', 'dark');
      setTheme('dark');
    }
  };

  if (!mounted) {
    // Return dummy pill matching size to avoid SSR layout shift
    return (
      <div className="w-[110px] h-[34px] bg-[#0c1527] rounded-full border border-white/5 opacity-50" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-[110px] h-[34px] p-1 rounded-full cursor-pointer transition-all duration-300 select-none border outline-none"
      style={{
        backgroundColor: theme === 'dark' ? '#0d172a' : '#FFFFFF',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
        boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      id="theme-toggle-btn"
    >
      {/* Sliding Pill Indicator */}
      <div
        className="absolute top-1 bottom-1 w-[46px] rounded-full transition-all duration-300 ease-out shadow-sm"
        style={{
          left: theme === 'dark' ? '4px' : '56px',
          backgroundColor: theme === 'dark' ? '#003F8A' : '#E2E8F0',
        }}
      />

      {/* Dark Text/Icon */}
      <span
        className="relative z-10 flex items-center gap-1 pl-2 text-[11px] font-bold transition-colors duration-300 select-none pointer-events-none"
        style={{ color: theme === 'dark' ? '#FFFFFF' : '#94A3B8' }}
      >
        <Moon className="w-3 h-3 flex-shrink-0" />
        Dark
      </span>

      {/* Light Text/Icon */}
      <span
        className="relative z-10 flex items-center gap-1 pr-2 text-[11px] font-bold transition-colors duration-300 select-none pointer-events-none"
        style={{ color: theme === 'light' ? '#0F172A' : '#64748B' }}
      >
        Light
        <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
      </span>
    </button>
  );
}
