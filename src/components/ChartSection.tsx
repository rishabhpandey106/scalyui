'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartSectionProps {
  daily?: Record<string, number>;
  hourly?: Record<string, number>;
  weekly?: Record<string, number>;
}

type ViewType = 'hourly' | 'daily' | 'weekly';

export default function ChartSection({
  daily = {},
  hourly = {},
  weekly = {},
}: ChartSectionProps) {
  const [view, setView] = useState<ViewType>('daily');

  const chartData = useMemo(() => {
    let rawData: Record<string, number> = {};

    if (view === 'hourly') rawData = hourly;
    else if (view === 'daily') rawData = daily;
    else rawData = weekly;

    const data = Object.entries(rawData).map(([label, value]) => ({
      label,
      value,
    }));

    data.sort(
      (a, b) => new Date(a.label).getTime() - new Date(b.label).getTime()
    );

    return data;
  }, [view, daily, hourly, weekly]);

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
        w-full
        h-100
        flex flex-col
        hover:border-white/20
        transition-all
      "
    >
      {/* glow overlay */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />

      {/* header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-semibold text-lg text-white">
          Click Analytics
          <span className="text-white/40 text-sm">
            {view === 'hourly'
              ? ' (Last 24 Hours)'
              : view === 'daily'
              ? ' (Last 7 Days)'
              : ' (Last 90 Days)'}
          </span>
        </h3>

        {/* toggle */}
        <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-lg border border-white/10">
          {(['hourly', 'daily', 'weekly'] as ViewType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`
                px-4 py-1.5 text-sm rounded-md capitalize transition-all
                ${
                  view === tab
                    ? 'bg-white/10 text-white shadow'
                    : 'text-white/40 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* chart */}
      <div className="relative flex-1 min-h-0 w-full">
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            No data available for this view
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="glassGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.08)"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickMargin={10}
                minTickGap={20}
                tickFormatter={(val) =>
                  view === 'hourly'
                    ? val.split(' ')[1]?.substring(0, 5) || val
                    : val
                }
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(24,24,27,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
                itemStyle={{
                  color: '#22c55e',
                  fontWeight: 600,
                }}
                labelStyle={{
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '4px',
                }}
                formatter={(value: any) => [`${value} Clicks`, '']}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#glassGreen)"
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}