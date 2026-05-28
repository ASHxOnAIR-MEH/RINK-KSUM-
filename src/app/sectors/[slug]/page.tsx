import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSectorBySlug, getTechnologiesBySector, getAllSectors } from '@/lib/db';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { sectors as allSectors } from '@/data/sectors';
import { LayoutGrid } from 'lucide-react';

export async function generateStaticParams() {
  return allSectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return { title: 'Sector Not Found' };
  return {
    title: `${sector.name} Technologies | RINK Technology Explorer`,
    description: sector.description,
  };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sector, techs] = await Promise.all([
    getSectorBySlug(slug),
    getTechnologiesBySector(slug),
  ]);

  if (!sector) notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0F6FF] to-[#EEF5FF] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <Link href="/sectors" className="hover:text-[#003F8A]">Sectors</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{sector.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-3xl shadow-sm">
              {sector.icon}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black text-gray-900">{sector.name}</h1>
              <p className="text-gray-500 text-sm mt-1 max-w-xl">{sector.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {techs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔬</div>
            <h3 className="font-heading font-bold text-gray-900 mb-2">No technologies yet</h3>
            <p className="text-gray-500 text-sm mb-4">Technologies for this sector will be added soon.</p>
            <Link href="/technologies" className="btn-primary text-sm">Browse All Technologies</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-900">{techs.length}</span> {techs.length === 1 ? 'technology' : 'technologies'} in {sector.name}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {techs.map((tech) => (
                <TechnologyCard key={tech.id} technology={tech} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
