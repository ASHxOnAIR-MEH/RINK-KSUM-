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
      <div className="w-[68px] h-[34px] bg-[#0A1F3D] rounded-full border border-white/5 opacity-50" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-[68px] h-[34px] p-1 rounded-full cursor-pointer transition-all duration-300 select-none border outline-none"
      style={{
        backgroundColor: theme === 'dark' ? '#0A1F3D' : '#FFFFFF',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
        boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      id="theme-toggle-btn"
    >
      {/* Sliding Circle Indicator */}
      <div
        className="absolute top-[2px] bottom-[2px] w-[28px] h-[28px] rounded-full transition-all duration-300 ease-out shadow-sm"
        style={{
          left: theme === 'dark' ? '3px' : '35px',
          backgroundColor: theme === 'dark' ? '#00FA9A' : '#1C4030',
        }}
      />

      {/* Moon Icon (Dark Mode active indicator) */}
      <span
        className="relative z-10 flex items-center justify-center w-[28px] h-[28px] transition-colors duration-300 select-none pointer-events-none"
      >
        <Moon className="w-4 h-4" style={{ color: theme === 'dark' ? '#04142B' : '#94A3B8' }} />
      </span>

      {/* Sun Icon (Light Mode active indicator) */}
      <span
        className="relative z-10 flex items-center justify-center w-[28px] h-[28px] transition-colors duration-300 select-none pointer-events-none"
      >
        <Sun className="w-4.5 h-4.5" style={{ color: theme === 'light' ? '#FFFFFF' : '#64748B' }} />
      </span>
    </button>
  );
}
