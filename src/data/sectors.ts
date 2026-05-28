import { Sector } from '@/types';

export const sectors: Sector[] = [
  {
    id: 'sec-1',
    slug: 'agriculture',
    name: 'Agriculture',
    description:
      'Precision farming, crop monitoring, soil health, and post-harvest technologies for modern agriculture.',
    icon: '🌾',
    color: '#16a34a',
    tech_count: 4,
  },
  {
    id: 'sec-2',
    slug: 'food-processing',
    name: 'Food Processing',
    description:
      'Value-added food products, functional foods, food machinery, and food safety technologies.',
    icon: '🍽️',
    color: '#ea580c',
    tech_count: 6,
  },
  {
    id: 'sec-3',
    slug: 'water-technology',
    name: 'Water Technology',
    description:
      'Water purification, rainwater harvesting, irrigation management, and water quality monitoring.',
    icon: '💧',
    color: '#0284c7',
    tech_count: 2,
  },
  {
    id: 'sec-4',
    slug: 'renewable-energy',
    name: 'Renewable Energy',
    description:
      'Biomass energy, solar applications, bio-briquettes and clean energy technologies.',
    icon: '⚡',
    color: '#ca8a04',
    tech_count: 2,
  },
  {
    id: 'sec-5',
    slug: 'climate-tech',
    name: 'Climate Tech',
    description:
      'Carbon sequestration, climate adaptation, and sustainable land management technologies.',
    icon: '🌍',
    color: '#0d9488',
    tech_count: 2,
  },
  {
    id: 'sec-6',
    slug: 'manufacturing',
    name: 'Manufacturing',
    description:
      'Processing machinery, automation, industrial equipment, and production technology.',
    icon: '⚙️',
    color: '#7c3aed',
    tech_count: 3,
  },
  {
    id: 'sec-7',
    slug: 'sustainable-materials',
    name: 'Sustainable Materials',
    description:
      'Biodegradable materials, eco-packaging, natural fibers, and bio-based materials.',
    icon: '♻️',
    color: '#65a30d',
    tech_count: 3,
  },
  {
    id: 'sec-8',
    slug: 'biotechnology',
    name: 'Biotechnology',
    description:
      'Bio-formulations, microbial technology, plant biotechnology, and bio-based products.',
    icon: '🧬',
    color: '#dc2626',
    tech_count: 1,
  },
  {
    id: 'sec-9',
    slug: 'healthcare',
    name: 'Healthcare',
    description:
      'Herbal medicines, nutraceuticals, medical devices, and health monitoring technologies.',
    icon: '⚕️',
    color: '#9333ea',
    tech_count: 0,
  },
  {
    id: 'sec-10',
    slug: 'smart-systems',
    name: 'Smart Systems',
    description:
      'IoT devices, sensor systems, smart monitoring, and digital agriculture solutions.',
    icon: '📡',
    color: '#0ea5e9',
    tech_count: 2,
  },
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
