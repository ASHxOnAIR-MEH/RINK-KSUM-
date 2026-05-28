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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white mt-auto">
      {/* CTA Strip */}
      <div className="bg-[#003F8A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              Ready to Build a Startup from Research?
            </h3>
            <p className="text-blue-200 text-sm mt-1">
              Browse 150+ technologies from Kerala's leading research institutions.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/startup-discovery" className="btn-green text-sm">
              Start Exploring
            </Link>
            <Link href="/technologies" className="btn-secondary text-sm border-white text-white hover:bg-white/10">
              All Technologies
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
                { label: 'Startup Discovery', href: '/startup-discovery' },
                { label: 'About RINK', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
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
            <span className="text-gray-500 text-xs">RINK Technology Explorer v1.0</span>
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
      </div>
    </footer>
  );
}
