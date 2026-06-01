import { getSectorBySlug, getTechnologiesBySector, getAllSectors } from '@/lib/db';
import { notFound } from 'next/navigation';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sectors = await getAllSectors();
  return sectors.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return { title: 'Sector Not Found — RINK' };
  return {
    title: `${sector.name} Technologies — RINK Explorer`,
    description: `Browse ${sector.tech_count} commercializable technologies in ${sector.name} from Kerala research institutions.`,
  };
}

export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params;
  const [sector, technologies] = await Promise.all([
    getSectorBySlug(slug),
    getTechnologiesBySector(slug),
  ]);

  if (!sector) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/sectors" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#003F8A] transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            All Sectors
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${sector.color}15` }}
            >
              {sector.icon}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">{sector.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {sector.tech_count} {sector.tech_count === 1 ? 'technology' : 'technologies'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {technologies.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No technologies found for this sector yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {technologies.map(tech => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
