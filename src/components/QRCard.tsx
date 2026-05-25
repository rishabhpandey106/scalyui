'use client';

import React, { useEffect, useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import Button from './Button';
import { getQrviaCode } from '@/lib/api';

interface QRCardProps {
  code: string;
}

export default function QRCard({ code }: QRCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await getQrviaCode(code);
      setQrUrl(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `scaly-qr-${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  return (
    <div
      className="
        relative
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        shadow-lg
        flex flex-col
        h-full
        hover:border-white/20
        transition-all
      "
    >
      {/* glow layer */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* header */}
      <div className="relative flex items-center gap-2 mb-6">
        <QrCode className="text-accent" />
        <h3 className="font-semibold text-lg text-white">QR Code</h3>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center">
        {qrUrl ? (
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-xl shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            </div>

            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 max-w-50"
            >
              <Download size={18} /> Download
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/50 mb-6 text-sm max-w-xs mx-auto">
              Generate a custom QR code for your shortened URL to share offline.
            </p>

            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              className="max-w-50 mx-auto"
            >
              Generate QR
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}