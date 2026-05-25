'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Copy, Trash2, BarChart2, ExternalLink, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import { deleteUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { LinkPreview } from './ui/link-preview';

export interface UrlItem {
  ShortCode: string;
  LongURL: string;
  Clicks: number;
  CreatedAt: string;
  ShortURL: string;
}

interface UrlTableProps {
  urls: UrlItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function UrlTable({ urls, isLoading, onRefresh }: UrlTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_clicks'>('newest');

  const filteredAndSortedUrls = useMemo(() => {
    let result = [...urls];

    // Search filter
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(url =>
        (url.ShortCode && url.ShortCode.toLowerCase().includes(q)) ||
        (url.LongURL && url.LongURL.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.CreatedAt || 0).getTime() - new Date(a.CreatedAt || 0).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.CreatedAt || 0).getTime() - new Date(b.CreatedAt || 0).getTime();
      } else if (sortBy === 'most_clicks') {
        return (b.Clicks || 0) - (a.Clicks || 0);
      }
      return 0;
    });

    return result;
  }, [urls, search, sortBy]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleCopy = (shortUrl: string, code: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    setDeletingCode(code);
    try {
      await deleteUrl(code);
      toast.success('URL deleted successfully');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete URL');
    } finally {
      setDeletingCode(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="
              h-24
              rounded-xl
              bg-white/5
              border border-white/10
              backdrop-blur-xl
              overflow-hidden
              relative
            "
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/10 via-transparent to-white/5 opacity-30 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center text-white/40">
        No URLs created yet. Shorten your first link above!
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-2 pr-2 sm:pl-0 sm:pr-0">
      {urls.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-2 pb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by alias or long URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_clicks">Most Clicks</option>
            </select>
          </div>
        </div>
      )}

      {filteredAndSortedUrls.length === 0 && urls.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-white/40">
          No URLs match your search.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedUrls.map((url, index) => (

            <div
              key={url.ShortCode ?? index}
              className="relative
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                rounded-xl
                p-4 sm:p-6
                flex flex-col sm:flex-row
                justify-between
                gap-4
                hover:border-white/20
                transition-all"
            >
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-20 pointer-events-none" />
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-center gap-3 mb-1 min-w-0 w-full">
                  <LinkPreview
                    url={url.LongURL}
                    live={url.ShortURL}
                    target="_blank"
                    // rel="noreferrer"
                    className="text-accent font-semibold text-lg hover:underline flex items-center gap-2 truncate min-w-0 w-full"
                  >
                    <span className="text-zinc-400 truncate">{BASE_URL}/<span className="text-accent">{url.ShortCode}</span></span>
                    <ExternalLink size={14} className="opacity-50 shrink-0" />
                  </LinkPreview>
                </div>
                <p className="text-zinc-500 text-sm truncate" title={url.LongURL}>
                  {url.LongURL}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <BarChart2 size={14} />
                    {url.Clicks ?? 0} clicks
                  </span>
                  {url.CreatedAt && (
                    <span>
                      {new Date(url.CreatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(url.ShortURL, url.ShortCode)}
                    className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                    title="Copy"
                    aria-label={`Copy short URL for ${url.ShortCode}`}
                  >
                    {copiedCode === url.ShortCode ? <CheckCircle2 size={18} className="text-accent" /> : <Copy size={18} />}
                  </button>

                  <Link
                    href={{
                      pathname: `/dashboard/analytics/${url.ShortCode}`,
                      query: {
                        createdAt: url.CreatedAt,
                      },
                    }}
                    className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-accent"
                    title="Analytics"
                    aria-label={`View analytics for ${url.ShortCode}`}
                  >
                    <BarChart2 size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(url.ShortCode)}
                    disabled={deletingCode === url.ShortCode}
                    className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-500 disabled:opacity-50"
                    title="Delete"
                    aria-label={`Delete short URL ${url.ShortCode}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
