'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/auth';
import UrlForm from '@/components/UrlForm';
import { SquigglyText } from '@/components/ui/squiggly-text';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  return (
      <div className="min-h-auto text-white bg-transparent">
        <div className="max-w-5xl mx-auto">
          {/* <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
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
          </header> */}
          {/* <Header /> */}

          <main>
            <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">Create New</h1>
                <p className="text-zinc-400">Create short links or generate QR codes instantly.</p>
              </div>
              <Link 
                href="/links"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all font-medium group"
              >
                View all your links
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <UrlForm />
          </main>
        </div>
      </div>
  );
}
