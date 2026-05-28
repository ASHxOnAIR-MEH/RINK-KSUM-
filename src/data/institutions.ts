import { Institution } from '@/types';

export const institutions: Institution[] = [
  {
    id: 'inst-1',
    slug: 'ctcri',
    acronym: 'CTCRI',
    full_name: 'Central Tuber Crops Research Institute',
    description:
      'Premier national research institute under ICAR dedicated to research on tropical tuber crops including cassava, sweet potato, yams and aroids. Located in Thiruvananthapuram, Kerala.',
    location: 'Thiruvananthapuram, Kerala',
    website: 'https://ctcri.org',
    contact_email: 'director@ctcri.org',
    contact_phone: '+91-471-2598551',
    contact_person: 'Dr. M. Nedunchezhiyan',
    tech_count: 8,
  },
  {
    id: 'inst-2',
    slug: 'cpcri',
    acronym: 'CPCRI',
    full_name: 'Central Plantation Crops Research Institute',
    description:
      'National research institute under ICAR focused on plantation crops including coconut, arecanut, cocoa and spices. Headquartered at Kasaragod, Kerala.',
    location: 'Kasaragod, Kerala',
    website: 'https://cpcri.gov.in',
    contact_email: 'director.cpcri@icar.gov.in',
    contact_phone: '+91-4994-232893',
    contact_person: 'Dr. P. Chowdappa',
    tech_count: 7,
  },
  {
    id: 'inst-3',
    slug: 'niist',
    acronym: 'NIIST',
    full_name: 'National Institute for Interdisciplinary Science and Technology',
    description:
      'CSIR constituent laboratory at Thiruvananthapuram focusing on materials science, biotechnology, chemical sciences and interdisciplinary research.',
    location: 'Thiruvananthapuram, Kerala',
    website: 'https://www.niist.res.in',
    contact_email: 'director@niist.res.in',
    contact_phone: '+91-471-2515300',
    contact_person: 'Dr. C. Anandharamakrishnan',
    tech_count: 4,
  },
  {
    id: 'inst-4',
    slug: 'ncrmi',
    acronym: 'NCRMI',
    full_name: 'National Coir Research and Management Institute',
    description:
      'Specialized research institute focused on coir industry, processing technologies, and value-added coir products. Based in Alappuzha, Kerala.',
    location: 'Alappuzha, Kerala',
    website: 'https://ncrmi.gov.in',
    contact_email: 'director@ncrmi.gov.in',
    contact_phone: '+91-477-2251427',
    contact_person: 'Dr. Suresh Kumar',
    tech_count: 2,
  },
  {
    id: 'inst-5',
    slug: 'kscste',
    acronym: 'KSCSTE',
    full_name: 'Kerala State Council for Science, Technology and Environment',
    description:
      'Apex body of the Government of Kerala for promoting science, technology and environment. Funds research and innovation across multiple domains.',
    location: 'Thiruvananthapuram, Kerala',
    website: 'https://kscste.kerala.gov.in',
    contact_email: 'info@kscste.kerala.gov.in',
    contact_phone: '+91-471-2548409',
    contact_person: 'Dr. V.N. Rajasekharan Pillai',
    tech_count: 2,
  },
  {
    id: 'inst-6',
    slug: 'kfri',
    acronym: 'KFRI',
    full_name: 'Kerala Forest Research Institute',
    description:
      'Research institute under the Government of Kerala conducting research on forest ecosystems, timber, non-timber forest products and climate change.',
    location: 'Thrissur, Kerala',
    website: 'https://kfri.res.in',
    contact_email: 'director@kfri.res.in',
    contact_phone: '+91-480-2731061',
    contact_person: 'Dr. T.V. Sajeev',
    tech_count: 1,
  },
  {
    id: 'inst-7',
    slug: 'cwrdm',
    acronym: 'CWRDM',
    full_name: 'Centre for Water Resources Development and Management',
    description:
      'Autonomous institution under Government of Kerala specializing in water resources management, water technology and rural water supply.',
    location: 'Kozhikode, Kerala',
    website: 'https://cwrdm.net',
    contact_email: 'director@cwrdm.net',
    contact_phone: '+91-495-2781026',
    contact_person: 'Dr. K.G. Sreeja',
    tech_count: 1,
  },
  {
    id: 'inst-8',
    slug: 'jntbgri',
    acronym: 'JNTBGRI',
    full_name: 'Jawaharlal Nehru Tropical Botanic Garden and Research Institute',
    description:
      'Premier research institute in tropical botany, medicinal plants, biodiversity conservation and ethnobotany under Government of Kerala.',
    location: 'Thiruvananthapuram, Kerala',
    website: 'https://jntbgri.res.in',
    contact_email: 'director@jntbgri.res.in',
    contact_phone: '+91-471-2912133',
    contact_person: 'Dr. M. Rajith Nair',
    tech_count: 0,
  },
];

export function getInstitutionBySlug(slug: string): Institution | undefined {
  return institutions.find((i) => i.slug === slug);
}
