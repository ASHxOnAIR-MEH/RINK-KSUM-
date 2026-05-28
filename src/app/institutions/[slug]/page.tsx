import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInstitutionBySlug, getTechnologiesByInstitution } from '@/lib/db';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { institutions as allInstitutions } from '@/data/institutions';
import { Building2, MapPin, Globe, Phone, Mail, ExternalLink } from 'lucide-react';

export async function generateStaticParams() {
  return allInstitutions.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inst = await getInstitutionBySlug(slug);
  if (!inst) return { title: 'Institution Not Found' };
  return {
    title: `${inst.acronym} Technologies | RINK Technology Explorer`,
    description: inst.description,
  };
}

export default async function InstitutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [inst, techs] = await Promise.all([
    getInstitutionBySlug(slug),
    getTechnologiesByInstitution(slug),
  ]);

  if (!inst) notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0F6FF] to-[#EEF5FF] border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#003F8A]">Home</Link>
            <span>/</span>
            <Link href="/institutions" className="hover:text-[#003F8A]">Institutions</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{inst.acronym}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Institution Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#003F8A] flex items-center justify-center text-white font-black font-heading text-lg">
                  {inst.acronym.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase text-[#003F8A] mb-1">{inst.acronym}</div>
                  <h1 className="text-2xl font-heading font-black text-gray-900 leading-tight">{inst.full_name}</h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{inst.description}</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                {inst.location}
              </div>
            </div>

            {/* Contact Card */}
            <div className="card p-5">
              <h3 className="font-heading font-bold text-gray-900 text-sm mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="text-xs text-gray-400">Contact Person</div>
                <div className="text-sm font-medium text-gray-900">{inst.contact_person}</div>
                <a href={`tel:${inst.contact_phone}`} className="flex items-center gap-2 text-sm text-[#003F8A] hover:underline">
                  <Phone className="w-3.5 h-3.5" />
                  {inst.contact_phone}
                </a>
                <a href={`mailto:${inst.contact_email}`} className="flex items-center gap-2 text-sm text-[#003F8A] hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  {inst.contact_email}
                </a>
                <a href={inst.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#003F8A] hover:underline">
                  <Globe className="w-3.5 h-3.5" />
                  {inst.website.replace('https://', '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="section-header mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            Technologies from {inst.acronym}
          </h2>
        </div>
        {techs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔬</div>
            <p className="text-gray-500">No technologies listed yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techs.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
