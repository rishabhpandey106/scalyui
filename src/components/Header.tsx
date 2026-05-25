'use client';

import Link from 'next/link';
import { logout, isAuthenticated } from '@/lib/auth';
import { SquigglyText } from '@/components/ui/squiggly-text';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isAuth, setIsAuth] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Re-check authentication whenever the route changes (e.g. login -> dashboard)
        setIsAuth(isAuthenticated());
        setMounted(true);
    }, [pathname]);

    return (
        <header className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-4">
            <Link href="/" className="text-2xl font-bold text-accent tracking-tight hover:opacity-80 transition-opacity">
                <SquigglyText scale={2} className="text-accent">
                    Scaly
                </SquigglyText>
            </Link>

            <div className="flex items-center gap-4">
                {mounted && (
                    isAuth ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup" className="text-sm px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg hover:bg-accent/20 transition-colors">
                                Sign up
                            </Link>
                        </>
                    )
                )}
            </div>
        </header>
    );
}