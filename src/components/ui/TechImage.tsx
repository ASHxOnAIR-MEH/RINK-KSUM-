'use client';

import { useState } from 'react';
import { Microscope } from 'lucide-react';

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

/**
 * Technology image with inline fallback.
 * Shows a professional placeholder if the URL is missing or fails to load.
 */
export default function TechImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F8FAFF] ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Microscope className="w-8 h-8 text-blue-300" />
        </div>
        <span className="text-sm text-gray-400 font-medium text-center px-4">
          Technology Image Will Be Updated
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
    />
  );
}
