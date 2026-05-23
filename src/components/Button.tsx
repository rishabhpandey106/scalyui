import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function Button({ children, isLoading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full flex items-center justify-center bg-accent text-black font-semibold rounded-md py-2 px-4 hover:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader className="mr-2 text-black" /> : null}
      {children}
    </button>
  );
}
