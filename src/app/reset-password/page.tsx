'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If there's no token in the URL, don't show the form
  if (!token) {
    return (
      <div className="text-center">
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 font-medium">Invalid or missing reset link.</p>
        </div>
        <Link 
          href="/forgot-password" 
          className="text-accent hover:underline text-sm font-medium"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to reset password. Link may be expired.');
      }

      toast.success('Password successfully reset! Please log in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <div className="mt-8">
        <Button type="submit" isLoading={isLoading}>
          Reset Password
        </Button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 bg-transparent mb-8">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
          <p className="text-zinc-400 text-sm">
            Please enter your new secure password below.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
