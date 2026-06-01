'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Technologies',
    href: '/technologies',
    children: [
      { label: 'All Technologies', href: '/technologies' },
      { label: 'Browse by Sector', href: '/sectors' },
      { label: 'Browse by Institution', href: '/institutions' },
    ],
  },
  { label: 'Startup Discovery', href: '/startup-discovery' },
  { label: 'About', href: '/about' },
];

/* Logos loaded from /public/images/ */



export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/technologies?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={clsx(
          'navbar transition-shadow duration-300',
          scrolled && 'shadow-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* ── Official Logos ── */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 select-none" id="navbar-logo">
              {/* Kerala Startup Mission Logo — mix-blend-mode removes white bg */}
              <div className="relative h-11 w-32">
                <Image
                  src="/images/ksum-logo.png"
                  alt="Kerala Startup Mission"
                  fill
                  className="object-contain object-left"
                  style={{ mixBlendMode: 'multiply' }}
                  priority
                />
              </div>
              {/* Divider */}
              <div className="hidden sm:block w-px bg-gray-300 mx-1" style={{ height: '40px' }} />
              {/* RINK Logo */}
              <div className="hidden sm:relative sm:block" style={{ position: 'relative', height: '44px', width: '80px' }}>
                <Image
                  src="/images/rink-logo.png"
                  alt="RINK — Research Innovation Network Kerala"
                  fill
                  className="object-contain object-left"
                  style={{ mixBlendMode: 'multiply' }}
                  priority
                />
              </div>
              {/* Mobile: RINK icon only */}
              <div className="sm:hidden relative" style={{ width: '32px', height: '32px' }}>
                <Image src="/images/rink-logo.png" alt="RINK" fill className="object-contain" style={{ mixBlendMode: 'multiply' }} />
              </div>
            </Link>


            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#003F8A] rounded-lg hover:bg-blue-50 transition-all duration-150">
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#003F8A] hover:bg-blue-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#003F8A] rounded-lg hover:bg-blue-50 transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-[#003F8A] hover:bg-blue-50 rounded-lg transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/technologies"
                className="hidden md:flex btn-primary text-sm"
              >
                Explore Technologies
              </Link>
              <button
                className="md:hidden p-2 text-gray-600 hover:text-[#003F8A] hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technologies, sectors, problems, applications..."
                  className="search-input"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-xs">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#003F8A] hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block pl-6 pr-3 py-2 text-sm text-gray-500 hover:text-[#003F8A] hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                href="/technologies"
                className="block btn-primary text-sm text-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Explore Technologies
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
