import { getAllSectors, getTechnologiesBySector, getAllTechnologies } from '@/lib/db';
import StartupDiscoveryClient from './StartupDiscoveryClient';

export const metadata = {
  title: 'Startup Discovery — RINK Technology Explorer',
  description: 'Discover technologies to build your startup. Browse by sector and find commercializable research from Kerala institutions.',
};

interface Props {
  searchParams: Promise<{ sector?: string }>;
}

export default async function StartupDiscoveryPage({ searchParams }: Props) {
  const { sector } = await searchParams;

  const [sectors, allTechs] = await Promise.all([
    getAllSectors(),
    getAllTechnologies(),
  ]);

  // If a sector is pre-selected, load that sector's technologies
  const activeSectorTechs = sector
    ? allTechs.filter(t => t.sector_slug === sector)
    : allTechs.filter(t => t.startup_potential === 'High').slice(0, 9);

  const activeSector = sector ? sectors.find(s => s.slug === sector) : null;

  return (
    <StartupDiscoveryClient
      sectors={sectors}
      initialTechs={activeSectorTechs}
      initialSectorSlug={sector ?? ''}
      activeSector={activeSector ?? null}
    />
  );
}
