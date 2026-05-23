'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MousePointerClick, Globe, Monitor, Calendar } from 'lucide-react';
import { getAnalytics } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import QRCard from '@/components/QRCard';
import ChartSection from '@/components/ChartSection';
import TopList from '@/components/TopList';

interface ClickEvent {
  clicked_at: string;
  country: string;
  id: number;
  ip: string;
  referrer: string;
  short_code: string;
  user_agent: string;
}

interface AnalyticsData {
  clicks: ClickEvent[];
  countries: Record<string, number>;
  daily: Record<string, number>;
  hourly: Record<string, number>;
  weekly: Record<string, number>;
  short_code: string;
  total: number;
}

export default function AnalyticsPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdAt = searchParams.get('createdAt');
  const { code } = use(params);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalytics(code);
        setData(result);
      } catch (err: any) {
        if (err.message !== 'Unauthorized') {
          setError(err.message || 'Failed to load analytics');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [code]);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-zinc-500 mt-1 flex items-center gap-2">
                scaly.itsrishabh.tech/{code}
              </p>
            </div>
            {data?.short_code && (
              <a
                href={data.short_code}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent hover:underline truncate max-w-75"
                title={data.short_code}
              >
                {data.short_code}
              </a>
            )}
          </div>
        </header>

        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Clicks"
                  value={data?.total || 0}
                  icon={<MousePointerClick size={24} />}
                />
                <StatsCard
                  title="Unique Visitors"
                  value={data?.clicks ? new Set(data.clicks.map(c => c.ip)).size : 0}
                  icon={<Globe size={24} />}
                />
                <StatsCard
                  title="Platforms"
                  value="N/A" // Placeholder for future feature
                  icon={<Monitor size={24} />}
                />
                <StatsCard
                  title="Created"
                  value={createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}
                  icon={<Calendar size={24} />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ChartSection 
                    daily={data?.daily} 
                    hourly={data?.hourly} 
                    weekly={data?.weekly} 
                  />
                </div>
                <div>
                  <QRCard code={code} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <TopList 
                  title="Top Countries" 
                  data={data?.countries} 
                  emptyMessage="No country data available"
                />
                <TopList 
                  title="Top Referrers" 
                  data={data?.clicks?.reduce((acc: Record<string, number>, click) => {
                    const ref = click.referrer || 'Direct / Unknown';
                    acc[ref] = (acc[ref] || 0) + 1;
                    return acc;
                  }, {})}
                  emptyMessage="No referrer data available"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
