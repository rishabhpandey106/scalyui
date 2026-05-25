'use client';

import React, { useState, useEffect } from 'react';
import { checkAlias, shortenUrl, generateQr } from '@/lib/api';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { Copy, CheckCircle2, XCircle, Link as LinkIcon, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function UrlForm({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiry, setExpiry] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<'available' | 'taken' | 'idle'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [result, setResult] = useState<{ shortUrl?: string; code?: string; qrUrl?: string } | null>(null);
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
        setAliasStatus(res.available ? 'available' : 'taken');
      } catch (err) {
        setAliasStatus('taken');
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [alias]);

  const handleSubmit = async (action: 'shorten' | 'qr') => {
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
      if (action === 'shorten') {
        const data = await shortenUrl(url, alias, expiry);
        setResult({ shortUrl: data.short_url, code: data.short_code });
        toast.success('URL shortened successfully!');
      } else if (action === 'qr') {
        const qrBlobUrl = await generateQr(url, alias, expiry);
        setResult({ qrUrl: qrBlobUrl });
        toast.success('QR Code generated successfully!');
      }

      setUrl('');
      setAlias('');
      setExpiry('');
      setAliasStatus('idle');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (result && result.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        shadow-lg
        mb-8
        z-10
        hover:border-white/20
        transition-all">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
      <div className="relative flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
            <LinkIcon size={16} /> Destination URL
          </label>
          <Input
            label=""
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSubmitting}
            required
            className="mb-0! bg-white/5 backdrop-blur-md border border-white/10 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="mb-0! pr-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Expiry Date (Optional)
            </label>
            <Input
              label=""
              type="datetime-local"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              disabled={isSubmitting}
              className="custom-date-input mb-0! bg-white/5 backdrop-blur-md border border-white/10 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => handleSubmit('shorten')}
            isLoading={isSubmitting}
            disabled={aliasStatus === 'taken'}
            className="flex-1"
          >
            Shorten URL
          </Button>
          <button
            type="button"
            onClick={() => handleSubmit('qr')}
            disabled={isSubmitting || aliasStatus === 'taken'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <QrCode size={18} />
            Generate QR
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          {result.shortUrl ? (
            <>
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
                className="p-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors shrink-0"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 size={20} className="text-accent" /> : <Copy size={20} className="text-zinc-400" />}
              </button>
            </>
          ) : result.qrUrl ? (
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-sm text-zinc-400 mb-3">Your QR Code is ready:</p>
              <div className="bg-white p-2 rounded-xl">
                <Image src={result.qrUrl} alt="Generated QR" width={200} height={200} className="rounded-lg" />
              </div>
              <a
                href={result.qrUrl}
                download="scaly-qr.png"
                className="mt-4 text-sm text-accent hover:underline"
              >
                Download QR Code
              </a>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
