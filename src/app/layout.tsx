import type { Metadata } from "next";
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";
import Header from '@/components/Header';
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
  title: "Scaly",
  description: "Modern SaaS Application",
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
      </body>
    </html>
  );
}
