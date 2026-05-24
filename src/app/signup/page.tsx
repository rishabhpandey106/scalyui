'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { signup } from '@/lib/api';
import { setToken } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError('');

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = await signup(email, password);
      if (data.token) {
        setToken(data.token);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-auto items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-zinc-400">Get started with Scaly</p>
        </div>

        {/* {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm text-center">
            {error}
          </div>
        )} */}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />

          <div className="mt-8">
            <Button type="submit" isLoading={isLoading}>
              Sign Up
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-zinc-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
