import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="w-full mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-zinc-900 border ${
          error ? 'border-red-500' : 'border-zinc-700'
        } rounded-md px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
