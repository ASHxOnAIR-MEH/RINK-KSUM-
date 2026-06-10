'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Home, Building2, Info, X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'Home',         href: '/',             icon: Home },
  { label: 'Institutions', href: '/institutions',  icon: Building2 },
  { label: 'About',        href: '/about',         icon: Info },
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

  // Close mobile dropdown on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ── TOP NAVIGATION BAR ── */}
      <nav
        className={clsx(
          'sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300',
          scrolled && 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 select-none" id="navbar-logo">
              <div className="relative h-9 w-24">
                <Image
                  src="/images/ksum-logo.png"
                  alt="Kerala Startup Mission"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-black text-gray-900 tracking-wider uppercase leading-tight font-heading">
                  RINK Technology Transfer Portal
                </span>
                <span className="hidden sm:block text-[8px] font-semibold text-gray-500 tracking-widest uppercase leading-none mt-0.5">
                  Research Innovation Network Kerala
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 font-sans',
                      pathname === link.href
                        ? 'text-[#2563EB] bg-blue-50'
                        : 'text-gray-600 hover:text-[#2563EB] hover:bg-blue-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/technologies"
                className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors duration-150 font-heading"
              >
                Browse Technologies
              </Link>
            </div>

            {/* ── Mobile hamburger (only above sm breakpoint for dropdown use) ── */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/technologies"
                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors font-heading"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(17,24,39,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 gap-1 py-2 min-h-[56px] transition-all duration-200 select-none',
                  isActive
                    ? 'text-[#2563EB]'
                    : 'text-gray-500 hover:text-[#2563EB]'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 transition-all duration-200',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className={clsx(
                  'text-[10px] font-semibold tracking-wide transition-colors',
                  isActive ? 'text-[#2563EB]' : 'text-gray-500'
                )}>
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 h-0.5 w-12 bg-[#2563EB] rounded-b-full" />
                )}
              </Link>
            );
          })}

          {/* Technologies shortcut */}
          <Link
            href="/technologies"
            aria-label="Browse Technologies"
            className={clsx(
              'flex flex-col items-center justify-center flex-1 gap-1 py-2 min-h-[56px] transition-all duration-200 select-none relative',
              pathname.startsWith('/technologies')
                ? 'text-[#2563EB]'
                : 'text-gray-500 hover:text-[#2563EB]'
            )}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={pathname.startsWith('/technologies') ? 2.2 : 1.8}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 13h6M9 17h4" />
            </svg>
            <span className={clsx(
              'text-[10px] font-semibold tracking-wide',
              pathname.startsWith('/technologies') ? 'text-[#2563EB]' : 'text-gray-500'
            )}>
              Technologies
            </span>
            {pathname.startsWith('/technologies') && (
              <span className="absolute top-0 h-0.5 w-12 bg-[#2563EB] rounded-b-full" />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
