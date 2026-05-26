import type { Metadata } from "next";
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';
import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scalyui.itsrishabh.tech'),
  verification: {
    google: "aFgROXjTSznluBIsgPA92-NGAd3oJX-txnsvHaxRP2U",
  },
  title: {
    default: "Scaly - Modern URL Shortener",
    template: "%s | Scaly"
  },
  description: "Scaly is a blazing fast, secure, and modern SaaS URL shortener and link management platform.",
  keywords: [
    "scaly",
    "scalyui",
    "url shortener",
    "link shortener",
    "link management",
    "custom short links",
    "qr code generator",
    "click analytics",
    "free url shortener",
    "golang url shortener",
    "scaly url shortener",
    "scaly analytics",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Scaly - Modern URL Shortener",
    description: "Scaly is a blazing fast, secure, and modern SaaS URL shortener and link management platform.",
    url: "https://scalyui.itsrishabh.tech",
    siteName: "Scaly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scaly URL Shortener Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scaly - Modern URL Shortener",
    description: "Scaly is a blazing fast, secure, and modern SaaS URL shortener and link management platform.",
    images: ["/og-image.png"],
    creator: "@18Rishabh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData />
      </head>
      <body className="antialiased min-h-screen flex flex-col text-white selection:bg-accent selection:text-white bg-black">
        <ShaderBackground />
        <div className="p-4 sm:p-8 bg-transparent">
          <div className="max-w-5xl mx-auto">
            <Header />
          </div>
        </div>
        <div className="flex-1 flex flex-col z-0">
          {children}
        </div>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#18181b', // zinc-900
            color: '#fff',
            border: '1px solid #27272a', // zinc-800
          }
        }} />
        <UmamiAnalytics />
      </body>
    </html>
  );
}
