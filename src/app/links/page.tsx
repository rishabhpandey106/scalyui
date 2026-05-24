'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getUserUrls } from '@/lib/api';
import UrlTable, { UrlItem } from '@/components/UrlTable';
import toast from 'react-hot-toast';

export default function LinksPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  const fetchUrls = useCallback(async () => {
    setIsLoadingUrls(true);
    try {
      const data = await getUserUrls();
      const rawUrls = Array.isArray(data) ? data : data.urls || [];
      const formattedUrls = rawUrls.map((url: any) => ({
        ...url,
        ShortURL: `https://scaly.itsrishabh.tech/${url.ShortCode}`,
      }));
      setUrls(formattedUrls);
    } catch (err: any) {
      if (err.message === 'Unauthorized') return; // Handled by api interceptor
      toast.error('Failed to load URLs');
    } finally {
      setIsLoadingUrls(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return (
    <div className="min-h-auto text-white bg-transparent">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Your Links</h1>
              <p className="text-zinc-500">Manage, track, and edit your shortened URLs.</p>
            </div>
            <div className="text-sm text-zinc-400 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
              {urls.length} total link{urls.length !== 1 ? 's' : ''}
            </div>
          </div>
        </header>

        <main>
          <UrlTable urls={urls} isLoading={isLoadingUrls} onRefresh={fetchUrls} />
        </main>
      </div>
    </div>
  );
}
