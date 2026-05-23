'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartSectionProps {
  daily?: Record<string, number>;
  hourly?: Record<string, number>;
  weekly?: Record<string, number>;
}

type ViewType = 'hourly' | 'daily' | 'weekly';

export default function ChartSection({ daily = {}, hourly = {}, weekly = {} }: ChartSectionProps) {
  const [view, setView] = useState<ViewType>('daily');

  const chartData = useMemo(() => {
    let rawData: Record<string, number> = {};
    if (view === 'hourly') rawData = hourly || {};
    else if (view === 'daily') rawData = daily || {};
    else if (view === 'weekly') rawData = weekly || {};

    const data = Object.entries(rawData).map(([label, value]) => ({
      label,
      value
    }));

    // Sort chronologically (assuming label strings are sortable dates/times like YYYY-MM-DD or YYYY-MM-DD HH:mm:ss)
    data.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
    
    return data;
  }, [view, daily, hourly, weekly]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm w-full h-100 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-semibold text-lg text-white">Click Analytics</h3>
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
          {(['hourly', 'daily', 'weekly'] as ViewType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-all duration-200 ${
                view === tab 
                  ? 'bg-zinc-800 text-white shadow' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            No data available for this view
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickMargin={10}
                minTickGap={20}
                tickFormatter={(val) => {
                  if (view === 'hourly') {
                    // Extract HH:mm from YYYY-MM-DD HH:mm:ss
                    return val.split(' ')[1]?.substring(0, 5) || val;
                  }
                  return val;
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#22c55e', fontWeight: 600 }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                formatter={(value: any) => [`${value} Clicks`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
