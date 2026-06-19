'use client';

import React, { useState, useEffect } from 'react';
import { Book, Link2, FileText, LayoutTemplate, BarChart2, ShieldCheck, HelpCircle, Code } from 'lucide-react';

// FAQ Schema for SEO
const faqData = [
  {
    question: "What is a URL shortener and how does Scaly work?",
    answer: "A URL shortener converts long, complex web addresses into clean, manageable links. Scaly takes this further by offering custom aliases, password protection, and real-time click tracking analytics for every link you generate."
  },
  {
    question: "Can I host PDF documents on Scaly?",
    answer: "Yes! Scaly offers blazing fast, secure PDF hosting. Simply upload your PDF document, and we will instantly generate a short link that you can share with your audience. You can even protect your PDFs with custom passwords."
  },
  {
    question: "What is a Link-in-Bio profile?",
    answer: "A Link-in-Bio profile is a mobile-optimized landing page that houses all your important links in one place. Scaly's Link-in-Bio feature allows you to create beautifully themed profiles without writing any code, perfect for Instagram, TikTok, and Twitter."
  },
  {
    question: "Are my links secure?",
    answer: "Absolutely. Scaly runs on edge infrastructure ensuring instant redirects. For sensitive content, you can enable Password Protection to ensure only authorized users can access your short links or hosted PDFs."
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'shortening', 'pdf-hosting', 'link-in-bio', 'analytics', 'api', 'faq'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const NavItem = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <button
      onClick={() => scrollTo(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${activeSection === id
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
    >
      <Icon size={16} />
      {title}
    </button>
  );

  return (
    <>
      {/* Inject FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <div className="min-h-screen bg-black text-zinc-300 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col md:flex-row gap-12">

          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-1 bg-zinc-950/50 p-4 border border-zinc-800/50 rounded-2xl backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 px-2">Documentation</h3>
              <NavItem id="introduction" icon={Book} title="Introduction" />
              <NavItem id="shortening" icon={Link2} title="URL Shortening" />
              <NavItem id="pdf-hosting" icon={FileText} title="PDF Hosting" />
              <NavItem id="link-in-bio" icon={LayoutTemplate} title="Link-in-Bio Profiles" />
              <NavItem id="analytics" icon={BarChart2} title="Real-time Analytics" />
              <NavItem id="api" icon={Code} title="REST API Access" />
              <NavItem id="faq" icon={HelpCircle} title="FAQ" />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 max-w-3xl prose prose-invert prose-emerald">

            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24 mb-16">
              <h1 className="text-4xl font-extrabold text-white mb-6">Scaly Documentation</h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Welcome to the official documentation for <strong>Scaly</strong> — the modern, blazing-fast SaaS URL shortener and link management platform. Whether you are looking to create custom branded links, host secure PDFs, or build a beautiful Link-in-Bio profile, this guide covers everything you need to know.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-8">
                <h4 className="text-accent font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={20} /> Edge Optimized
                </h4>
                <p className="text-sm m-0">Scaly is built on cutting-edge global infrastructure. Every redirect happens instantly, and your analytics are tracked in real-time with zero latency.</p>
              </div>
            </section>

            {/* URL Shortening */}
            <section id="shortening" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Link2 className="text-accent" /> URL Shortening & Aliases
              </h2>
              <p className="mb-4">
                The core of Scaly is generating clean, shareable short links. Instead of sending users long, tracking-heavy URLs, you can compress them into sleek <code>scalyui.itsrishabh.tech/custom-alias</code> formats.
              </p>
              <ul className="space-y-3 list-disc list-inside text-zinc-400 mb-6">
                <li><strong>Custom Aliases:</strong> Define exactly what the tail of your URL looks like (e.g., <code>/summer-sale</code>).</li>
                <li><strong>Temporary Links:</strong> Create time-limited short links that automatically expire after a set period.</li>
                <li><strong>Password Protection:</strong> Lock your destination URL behind a custom password. Visitors must enter the correct password before they are redirected.</li>
                <li><strong>QR Code Generation:</strong> Every short link automatically generates a downloadable, high-quality QR code perfect for offline marketing.</li>
              </ul>
            </section>

            {/* PDF Hosting */}
            <section id="pdf-hosting" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="text-accent" /> Secure PDF Hosting
              </h2>
              <p className="mb-4">
                Stop relying on clunky third-party drives to share documents. Scaly allows you to upload PDF files directly to our secure servers and instantly generates a tracking-enabled short link.
              </p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h4 className="text-white font-semibold mb-2">How to host a PDF:</h4>
                <ol className="space-y-2 text-sm text-zinc-400 m-0 list-decimal list-inside">
                  <li>Navigate to the <strong>Upload PDF</strong> tab in your Dashboard.</li>
                  <li>Select your PDF file from your device.</li>
                  <li>(Optional) Set a custom alias and a secure password.</li>
                  <li>Click Generate. Share the resulting link with your audience!</li>
                </ol>
              </div>
            </section>

            {/* Link-in-Bio */}
            <section id="link-in-bio" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <LayoutTemplate className="text-accent" /> Link-in-Bio Profiles
              </h2>
              <p className="mb-4">
                A single link for everything. Your Scaly Link-in-Bio profile is a beautiful, mobile-optimized landing page designed to house all of your important URLs—perfect for your Instagram, TikTok, or Twitter bio.
              </p>
              <ul className="space-y-3 list-disc list-inside text-zinc-400">
                <li><strong>Instant Setup:</strong> Choose a unique username to claim your URL (e.g., <code>/bio/yourname</code>).</li>
                <li><strong>Custom Theming:</strong> Pick custom accent colors to match your personal brand or corporate identity.</li>
                <li><strong>Dynamic Link Management:</strong> Add or hide short links from your bio dashboard instantly.</li>
                <li><strong>OpenGraph Support:</strong> When your bio is shared on social media, Scaly generates a custom dynamic preview image showcasing your profile.</li>
              </ul>
            </section>

            {/* Analytics */}
            <section id="analytics" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart2 className="text-accent" /> Real-time Analytics
              </h2>
              <p className="mb-4">
                Knowledge is power. Every time a user clicks your Scaly link, visits your bio page, or scans your QR code, we log the event in real-time.
              </p>
              <p className="text-zinc-400">
                Navigate to your Analytics Dashboard to view beautiful, interactive charts detailing exactly where your traffic is coming from, allowing you to optimize your marketing campaigns.
              </p>
            </section>

            {/* API */}
            <section id="api" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Code className="text-accent" /> REST API Access
              </h2>
              <p className="mb-4">
                For developers, Scaly's Go-powered backend is designed as a strict JSON REST API, allowing you to easily integrate link shortening directly into your own applications.
              </p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-4">
                <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-400">
                  POST /api/v1/urls
                </div>
                <div className="p-4 text-sm font-mono text-zinc-300">
                  <pre>{`{
  "original_url": "https://example.com/very/long/path",
  "custom_alias": "promo-2026",
  "password": "secret_password"
}`}</pre>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <HelpCircle className="text-accent" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-2">{faq.question}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed m-0">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
