import { ImageResponse } from 'next/og';

export const dynamic = 'force-dynamic';

export const alt = 'Scaly Bio Page';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const { username } = await params;
  
  let data: any = null;
  try {
    const res = await fetch(`${API_URL}/bio/${username}`, { cache: 'no-store' });
    if (res.ok) data = await res.json();
  } catch (e) {}

  const themeColor = data?.page?.theme_color || '#22c55e';
  const title = data?.page?.title || `@${username}`;
  const bio = data?.page?.bio_text || 'Check out my links on Scaly.';
  const linkCount = data?.links?.length || 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#18181b',
            border: `4px solid ${themeColor}`,
            padding: '60px 80px',
            borderRadius: '32px',
            boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '70px',
              backgroundColor: themeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#09090b',
              marginBottom: '30px',
            }}
          >
            {title.charAt(0).toUpperCase()}
          </div>
          
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', margin: '0 0 16px 0', color: 'white' }}>
            {title.toUpperCase()}
          </h1>
          
          <p style={{ fontSize: '32px', color: '#a1a1aa', margin: '0 0 40px 0', maxWidth: '700px', textAlign: 'center', lineHeight: 1.4 }}>
            {bio}
          </p>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 32px',
              backgroundColor: '#27272a',
              borderRadius: '100px',
              fontSize: '24px',
              color: '#d4d4d8',
            }}
          >
            {linkCount} {linkCount === 1 ? 'Link' : 'Links'} inside
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '40px', fontSize: '24px', color: '#71717a', display: 'flex', paddingBottom: '12px'}}>
          Powered by Scaly
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
