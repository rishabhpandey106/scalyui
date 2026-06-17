'use client';

import Link from 'next/link';
import { ArrowRight, Zap, QrCode, BarChart2, ShieldCheck, Globe, Link2, FileText, Lock } from 'lucide-react';
import { SquigglyText } from '@/components/ui/squiggly-text';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          Scaly is now live
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-white">
          Shorten. Share. <span className="text-accent">Track.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The modern URL shortener built for speed and security. Create branded links, securely host PDF documents, protect your links with passwords, and monitor real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 z-10">
          <ElectricBorder
            color="#22c55e"
            speed={1}
            chaos={0.12}
            style={{ borderRadius: 16 }}
          >
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link></ElectricBorder>
          
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-800 transition-all"
          >
            Log In to Dashboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 border-t border-zinc-800/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need in a URL shortener</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Scaly provides powerful tools to manage and track your links, designed with a premium, lightning-fast interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Link2 className="text-accent" size={24} />}
              title="Custom Aliases"
              description="Create memorable, branded short links instead of random characters to increase click-through rates."
            />
            <FeatureCard
              icon={<BarChart2 className="text-accent" size={24} />}
              title="Real-time Analytics"
              description="Track clicks, geographic locations, referrers, and device types with beautiful interactive charts."
            />
            <FeatureCard
              icon={<QrCode className="text-accent" size={24} />}
              title="QR Code Generation"
              description="Instantly generate and download high-quality QR codes for your short links for offline marketing."
            />
            <FeatureCard
              icon={<FileText className="text-accent" size={24} />}
              title="PDF Hosting"
              description="Upload and host PDF documents directly on Scaly. Share them instantly with automatically generated short links."
            />
            <FeatureCard
              icon={<Lock className="text-accent" size={24} />}
              title="Password Protection"
              description="Add an extra layer of security. Lock your sensitive URLs and PDF files behind a custom password."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-accent" size={24} />}
              title="Link Expirations"
              description="Set automatic expiration dates for time-sensitive campaigns. Links automatically deactivate when time is up."
            />
            <FeatureCard
              icon={<Zap className="text-accent" size={24} />}
              title="Lightning Fast"
              description="Built on Edge infrastructure. Redirections happen instantly, and the dashboard loads in milliseconds."
            />
            <FeatureCard
              icon={<Globe className="text-accent" size={24} />}
              title="Global Scale"
              description="Your links are distributed globally, ensuring fast redirections no matter where your users are located."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors group relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
