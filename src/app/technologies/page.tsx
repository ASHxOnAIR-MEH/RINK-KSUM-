import { searchTechnologies, getAllSectors, getAllInstitutions, getTechnologyTypes, getPatentStatuses, getPlatformStats } from '@/lib/db';
import TechListClient from './TechListClient';

export const metadata = {
  title: 'All Technologies — RINK Technology Transfer Portal',
  description: 'Browse all commercializable technologies from Kerala research institutions. Filter by sector, institution, type, and more.',
};

interface Props {
  searchParams: Promise<{
    q?: string;
    sector?: string;
    institution?: string;
    type?: string;
    patent?: string;
    potential?: string;
    page?: string;
  }>;
}

export default async function TechnologiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);

  const [result, sectors, institutions, types, patentStatuses, stats] = await Promise.all([
    searchTechnologies(
      {
        query: params.q,
        sector: params.sector,
        institution: params.institution,
        technology_type: params.type,
        patent_status: params.patent,
        featured: params.potential as 'featured' | 'non-featured' | undefined,
      },
      page,
      12
    ),
    getAllSectors(),
    getAllInstitutions(),
    getTechnologyTypes(),
    getPatentStatuses(),
    getPlatformStats(),
  ]);

  return (
    <TechListClient
      initialResult={result}
      sectors={sectors}
      institutions={institutions}
      technologyTypes={types}
      patentStatuses={patentStatuses}
      totalCount={stats.technology_count}
      initialFilters={{
        q: params.q ?? '',
        sector: params.sector ?? '',
        institution: params.institution ?? '',
        type: params.type ?? '',
        patent: params.patent ?? '',
        potential: params.potential ?? '',
      }}
    />
  );
}
