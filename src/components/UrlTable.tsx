'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Trash2, BarChart2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { deleteUrl } from '@/lib/api';
import toast from 'react-hot-toast';

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

  const BASE_URL = 'https://scaly.itsrishabh.tech';

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
          <div key={i} className="h-24 bg-zinc-900 animate-pulse rounded-xl border border-zinc-800"></div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
        No URLs created yet. Shorten your first link above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url, index) => (
        
        <div
          key={url.ShortCode ?? index}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <a
                href={url.ShortURL}
                target="_blank"
                rel="noreferrer"
                className="text-accent font-semibold text-lg hover:underline flex items-center gap-2 truncate"
              >
                {url.ShortURL ? url.ShortURL.replace(/^https?:\/\//, '') : 'Invalid URL'}
                <ExternalLink size={14} className="opacity-50" />
              </a>
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
              >
                {copiedCode === url.ShortCode ? <CheckCircle2 size={18} className="text-accent" /> : <Copy size={18} />}
              </button>

              <Link
                href={`/dashboard/analytics/${url.ShortCode}`}
                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-accent"
                title="Analytics"
              >
                <BarChart2 size={18} />
              </Link>

              <button
                onClick={() => handleDelete(url.ShortCode)}
                disabled={deletingCode === url.ShortCode}
                className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-500 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
