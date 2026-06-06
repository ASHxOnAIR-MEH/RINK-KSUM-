import { getAllSectors, getPlatformStats } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Browse by Sector — RINK Technology Transfer Portal',
  description: 'Explore technologies by sector. Find commercializable technologies across Agriculture, Food Processing, Biotechnology, Aquaculture, and more.',
};

export default async function SectorsPage() {
  const [sectors, stats] = await Promise.all([getAllSectors(), getPlatformStats()]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-secondary transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-heading font-bold text-heading">Browse by Sector</h1>
          <p className="text-text-secondary text-sm mt-1">
            {stats.sector_count} sectors · {stats.technology_count}+ technologies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sectors.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
