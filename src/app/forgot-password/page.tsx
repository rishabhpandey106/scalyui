'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // We don't care if it fails internally for user enumeration reasons.
      // A secure backend will always return 200 OK for a generic request.
      setIsSubmitted(true);
      toast.success('If an account exists, a reset link has been sent.');
    } catch (err: any) {
      toast.error('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 bg-transparent mb-8">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-center">
            <p className="text-accent font-medium mb-2">Check your email</p>
            <p className="text-sm text-zinc-400">
              We have sent a password reset link to <strong>{email}</strong> if it exists in our system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />

            <div className="mt-8">
              <Button type="submit" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
