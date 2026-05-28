import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTechnologies, getAllSectors, getAllInstitutions } from '@/lib/db';
import TechListClient from './TechListClient';
import { FlaskConical } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Technologies | RINK Technology Explorer',
  description: 'Browse all commercializable technologies from Kerala research institutions. Filter by sector, institution, technology type, and startup potential.',
};

export default async function TechnologiesPage() {
  const [technologies, sectors, institutions] = await Promise.all([
    getAllTechnologies(),
    getAllSectors(),
    getAllInstitutions(),
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#F0F6FF] to-[#EEF5FF] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <a href="/" className="hover:text-[#003F8A] transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Technologies</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#003F8A] flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black text-gray-900 mb-1">
                Research Technologies
              </h1>
              <p className="text-gray-500 text-sm">
                {technologies.length} technologies from Kerala's leading research institutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading technologies...</div>}>
          <TechListClient
            initialTechs={technologies}
            sectors={sectors}
            institutions={institutions}
          />
        </Suspense>
      </div>
    </div>
  );
}
