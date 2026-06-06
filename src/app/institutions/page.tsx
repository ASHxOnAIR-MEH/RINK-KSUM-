import { getAllInstitutions, getPlatformStats } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InstitutionCard from '@/components/ui/InstitutionCard';

export const metadata = {
  title: 'Research Institutions — RINK Technology Transfer Portal',
  description: 'Browse technologies from all Kerala research institutions including ICAR-CPCRI, ICAR-CTCRI, CSIR-NIIST, KUFOS, and more.',
};

export default async function InstitutionsPage() {
  const [institutions, stats] = await Promise.all([
    getAllInstitutions(),
    getPlatformStats(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-heading font-bold text-heading">Research Institutions</h1>
          <p className="text-text-secondary text-sm mt-1">
            {stats.institution_count} institutions · {stats.technology_count}+ technologies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((inst) => (
            <InstitutionCard key={inst.slug} institution={inst} />
          ))}
        </div>
      </div>
    </div>
  );
}
