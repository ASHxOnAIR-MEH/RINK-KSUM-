import type { Metadata } from 'next';
import { getAllSectors } from '@/lib/db';
import SectorCard from '@/components/ui/SectorCard';
import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Browse by Sector | RINK Technology Explorer',
  description: 'Explore Kerala research technologies by sector — Agriculture, Food Processing, Water Technology, Renewable Energy, Climate Tech, and more.',
};

export default async function SectorsPage() {
  const sectors = await getAllSectors();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0F6FF] to-[#EEF5FF] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Sectors</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#003F8A] flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black text-gray-900 mb-1">Browse by Sector</h1>
              <p className="text-gray-500 text-sm">Find technologies matching your startup domain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
