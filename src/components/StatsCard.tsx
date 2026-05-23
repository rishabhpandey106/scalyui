import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:border-zinc-700 transition-colors">
      <div className="p-3 bg-zinc-950 rounded-xl text-accent border border-zinc-800">
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
