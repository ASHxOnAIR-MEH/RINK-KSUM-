import type { Metadata } from 'next';
import { getAllInstitutions } from '@/lib/db';
import InstitutionCard from '@/components/ui/InstitutionCard';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Research Institutions | RINK Technology Explorer',
  description: 'Explore technologies from CTCRI, CPCRI, NIIST, NCRMI, KSCSTE, KFRI, CWRDM and JNTBGRI — Kerala\'s leading research institutions.',
};

export default async function InstitutionsPage() {
  const institutions = await getAllInstitutions();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0F6FF] to-[#EEF5FF] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Institutions</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#003F8A] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black text-gray-900 mb-1">Research Institutions</h1>
              <p className="text-gray-500 text-sm">Kerala's leading research institutions with commercializable technologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {institutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </div>
    </div>
  );
}
