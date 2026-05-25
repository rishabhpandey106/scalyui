import React from 'react';

interface TopListProps {
  title: string;
  data?: Record<string, number>;
  emptyMessage?: string;
}

export default function TopList({
  title,
  data = {},
  emptyMessage = 'No data available',
}: TopListProps) {
  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxCount = sortedData.length > 0 ? sortedData[0][1] : 0;

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
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />

      {/* title */}
      <h3 className="relative font-semibold text-lg text-white mb-6">
        {title}
      </h3>

      <div className="relative flex-1">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-37.5 text-white/40 text-sm">
            {emptyMessage}
          </div>
        ) : (
          <ul className="space-y-4">
            {sortedData.map(([label, count]) => (
              <li key={label} className="relative">
                {/* label row */}
                <div className="flex items-center justify-between text-sm mb-1 px-2">
                  <span className="text-white/70 font-medium truncate pr-4">
                    {label}
                  </span>
                  <span className="text-white/40 font-mono text-xs">
                    {count}
                  </span>
                </div>

                {/* background bar */}
                <div className="absolute inset-0 bg-white/5 rounded-md overflow-hidden border border-white/10">
                  <div
                    className="
                      h-full
                      bg-gradient-to-r from-white/10 to-white/5
                      rounded-md
                      transition-all duration-700 ease-out
                    "
                    style={{
                      width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                    }}
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