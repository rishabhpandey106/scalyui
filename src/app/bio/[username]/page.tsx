'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicBio } from '@/lib/api';
import { motion } from 'motion/react';
import Link from 'next/link';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { cn } from '@/lib/utils';
import { DiaTextReveal } from '@/components/ui/dia-text-reveal';

interface BioLink {
  id: number;
  title: string;
  short_code: string;
}

interface BioPageData {
  page: {
    username: string;
    title: string;
    bio_text: string;
    theme_color: string;
  };
  links: BioLink[];
}

export default function PublicBioPage() {
  const params = useParams();
  const username = params?.username as string;

  const [data, setData] = useState<BioPageData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchBio = async () => {
      try {
        const result = await getPublicBio(username);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Bio not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBio();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <span className="text-2xl">🔍</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-zinc-400 max-w-sm mb-8">
          The link-in-bio page you are looking for doesn't exist or has been removed.
        </p>
        <Link href="/" className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors">
          Create Your Own
        </Link>
      </div>
    );
  }

  const { page, links } = data;
  // Fallback theme color to black if not provided
  const themeColor = page.theme_color || '#1a1a1a';
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="min-h-[100dvh] text-white flex flex-col items-center pt-16 pb-8 px-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects based on Theme Color */}
      {/* <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] rounded-full blur-[140px] opacity-30 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      /> */}
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-black to-transparent pointer-events-none z-10"
      />

      {/* Main Content Container */}
      <div className="w-full max-w-[600px] z-20 relative flex flex-col items-center flex-1">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 w-full"
        >
          {/* Avatar Placeholder (derived from username) */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #000)`,
              boxShadow: `
      inset 0 0 0 2px rgba(255,255,255,0.1),
      0 25px 50px -12px rgba(0,0,0,0.5)
    `,
            }}
          >
            {page.title ? page.title.charAt(0).toUpperCase() : page.username.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-3">
            {/* <LineShadowText className="italic" shadowColor="white">{page.title?.toUpperCase() || `@${page.username.toUpperCase()}`}</LineShadowText> */}
            <DiaTextReveal
              className="text-4xl font-bold tracking-tight"
              text={page.title?.toUpperCase() || `@${page.username.toUpperCase()}`}
              colors={["#A97CF8", themeColor, "#FDCC92"]}
              repeat={true}
              repeatDelay={2}
            />
          </h1>

          {page.bio_text && (
            <p className="text-zinc-300 text-lg leading-relaxed max-w-md mx-auto font-medium">
              {page.bio_text}
            </p>
          )}
        </motion.div>

        {/* Links Section */}
        <div className="w-full space-y-4">
          {(links || []).map((link, index) => (
            <motion.a
              key={link.id}
              href={`${BASE_URL}/${link.short_code}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full"
            >
              <div
                className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 hover:bg-white/10 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
                />
                <NoiseTexture noiseOpacity={0.45} className="transition-all group-hover/button:opacity-100" />

                <span className="font-semibold text-lg tracking-wide relative z-10 text-white">
                  {link.title}
                </span>

                {/* Optional icon on the right to indicate external link */}
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </span>
              </div>
            </motion.a>
          ))}

          {(!links || links.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-8 bg-white/5 border border-white/5 rounded-2xl"
            >
              <p className="text-zinc-500">No links available yet.</p>
            </motion.div>
          )}
        </div>

        {/* Branding Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-auto p-16 text-center z-20"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
            Powered by <span className="text-white font-bold tracking-tight">Scaly</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

