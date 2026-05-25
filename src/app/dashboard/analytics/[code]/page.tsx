'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MousePointerClick,
  Globe,
  Monitor,
  Calendar,
} from 'lucide-react';
import { UAParser } from 'ua-parser-js';

import { getAnalytics } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import QRCard from '@/components/QRCard';
import ChartSection from '@/components/ChartSection';
import TopList from '@/components/TopList';
import Image from 'next/image';

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

interface ParsedClick extends ClickEvent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  platform: string;
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const createdAt = searchParams.get('createdAt');
  const pathname = usePathname();

  const params = useParams();
  const code = params.code as string;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalytics(code);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [code, pathname]);

  // Parse user agents
  const parsedClicks: ParsedClick[] = useMemo(() => {
    if (!data?.clicks) return [];

    return data.clicks.map((click) => {
      const parser = new UAParser(click.user_agent);
      const result = parser.getResult();

      const browser = result.browser.name || 'Unknown';
      const browserVersion = result.browser.version || '';

      const os = result.os.name || 'Unknown';
      const osVersion = result.os.version || '';

      const deviceVendor = result.device.vendor || '';
      const deviceModel = result.device.model || '';
      const deviceType = result.device.type || 'Desktop';

      let device = 'Desktop';

      if (deviceVendor || deviceModel) {
        device = `${deviceVendor} ${deviceModel}`.trim();
      } else if (deviceType) {
        device = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
      }

      return {
        ...click,
        browser,
        browserVersion,
        os,
        osVersion,
        device,
        platform: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
      };
    });
  }, [data]);

  // Helper reducer
  const createStats = (arr: string[]) => {
    return arr.reduce((acc: Record<string, number>, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  };

  const platformStats = useMemo(() => {
    return createStats(parsedClicks.map((c) => c.platform));
  }, [parsedClicks]);

  const browserStats = useMemo(() => {
    return createStats(parsedClicks.map((c) => c.browser));
  }, [parsedClicks]);

  const osStats = useMemo(() => {
    return createStats(parsedClicks.map((c) => c.os));
  }, [parsedClicks]);

  const deviceStats = useMemo(() => {
    return createStats(parsedClicks.map((c) => c.device));
  }, [parsedClicks]);

  const referrerStats = useMemo(() => {
    return parsedClicks.reduce((acc: Record<string, number>, click) => {
      const ref = click.referrer || 'Direct / Unknown';
      acc[ref] = (acc[ref] || 0) + 1;
      return acc;
    }, {});
  }, [parsedClicks]);

  if (error) {
    return (
      <div className="min-h-auto flex items-center justify-center bg-linear-to-br px-4 py-8">

        <div className="backdrop-blur-xl bg-white/5 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)] rounded-2xl p-6 md:p-10 flex flex-col items-center gap-5 max-w-md w-full">

          <div className="relative">
            <Image
              src="/deny.png"
              alt="Access Denied"
              width={300}
              height={300}
              className="rounded-xl object-contain"
            />

            {/* glow effect */}
            <div className="absolute inset-0 blur-2xl bg-green-500/10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white sm:pb-16 bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 pl-4 sm:pl-0">
          <Link
            href="/links"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Links
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>

              <p className="text-zinc-500 mt-1 flex items-center gap-2">
                {process.env.NEXT_PUBLIC_API_URL}/{code}
              </p>
            </div>

            {data?.short_code && (
              <a
                href={data.short_code}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent hover:underline truncate max-w-[200px] sm:max-w-[300px]"
                title={data.short_code}
              >
                {data.short_code}
              </a>
            )}
          </div>
        </header>

        {/* Main */}
        <main>
          {isLoading ? (
            <>
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pl-2 sm:pl-0">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="
          relative
          h-28
          rounded-2xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          overflow-hidden
        "
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-40 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Charts + QR Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="
            relative
            h-64
            rounded-2xl
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            overflow-hidden
          "
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-white/10 via-transparent to-white/5 opacity-30 animate-pulse" />
                    </div>
                  ))}
                </div>

                <div
                  className="
        relative
        h-64
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        overflow-hidden
      "
                >
                  <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-40 animate-pulse" />
                </div>
              </div>

              {/* Lists Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="
          relative
          h-60
          rounded-2xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          overflow-hidden
        "
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 opacity-30 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Bottom Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="
          relative
          h-52
          rounded-2xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          overflow-hidden
        "
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-40 animate-pulse" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pl-2 sm:pl-0 pr-2 sm:pr-0">
                <StatsCard
                  title="Total Clicks"
                  value={data?.total || 0}
                  icon={<MousePointerClick size={24} />}
                />

                <StatsCard
                  title="Unique Visitors"
                  value={
                    data?.clicks
                      ? new Set(data.clicks.map((c) => c.ip)).size
                      : 0
                  }
                  icon={<Globe size={24} />}
                />

                <StatsCard
                  title="Platforms"
                  value={Object.keys(platformStats || {}).length}
                  icon={<Monitor size={24} />}
                />

                <StatsCard
                  title="Created"
                  value={
                    createdAt
                      ? new Date(createdAt).toLocaleDateString()
                      : 'Unknown'
                  }
                  icon={<Calendar size={24} />}
                />
              </div>

              {/* Charts + QR */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pl-2 sm:pl-0 pr-2 sm:pr-0">
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

              {/* Country + Referrer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pl-2 sm:pl-0 pr-2 sm:pr-0">
                <TopList
                  title="Top Countries"
                  data={data?.countries}
                  emptyMessage="No country data available"
                />

                <TopList
                  title="Top Referrers"
                  data={referrerStats}
                  emptyMessage="No referrer data available"
                />
              </div>

              {/* Device Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8 pl-2 sm:pl-0 pr-2 sm:pr-0">
                <TopList
                  title="Platforms"
                  data={platformStats}
                  emptyMessage="No platform data"
                />

                <TopList
                  title="Browsers"
                  data={browserStats}
                  emptyMessage="No browser data"
                />

                <TopList
                  title="Operating Systems"
                  data={osStats}
                  emptyMessage="No OS data"
                />

                <TopList
                  title="Devices"
                  data={deviceStats}
                  emptyMessage="No device data"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}