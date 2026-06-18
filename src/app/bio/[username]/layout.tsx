import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const { username } = await params;

  try {
    const res = await fetch(`${API_URL}/bio/${username}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    
    const data = await res.json();
    const title = data.page.title || `@${data.page.username}`;
    const description = data.page.bio_text || `Check out ${title}'s links on Scaly.`;
    
    return {
      title: `${title} | Scaly Link-in-Bio`,
      description: description,
    };
  } catch (err) {
    return {
      title: 'Profile Not Found | Scaly',
      description: 'This bio page does not exist or has been removed.',
    };
  }
}

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
