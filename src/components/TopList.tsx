import React from 'react';

interface TopListProps {
  title: string;
  data?: Record<string, number>;
  emptyMessage?: string;
}

export default function TopList({ title, data = {}, emptyMessage = 'No data available' }: TopListProps) {
  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .slice(0, 10); // Show top 10

  const maxCount = sortedData.length > 0 ? sortedData[0][1] : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="font-semibold text-lg text-white mb-6">{title}</h3>
      
      <div className="flex-1">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-37.5 text-zinc-500">
            {emptyMessage}
          </div>
        ) : (
          <ul className="space-y-4">
            {sortedData.map(([label, count]) => (
              <li key={label} className="relative">
                <div className="flex items-center justify-between text-sm mb-1 z-10 relative px-2">
                  <span className="text-zinc-300 font-medium truncate pr-4">{label}</span>
                  <span className="text-zinc-400 font-mono text-xs">{count}</span>
                </div>
                {/* Background progress bar */}
                <div className="absolute inset-0 bg-zinc-950 rounded-md overflow-hidden border border-zinc-800/50">
                  <div 
                    className="h-full bg-zinc-800 rounded-md transition-all duration-1000 ease-out" 
                    style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
