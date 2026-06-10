import Link from 'next/link';
import { Mail, Phone, Globe, ExternalLink } from 'lucide-react';

function FooterRINKIcon() {
  const size = 40;
  const cx = size / 2, cy = size * 0.60;
  const halfW = size / 2;
  const radiiRatio = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84];
  const sw = size * 0.032;
  const baseW = halfW * 0.38;
  const baseY = cy + halfW * 0.14;
  const baseH = size * 0.028;
  const baseGap = size * 0.038;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {radiiRatio.map((ratio, i) => {
        const rx = halfW * ratio;
        const ry = rx * 0.92;
        return (
          <path key={i}
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
            stroke="#60A5FA" strokeWidth={sw} strokeLinecap="round" fill="none"
          />
        );
      })}
      <ellipse cx={cx} cy={cy} rx={halfW * 0.11} ry={halfW * 0.11} fill="rgba(255,255,255,0.15)" />
      {[0, 1, 2].map((i) => {
        const lineW = baseW * (1 - i * 0.18);
        const y = baseY + i * (baseH + baseGap);
        return <rect key={i} x={cx - lineW / 2} y={y} width={lineW} height={baseH} rx={baseH / 2} fill="#60A5FA" />;
      })}
    </svg>
  );
}

function FooterSkyline() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none select-none z-0 opacity-[0.02]">
      <svg viewBox="0 0 1200 80" fill="currentColor" className="w-full h-full text-white" preserveAspectRatio="none">
        {/* Skyline silhouette (incorporates labs, office/startup structures) */}
        <path d="M0 80 V72 H40 V68 H50 V72 H70 V64 H95 V70 H120 V60 H135 V72 H150 V66 H170 V72 H200 V56 H220 V72 H250 V68 H280 V72 H300 V52 H320 V72 H350 V70 H380 V72 H400 V60 H420 V72 H450 V64 H470 V72 H500 V48 H520 V72 H550 V68 H580 V72 H600 V62 H630 V72 H650 V64 H670 V72 H700 V56 H730 V72 H750 V68 H780 V72 H800 V52 H830 V72 H850 V64 H870 V72 H900 V58 H930 V72 H950 V66 H980 V72 H1000 V44 H1020 V72 H1050 V68 H1080 V72 H1100 V60 H1130 V72 H1150 V64 H1180 V72 H1200 V80 Z" />
        
        {/* Coconut Trees */}
        <path d="M100 72 L102 60 M102 60 C 98 56, 94 58, 90 59 M102 60 C 100 54, 97 54, 95 56 M102 60 C 104 54, 107 54, 109 56 M102 60 C 106 56, 110 58, 114 59" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M280 72 L282 58 M282 58 C 278 54, 274 55, 270 56 M282 58 C 280 52, 277 52, 275 54 M282 58 C 284 52, 287 52, 289 54 M282 58 C 286 54, 290 55, 294 56" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M580 72 L582 60 M582 60 C 578 56, 574 58, 570 59 M582 60 C 580 54, 577 54, 575 56 M582 60 C 584 54, 587 54, 589 56 M582 60 C 586 56, 590 58, 594 59" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M920 72 L922 60 M922 60 C 918 56, 914 58, 910 59 M922 60 C 920 54, 917 54, 915 56 M922 60 C 924 54, 927 54, 929 56 M922 60 C 932 56, 936 58, 940 59" stroke="currentColor" strokeWidth="0.8" fill="none" />

        {/* Research Lab Domes/Flask Icons floating in skyline */}
        <g transform="translate(180, 24)" stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M6 16 L10 8 V4 H14 V8 L18 16 Z M6 13 H18" />
        </g>
        
        {/* Startup Rocket Icon floating in skyline */}
        <g transform="translate(390, 20)" stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M12 2 C12 2, 17 8, 17 14 C17 17, 15 19, 12 19 C9 19, 7 17, 7 14 C7 8, 12 2, 12 2 Z" />
          <path d="M9 19 L7 22 M15 19 L17 22 M12 11 A 2 2 0 1 1 12 15 A 2 2 0 1 1 12 11" />
        </g>

        {/* Technology Transfer Arrows floating in skyline */}
        <g transform="translate(680, 25)" stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M2 8 H22 M16 2 L22 8 L16 14 M8 22 L2 16 L8 10 M2 16 H22" />
        </g>

        {/* Startup Gear Icon floating in skyline */}
        <g transform="translate(860, 22)" stroke="currentColor" strokeWidth="1" fill="none">
          <circle cx="10" cy="10" r="5" />
          <path d="M10 2 V4 M10 16 V18 M2 10 H4 M16 10 H18 M4.3 4.3 L5.8 5.8 M14.2 14.2 L15.7 15.7 M4.3 15.7 L5.8 14.2 M14.2 4.3 L15.7 5.8" />
        </g>

        {/* Innovation network nodes */}
        <circle cx="210" cy="40" r="2.5" />
        <line x1="210" y1="40" x2="200" y2="56" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="510" cy="32" r="3" fill="currentColor" />
        <line x1="510" y1="32" x2="500" y2="48" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="815" cy="36" r="2.5" fill="currentColor" />
        <line x1="815" y1="36" x2="800" y2="52" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E3A8A] text-white mt-auto relative overflow-hidden">
      {/* CTA Strip */}
      <div className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading text-gray-900">
              Discover Technologies. Launch Ventures. Build the Future.
            </h3>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Browse commercializable innovations from Kerala&apos;s leading research institutions.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/technologies" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#2563EB] text-white font-heading font-bold text-sm hover:bg-[#1D4ED8] shadow-sm transition-all duration-200">
              Explore Technologies →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FooterRINKIcon />
              <div>
                <div className="text-xs font-black text-white tracking-wide" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
                  RESEARCH INNOVATION
                </div>
                <div className="text-xs font-black text-white tracking-wide" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
                  NETWORK KERALA
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Research Innovation Network Kerala — connecting research institutions
              with startup founders.
            </p>
            <p className="text-gray-500 text-xs mt-3">
              A Kerala Startup Mission initiative
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Technologies', href: '/technologies' },
                { label: 'Browse by Sector', href: '/sectors' },
                { label: 'Browse by Institution', href: '/institutions' },
                { label: 'About RINK', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutions */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Institutions
            </h4>
            <ul className="space-y-2.5">
              {['CTCRI', 'CPCRI', 'NIIST', 'NCRMI', 'KSCSTE', 'KFRI', 'CWRDM', 'JNTBGRI'].map(
                (inst) => (
                  <li key={inst}>
                    <Link
                      href={`/institutions/${inst.toLowerCase()}`}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {inst}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Contact KSUM
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91-471-2971190</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@startupmission.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <a
                  href="https://startupmission.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1"
                >
                  startupmission.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-gray-400 text-xs leading-relaxed">
                <span className="text-white font-medium">Platform Note:</span> This portal
                lists technologies for discovery. Contact institutions directly for
                technology transfer and licensing.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Kerala Startup Mission. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-xs">RINK Technology Transfer Portal v1.0</span>
            <a
              href="https://startupmission.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Kerala Startup Mission →
            </a>
          </div>
        </div>
        <FooterSkyline />
      </div>
    </footer>
  );
}
