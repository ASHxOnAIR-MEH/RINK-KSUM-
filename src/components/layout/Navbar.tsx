'use client';

import Link from 'next/link';
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

/* ══════════════════════════════════════════════════════════════
   KERALA STARTUP MISSION — Checkered Flag Logo
   Faithful SVG recreation: ascending staircase of blue+white squares
   ══════════════════════════════════════════════════════════════ */
function KSUMLogo({ height = 44 }: { height?: number }) {
  // The KSUM logo is a staircase of squares: 5 columns, ascending left→right
  // col[i] = number of squares in that column, aligned to the bottom baseline
  // Actual logo: col 0=2, col 1=3, col 2=4, col 3=4, col 4=3, col 5=2 (rounded flag)
  // Closer look: it's a parallelogram-ish shape with steps
  // Columns (left→right): heights 2, 3, 4, 4, 3 squares
  const colHeights = [2, 3, 4, 4, 3];
  const maxRows = 4;
  const S = height / (maxRows + 1); // square size derived from height
  const G = S * 0.12;               // gap between squares
  const step = S + G;

  const BLUE_DARK  = '#1890D5'; // main blue
  const BLUE_LIGHT = '#FFFFFF'; // white squares

  const squares: { x: number; y: number; isBlue: boolean }[] = [];

  colHeights.forEach((rows, colIdx) => {
    const startRow = maxRows - rows; // align to bottom
    for (let r = startRow; r < maxRows; r++) {
      const x = colIdx * step;
      const y = r * step;
      // Checkerboard: blue when (col+row) is even
      const isBlue = (colIdx + r) % 2 === 0;
      squares.push({ x, y, isBlue });
    }
  });

  const svgW = colHeights.length * step - G;
  const svgH = maxRows * step - G;
  const scale = height / svgH;

  return (
    <svg
      width={svgW * scale}
      height={height}
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="none"
    >
      {/* Background shape (light blue fill behind non-blue squares) */}
      {squares.map(({ x, y, isBlue }, i) => (
        <rect
          key={i}
          x={x} y={y}
          width={S} height={S}
          rx={S * 0.06}
          fill={isBlue ? BLUE_DARK : '#B8DFF5'}
        />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   RESEARCH INNOVATION NETWORK KERALA — Fingerprint Lightbulb Logo
   Faithful SVG: concentric arcs with gaps, forming a lightbulb silhouette
   ══════════════════════════════════════════════════════════════ */
function RINKLogo({ size = 44 }: { size?: number }) {
  // The RINK logo is concentric semicircular/oval arcs (fingerprint-style)
  // that together form a lightbulb dome. There's a hollow bulb in the center
  // and 3 short horizontal lines at the bottom (the base).
  //
  // The arcs are actually FULL ovals that are clipped to show only the top dome.
  // Center of the bulb cavity sits at approx 60% down from top.
  // Radii: innermost ~8%, outermost ~85% of size/2

  const cx = size / 2;
  const cy = size * 0.60; // center of the lightbulb body

  // Arc radii (in proportion of size/2), from inner to outer
  const radiiRatio = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84];
  const halfW = size / 2;

  // Color: gradient-like, outer arcs lighter, inner slightly darker
  const colors = [
    '#1BACD8', '#1BACD8', '#1BACD8', '#1BACD8',
    '#1EC6E8', '#24D0F0', '#29D8F8', '#2FE0FF',
  ];

  // Stroke width scales with size
  const sw = size * 0.032;

  // Bulb base dimensions
  const baseW  = halfW * 0.38;
  const baseY  = cy + halfW * 0.14;
  const baseH  = size * 0.028;
  const baseGap = size * 0.038;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Concentric arcs - drawn as semicircles (top half only) */}
      {radiiRatio.map((ratio, i) => {
        const rx = halfW * ratio;
        const ry = rx * 0.92; // slightly oval
        // Each arc: from (cx-rx, cy) arc to (cx+rx, cy) going over the top
        return (
          <path
            key={i}
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
            stroke={colors[i]}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}

      {/* Inner white circle (hollow bulb body) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={halfW * 0.11}
        ry={halfW * 0.11}
        fill="white"
      />

      {/* Bulb base — 3 horizontal lines, narrowing downward */}
      {[0, 1, 2].map((i) => {
        const lineW = baseW * (1 - i * 0.18);
        const y = baseY + i * (baseH + baseGap);
        return (
          <rect
            key={`base-${i}`}
            x={cx - lineW / 2}
            y={y}
            width={lineW}
            height={baseH}
            rx={baseH / 2}
            fill="#1BACD8"
          />
        );
      })}
    </svg>
  );
}


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
            {/* ── Combined KSUM + RINK Logo ── */}
            <Link href="/" className="flex items-center gap-0 flex-shrink-0 select-none">

              {/* ── Kerala Startup Mission ── */}
              <div className="flex flex-col items-center gap-0.5">
                <KSUMLogo height={40} />
                <div className="flex flex-col items-center leading-none" style={{ marginTop: '2px' }}>
                  <span style={{
                    color: '#2EAA3F',
                    fontSize: '8.5px',
                    fontWeight: 900,
                    letterSpacing: '0.22em',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    lineHeight: 1,
                  }}>
                    KERALA
                  </span>
                  <span style={{
                    color: '#1A1A2E',
                    fontSize: '8px',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    fontFamily: 'Arial Black, Arial, Helvetica, sans-serif',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}>
                    STARTUP MISSION<sup style={{ fontSize: '5.5px', verticalAlign: 'super' }}>®</sup>
                  </span>
                </div>
              </div>

              {/* ── Vertical Divider ── */}
              <div className="hidden sm:block w-px bg-[#2D2D6B]/30 mx-3" style={{ height: '52px' }} />

              {/* ── RINK Logo ── */}
              <div className="hidden sm:flex items-center gap-2">
                <RINKLogo size={50} />
                <div style={{ lineHeight: 1.1 }}>
                  {['RESEARCH', 'INNOVATION', 'NETWORK KERALA'].map((line) => (
                    <div key={line} style={{
                      color: '#2D2D6B',
                      fontSize: '12.5px',
                      fontWeight: 900,
                      fontFamily: 'Arial Black, Arial, Helvetica, sans-serif',
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap',
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: compact RINK text */}
              <div className="sm:hidden ml-2 flex flex-col">
                <span style={{ color: '#2D2D6B', fontSize: '10px', fontWeight: 900, fontFamily: 'Arial Black, Arial, sans-serif' }}>RINK</span>
                <span style={{ color: '#666', fontSize: '8px' }}>Tech Explorer</span>
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
