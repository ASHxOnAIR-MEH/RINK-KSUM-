import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * /sectors/[slug] → redirect permanently to Browse Technologies with sector filter applied.
 * This preserves old bookmarks/links while removing the dedicated sector page.
 */
export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/technologies?sector=${slug}`);
}
