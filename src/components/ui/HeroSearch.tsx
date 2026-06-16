'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/technologies?q=${encodeURIComponent(q)}` : '/technologies');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-3xl bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden"
    >
      <span className="pl-4 flex-shrink-0 text-slate-400">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search technologies, sectors, or institutions..."
        aria-label="Search technologies, sectors, or institutions"
        className="w-full py-4 px-4 bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none font-sans text-lg min-w-0"
      />
      <button
        type="submit"
        className="bg-[#F5B400] hover:bg-yellow-500 text-slate-900 px-6 sm:px-8 py-4 font-bold transition-colors flex-shrink-0"
      >
        Search
      </button>
    </form>
  );
}
