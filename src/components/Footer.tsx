import React from 'react';
import Link from 'next/link';
import { GithubIcon, Twitter } from "@dev.icons/react/mono";
import LinkedInIcon from '@/components/LinkedInIcon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sm:max-w-5xl w-full mx-auto border-t border-zinc-800 bg-black py-3 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-accent">Scaly</h2>

            <p className="text-zinc-600 text-xs mt-2">
              © {currentYear} Scaly. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link
              href="https://twitter.com/18Rishabh"
              target="_blank"
              className="hover:text-white transition-colors"
              title="Twitter"
            >
              <Twitter size={18} />
            </Link>

            <Link
              href="https://github.com/rishabhpandey106/scaly"
              target="_blank"
              className="hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon size={18} />
            </Link>

            <Link
              href="https://www.linkedin.com/in/rishabh-kumar-pandey-954b1a201"
              target="_blank"
              className="hover:text-white transition-colors"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}