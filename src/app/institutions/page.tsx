import { getAllInstitutions, getPlatformStats } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Building2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Research Institutions — RINK Technology Explorer',
  description: 'Browse technologies from all Kerala research institutions including ICAR-CPCRI, ICAR-CTCRI, CSIR-NIIST, KUFOS, and more.',
};

export default async function InstitutionsPage() {
  const [institutions, stats] = await Promise.all([
    getAllInstitutions(),
    getPlatformStats(),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#003F8A] transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Research Institutions</h1>
          <p className="text-gray-500 text-sm mt-1">
            {stats.institution_count} institutions · {stats.technology_count}+ technologies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions.map((inst) => (
            <Link
              key={inst.slug}
              href={`/institutions/${inst.slug}`}
              id={`institution-${inst.slug}`}
            >
              <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#003F8A]/20 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#003F8A]/8 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-[#003F8A]/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#003F8A] transition-colors">
                      {inst.name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#003F8A] transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
