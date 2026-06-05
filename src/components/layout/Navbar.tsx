'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Institutions', href: '/institutions' },
  { label: 'About',        href: '/about' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border transition-shadow duration-300',
        scrolled && 'shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logos ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 select-none" id="navbar-logo">
            <div className="relative h-11 w-32">
              <Image
                src="/images/ksum-logo.png"
                alt="Kerala Startup Mission"
                fill
                className="object-contain object-left dark:brightness-0 dark:invert"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
            <div className="hidden sm:block w-px bg-border mx-1" style={{ height: 36 }} />
            <div className="hidden sm:block relative" style={{ height: 44, width: 80, position: 'relative' }}>
              <Image
                src="/images/rink-logo.png"
                alt="RINK"
                fill
                className="object-contain object-left dark:brightness-0 dark:invert"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                    pathname === link.href
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-accent hover:bg-card-secondary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="w-px h-6 bg-border" />
            <ThemeToggle />
          </div>

          {/* ── Mobile menu button ── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-text-secondary hover:text-accent hover:bg-card-secondary rounded-lg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-accent hover:bg-card-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
