'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { getOriginalUrl } from '@/lib/api';

export default function RedirectPage() {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (code) {
        getOriginalUrl(code);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
        <div className="text-zinc-500 mb-6 text-xl">Link not found</div>
        <Link href="/" className="text-accent hover:underline">
          Go to Scaly
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <Loader className="w-12 h-12 text-accent mb-6" />
      <p className="text-zinc-400 animate-pulse">Redirecting...</p>
    </div>
  );
}