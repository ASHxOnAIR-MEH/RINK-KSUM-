import { getSectorBySlug, getTechnologiesBySector, getAllSectors } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SectorFilterView from './SectorFilterView';
import { getSectorIcon } from '@/components/ui/SectorIcons';
import SectorBackground from '@/components/ui/SectorBackgrounds';

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
  
  const metaDescription = `Browse ${sector.tech_count} commercializable technologies in ${sector.name}. Discover research breakthroughs from Kerala institutions ready for industry deployment.`;
  
  return {
    title: `${sector.name} Innovation & Technologies | RINK Kerala`,
    description: metaDescription,
    openGraph: {
      title: `${sector.name} Innovation & Technologies | RINK Kerala`,
      description: metaDescription,
      type: 'website',
    },
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-card border-b border-border overflow-hidden">
        {/* Dynamic Vector Background */}
        <SectorBackground slug={sector.slug} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/sectors" className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Sectors
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: `${sector.color}15` }}
            >
              {getSectorIcon(sector.slug, 'var(--accent)', 24)}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-heading font-bold text-heading">{sector.name}</h1>
              <p className="text-xs text-text-secondary mt-0.5">
                {sector.tech_count} {sector.tech_count === 1 ? 'technology' : 'technologies'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <SectorFilterView initialTechnologies={technologies} />
      </div>
    </div>
  );
}
