'use client';

import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

// Fallback placeholder when Drive image fails
function Placeholder({ alt }: { alt: string }) {
  const initials = alt.slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-12 h-12 rounded-xl bg-[#003F8A]/10 flex items-center justify-center mb-2">
        <FlaskConical className="w-6 h-6 text-[#003F8A]/40" />
      </div>
      <span className="text-xs text-gray-400 font-medium px-4 text-center leading-tight">
        {alt.length > 30 ? alt.slice(0, 30) + '…' : alt}
      </span>
    </div>
  );
}

export default function TechImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return <Placeholder alt={alt} />;
  }

  return (
    <>
      {!loaded && <Placeholder alt={alt} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0 absolute'} transition-opacity duration-300`}
        style={loaded ? {} : { position: 'absolute', width: 0, height: 0 }}
        referrerPolicy="no-referrer"
      />
    </>
  );
}
