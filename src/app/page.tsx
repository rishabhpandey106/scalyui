'use client';

import Link from 'next/link';
import { ArrowRight, Zap, QrCode, BarChart2, ShieldCheck, Link2, FileText, Lock, LayoutTemplate, Share2, MousePointerClick, Smartphone } from 'lucide-react';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          Scaly Link-in-Bio is now live
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-white">
          Shorten. Share. <span className="text-accent">Showcase.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The modern platform built for speed and security. Create branded links, securely host PDFs, and build beautiful Link-in-Bio profiles instantly.
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

      {/* NEW: Link-in-Bio Showcase Section */}
      <section className="py-24 px-4 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 border border-accent/20">
                <LayoutTemplate size={16} /> New Feature
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">Your single link for everything.</h2>
              <p className="text-zinc-400 text-lg sm:text-xl mb-8 leading-relaxed">
                Connect your audiences to all your content with just one link. Scaly's powerful new Link-in-Bio feature lets you curate a beautiful, mobile-optimized landing page in seconds.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Zap className="text-accent" size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-white mb-1">Instant Setup</h4>
                    <p className="text-zinc-500">Pick a theme, add your short links, and launch your page instantly without writing a single line of code.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <BarChart2 className="text-accent" size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-white mb-1">Centralized Analytics</h4>
                    <p className="text-zinc-500">Track all your traffic from Instagram, TikTok, and Twitter from one centralized dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="flex-1 relative w-full flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="relative w-[280px] h-[580px] bg-black border-[8px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center pt-10 px-4">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-6 bg-zinc-900 rounded-b-xl"></div>

                {/* Mockup UI */}
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, green, #000)`,
                    boxShadow: `
      inset 0 0 0 2px rgba(255,255,255,0.1),
      0 25px 50px -12px rgba(0,0,0,0.5)
    `,
                  }}
                >
                  <span className="text-2xl font-bold text-white">R</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">RISHABH</h3>
                <p className="text-xs text-zinc-400 mb-8 text-center px-4">Software Developer & Designer. Building cool things on the internet.</p>

                <div className="w-full space-y-3">
                  <div className="w-full py-3 px-4 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">My Portfolio</span>
                  </div>
                  <div className="w-full py-3 px-4 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">Latest YouTube Video</span>
                  </div>
                  <div className="w-full py-3 px-4 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">Download Resume (PDF)</span>
                  </div>
                </div>

                <div className="mt-auto mb-6 opacity-50">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Powered By Scaly</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: How It Works */}
      <section className="py-24 px-4 border-t border-zinc-800/50 bg-black relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Scaly Works</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">From long URLs to beautifully managed campaigns in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-accent/50 to-transparent -translate-y-1/2 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-zinc-950 border border-zinc-800/50 rounded-2xl hover:border-accent/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform">
                <Link2 size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Shorten & Secure</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Paste your long URLs or upload PDFs. Add custom aliases, passwords, or expiry dates to secure your content.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-zinc-950 border border-zinc-800/50 rounded-2xl hover:border-accent/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform">
                <Share2 size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Build & Share</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Map your generated links to your sleek Link-in-Bio profile or generate QR codes for offline campaigns.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-zinc-950 border border-zinc-800/50 rounded-2xl hover:border-accent/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform">
                <MousePointerClick size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Track & Analyze</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Monitor your traffic in real-time. See exactly where your audiences are coming from and what they click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 border-t border-zinc-800/50 relative z-10 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need in one platform</h2>
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
              icon={<LayoutTemplate className="text-accent" size={24} />}
              title="Link-in-Bio Profiles"
              description="Design a beautiful, mobile-first landing page aggregating all your important links in one place."
            />
            <FeatureCard
              icon={<FileText className="text-accent" size={24} />}
              title="PDF Hosting"
              description="Upload and host PDF documents directly on Scaly. Share them instantly with generated short links."
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
          </div>
        </div>
      </section>

      {/* NEW: Bottom CTA */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 p-10 sm:p-16 text-center">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-accent/10 blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">Ready to scale your links?</h2>
              <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
                Join thousands of creators and professionals who use Scaly to manage their links, PDFs, and bio profiles efficiently.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-black font-bold text-lg rounded-xl hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105"
              >
                Create Your Free Account <ArrowRight size={20} />
              </Link>
            </div>
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
