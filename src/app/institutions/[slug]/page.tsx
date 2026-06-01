import { getInstitutionBySlug, getTechnologiesByInstitution, getAllInstitutions } from '@/lib/db';
import { notFound } from 'next/navigation';
import TechnologyCard from '@/components/ui/TechnologyCard';
import Link from 'next/link';
import { ArrowLeft, Building2, FlaskConical } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/institutions" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#003F8A] transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            All Institutions
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#003F8A]/8 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-[#003F8A]/50" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">{institution.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {institution.tech_count} {institution.tech_count === 1 ? 'technology' : 'technologies'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {technologies.length === 0 ? (
          <div className="text-center py-16">
            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No technologies found for this institution yet.</p>
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
