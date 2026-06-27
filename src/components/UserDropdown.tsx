'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { logout } from '@/lib/auth';

interface UserData {
  id: number;
  email: string;
  avatar_url?: string;
  auth_provider: string;
}

interface UserDropdownProps {
  user: UserData;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstLetter = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 transition-all focus:outline-none overflow-hidden"
      >
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-zinc-300 font-semibold text-sm">{firstLetter}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-zinc-800/50">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-zinc-500 capitalize mt-0.5">{user.auth_provider} Account</p>
          </div>
          
          <div className="p-1">
            <Link 
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <LayoutDashboard size={16} className="mr-2 opacity-70" />
              Dashboard
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center w-full px-3 py-2 mt-1 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} className="mr-2 opacity-70" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
