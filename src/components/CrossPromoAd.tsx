'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquarePlus, ArrowRight } from 'lucide-react';

export default function CrossPromoAd() {
  // TODO: Update this URL to the actual Cypher live URL
  const cypherUrl = 'https://cypher.itsrishabh.tech?utm_source=scaly&utm_medium=ad&utm_campaign=cross_promo';

  return (
    <Link 
      href={cypherUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 mt-8 mb-4"
    >
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[50px] transition-all group-hover:bg-blue-500/20" />
      
      <div className="relative z-10 flex items-start gap-4 sm:items-center">
        {/* Icon Container */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 shadow-inner">
          <MessageSquarePlus size={24} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-base">Get anonymous feedback</h3>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider border border-blue-500/20">
              New
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-snug">
            Add an anonymous Q&A widget to your portfolio with <span className="text-zinc-200 font-medium">Cypher</span>.
          </p>
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex shrink-0 items-center justify-center h-10 w-10 rounded-full bg-zinc-800/50 text-zinc-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
