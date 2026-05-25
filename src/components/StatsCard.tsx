import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="
      relative
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      p-6
      flex items-center gap-4
      shadow-lg
      hover:border-white/20
      transition-all
    ">
      {/* subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 to-transparent opacity-30 pointer-events-none" />

      <div className="relative p-3 bg-white/5 rounded-xl border border-white/10 text-accent">
        {icon}
      </div>

      <div className="relative">
        <p className="text-white/60 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}