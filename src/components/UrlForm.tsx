'use client';

import React, { useState, useEffect } from 'react';
import { checkAlias, shortenUrl } from '@/lib/api';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { Copy, CheckCircle2, XCircle, Link as LinkIcon } from 'lucide-react';

export default function UrlForm({ onSuccess }: { onSuccess: () => void }) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<'available' | 'taken' | 'idle'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Debounced alias check
  useEffect(() => {
    if (!alias) {
      setAliasStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await checkAlias(alias);
        // Assuming backend returns { available: boolean }
        setAliasStatus(res.available ? 'available' : 'taken');
      } catch (err) {
        setAliasStatus('taken'); // If error, assume taken to be safe
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [alias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    if (aliasStatus === 'taken') {
      toast.error('Custom alias is already taken');
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    try {
      const data = await shortenUrl(url, alias);
      setResult(data);
      setUrl('');
      setAlias('');
      setAliasStatus('idle');
      toast.success('URL shortened successfully!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to shorten URL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
            <LinkIcon size={16} /> Destination URL
          </label>
          <Input
            label=""
            type="url"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSubmitting}
            required
            className="!mb-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Custom Alias (Optional)
          </label>
          <div className="relative">
            <Input
              label=""
              type="text"
              placeholder="my-custom-alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              disabled={isSubmitting}
              className="!mb-0 pr-10"
            />
            {alias && !isChecking && (
              <div className="absolute right-3 top-3">
                {aliasStatus === 'available' ? (
                  <CheckCircle2 size={18} className="text-accent" />
                ) : aliasStatus === 'taken' ? (
                  <XCircle size={18} className="text-red-500" />
                ) : null}
              </div>
            )}
            {isChecking && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-500 border-t-accent"></div>
              </div>
            )}
          </div>
          {aliasStatus === 'available' && <p className="text-accent text-xs mt-1">Alias is available!</p>}
          {aliasStatus === 'taken' && <p className="text-red-500 text-xs mt-1">Alias is already taken</p>}
        </div>

        <div className="mt-2">
          <Button type="submit" isLoading={isSubmitting} disabled={aliasStatus === 'taken'}>
            Shorten URL
          </Button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Your shortened URL is ready:</p>
            <a 
              href={result.shortUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-accent font-medium hover:underline break-all"
            >
              {result.shortUrl}
            </a>
          </div>
          <button 
            onClick={handleCopy}
            className="ml-4 p-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors shrink-0"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 size={20} className="text-accent" /> : <Copy size={20} className="text-zinc-400" />}
          </button>
        </div>
      )}
    </div>
  );
}
