import { getInstitutionBySlug, getTechnologiesByInstitution, getAllInstitutions } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import InstitutionFilterView from './InstitutionFilterView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const institutions = await getAllInstitutions();
  return institutions.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const inst = await getInstitutionBySlug(slug);
  if (!inst) return { title: 'Institution Not Found — RINK' };
  return {
    title: `${inst.name} Technologies — RINK Explorer`,
    description: `Browse ${inst.tech_count} commercializable technologies from ${inst.name} on the RINK Technology Explorer.`,
  };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const [institution, technologies] = await Promise.all([
    getInstitutionBySlug(slug),
    getTechnologiesByInstitution(slug),
  ]);

  if (!institution) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/institutions" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            All Institutions
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-heading">{institution.name}</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                {institution.tech_count} {institution.tech_count === 1 ? 'technology' : 'technologies'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <InstitutionFilterView initialTechnologies={technologies} />
      </div>
    </div>
  );
}
