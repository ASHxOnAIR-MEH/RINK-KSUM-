import { redirect } from 'next/navigation';

/**
 * /sectors → redirect to Browse Technologies page.
 */
export default function SectorsIndexPage() {
  redirect('/technologies');
}
