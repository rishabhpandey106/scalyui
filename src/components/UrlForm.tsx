'use client';

import React, { useState, useEffect, useRef } from 'react';
import { checkAlias, shortenUrl, generateQr, uploadPdf } from '@/lib/api';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { Copy, CheckCircle2, XCircle, Link as LinkIcon, QrCode, FileText, ChevronDown, ChevronUp, Lock, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function UrlForm({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<'shorten' | 'pdf' | 'qr'>('shorten');

  // Common State
  const [alias, setAlias] = useState('');
  const [expiry, setExpiry] = useState('');
  const [password, setPassword] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [isChecking, setIsChecking] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<'available' | 'taken' | 'invalid' | 'idle'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab A & C State
  const [url, setUrl] = useState('');

  // Tab B State
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAliasStatus('invalid');
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [alias]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error('File size must be less than 4MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error('File size must be less than 4MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (aliasStatus === 'taken') {
      toast.error('Custom alias is already taken');
      return;
    }
    if (aliasStatus === 'invalid') {
      toast.error('Custom alias is invalid');
      return;
    }

    const finalPassword = isProtected && password ? password : undefined;

    setIsSubmitting(true);
    setResult(null);
    try {
      if (activeTab === 'shorten') {
        if (!url) {
          toast.error('Please enter a URL');
          setIsSubmitting(false);
          return;
        }
        const data = await shortenUrl(url, alias, expiry, finalPassword);
        setResult({ shortUrl: data.short_url, code: data.short_code });
        toast.success('URL shortened successfully!');
      } else if (activeTab === 'pdf') {
        if (!file) {
          toast.error('Please upload a PDF file');
          setIsSubmitting(false);
          return;
        }
        const data = await uploadPdf(file, alias, expiry, finalPassword);
        setResult({ shortUrl: data.short_url, code: data.short_code });
        toast.success('PDF uploaded successfully!');
      } else if (activeTab === 'qr') {
        if (!url) {
          toast.error('Please enter a URL');
          setIsSubmitting(false);
          return;
        }
        const qrBlobUrl = await generateQr(url, alias, expiry);
        setResult({ qrUrl: qrBlobUrl });
        toast.success('QR Code generated successfully!');
      }

      // Reset
      if (activeTab !== 'qr') setUrl('');
      setFile(null);
      setAlias('');
      setExpiry('');
      setPassword('');
      setIsProtected(false);
      setIsAdvancedOpen(false);
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

  const renderAdvancedOptions = () => (
    <div className="mt-4 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors"
      >
        <span>Advanced Options</span>
        {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isAdvancedOpen && (
        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
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
                  aria-label="Custom Alias"
                  className="mb-0! pr-10 bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-zinc-500 focus:outline-none focus:border-accent"
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
                  <div className="absolute right-3 top-3" aria-live="polite">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-500 border-t-accent"></div>
                  </div>
                )}
              </div>
              {aliasStatus === 'available' && <p className="text-accent text-xs mt-1" role="status">Alias is available!</p>}
              {aliasStatus === 'taken' && <p className="text-red-500 text-xs mt-1" role="status">Alias is already taken</p>}
              {aliasStatus === 'invalid' && <p className="text-red-500 text-xs mt-1" role="status">Alias is invalid</p>}
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
                aria-label="Expiry Date"
                className="custom-date-input mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-zinc-500 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {activeTab !== 'qr' && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock size={16} className={isProtected ? 'text-accent' : 'text-zinc-500'} />
                  Password Protection
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isProtected}
                    onChange={(e) => setIsProtected(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              {isProtected && (
                <Input
                  label=""
                  type="password"
                  placeholder="Enter a secure password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-zinc-500 focus:outline-none focus:border-accent animate-in fade-in"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg mb-8 z-10">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
      
      <div className="relative flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setActiveTab('shorten')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'shorten' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <LinkIcon size={16} /> <span className="hidden sm:inline">Shorten URL</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'pdf' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <FileText size={16} /> <span className="hidden sm:inline">Upload PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'qr' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <QrCode size={16} /> <span className="hidden sm:inline">Generate QR</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[140px]">
          {(activeTab === 'shorten' || activeTab === 'qr') && (
            <div className="animate-in fade-in">
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
                aria-label="Destination URL"
                className="mb-0! bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm text-white/80 placeholder-zinc-500 focus:outline-none focus:border-accent"
              />
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="animate-in fade-in">
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FileText size={16} /> Select PDF Document
              </label>
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                  ${file ? 'border-accent bg-accent/5' : 'border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-800/30'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="application/pdf" 
                  className="hidden" 
                />
                
                {file ? (
                  <>
                    <FileText size={32} className="text-accent mb-3" />
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-zinc-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-accent text-xs mt-3 underline">Click to change file</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-zinc-500 mb-3" />
                    <p className="text-zinc-300 font-medium">Click to upload or drag and drop</p>
                    <p className="text-zinc-500 text-sm mt-1">PDF files up to 4MB</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {renderAdvancedOptions()}
        </div>

        <div className="mt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={aliasStatus === 'taken'}
            className="w-full"
            aria-label={activeTab === 'qr' ? 'Generate QR Code' : 'Shorten URL'}
          >
            {activeTab === 'shorten' && 'Shorten URL'}
            {activeTab === 'pdf' && 'Upload & Shorten PDF'}
            {activeTab === 'qr' && 'Generate QR Code'}
          </Button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2" role="region" aria-label="Result">
          {result.shortUrl ? (
            <>
              <div className="min-w-0 flex-1 w-full sm:w-auto text-center sm:text-left">
                <p className="text-sm text-zinc-400 mb-1">Your secure link is ready:</p>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent font-medium hover:underline block truncate w-full"
                >
                  {result.shortUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto p-3 sm:p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center gap-2"
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={20} className="text-accent" />
                    <span className="sm:hidden text-accent text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} className="text-zinc-400" />
                    <span className="sm:hidden text-zinc-400 text-sm font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </>
          ) : result.qrUrl ? (
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-sm text-zinc-400 mb-3">Your QR Code is ready:</p>
              <div className="bg-white p-2 rounded-xl">
                <Image src={result.qrUrl} alt="Generated QR code for your URL" width={200} height={200} className="rounded-lg" />
              </div>
              <a
                href={result.qrUrl}
                download="scaly-qr.png"
                className="mt-4 text-sm text-accent hover:underline"
                aria-label="Download QR Code"
              >
                Download QR Code
              </a>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
