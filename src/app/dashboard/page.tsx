'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import { getUserUrls } from '@/lib/api';
import UrlForm from '@/components/UrlForm';
import UrlTable, { UrlItem } from '@/components/UrlTable';
import toast from 'react-hot-toast';
import { SquigglyText } from '@/components/ui/squiggly-text';

export default function DashboardPage() {
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <div className="text-2xl font-bold text-accent tracking-tight">
            <SquigglyText
              scale={2}
              className="text-accent"
            >
              Scaly
            </SquigglyText>
          </div>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Log out
          </button>
        </header>

        <main>
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold mb-2">Shorten new URL</h1>
            <p className="text-zinc-400">Create short, trackable links instantly.</p>
          </div>

          <UrlForm onSuccess={fetchUrls} />

          <div className="mt-12 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">Your Links</h2>
              <p className="text-zinc-500 text-sm mt-1">Manage and track your shortened URLs</p>
            </div>
            <div className="text-sm text-zinc-400">
              {urls.length} link{urls.length !== 1 ? 's' : ''}
            </div>
          </div>

          <UrlTable urls={urls} isLoading={isLoadingUrls} onRefresh={fetchUrls} />
        </main>
      </div>
    </div>
  );
}
