'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { login, loginWithGoogle } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
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
      const data = await login(email, password);
      if (data.token) {
        setToken(data.token);
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-auto items-center justify-center p-4 bg-transparent mb-8">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Log in to your Scaly account</p>
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
          
          <div className="relative">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <div className="absolute right-0 top-0">
              <Link 
                href="/forgot-password" 
                className="text-xs text-accent hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-px bg-zinc-800 w-full"></span>
          <span className="text-zinc-500 text-sm">OR</span>
          <span className="h-px bg-zinc-800 w-full"></span>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) return;
              
              setIsLoading(true);
              try {
                const data = await loginWithGoogle(credentialResponse.credential);
                if (data.token) {
                  // Keep existing JWT storage mechanism
                  setToken(data.token);
                  toast.success('Logged in with Google!');
                  router.push('/dashboard');
                } else {
                  throw new Error('No token received from backend');
                }
              } catch (err: any) {
                toast.error(err.message || 'Google login failed');
              } finally {
                setIsLoading(false);
              }
            }}
            onError={() => {
              toast.error('Google Login Failed');
            }}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
          />
        </div>

        <p className="mt-6 text-center text-zinc-400 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
