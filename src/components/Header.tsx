'use client';

import Link from 'next/link';
import { logout, isAuthenticated } from '@/lib/auth';
import { SquigglyText } from '@/components/ui/squiggly-text';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isAuth, setIsAuth] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Re-check authentication whenever the route changes (e.g. login -> dashboard)
        setIsAuth(isAuthenticated());
    }, [pathname]);

    return (
        <header className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-4">
            <div className="text-2xl font-bold text-accent tracking-tight">
                <SquigglyText scale={2} className="text-accent">
                    Scaly
                </SquigglyText>
            </div>

            <div className="flex items-center gap-4">

                {isAuth && (
                    <button
                        onClick={logout}
                        className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg"
                    >
                        Log out
                    </button>
                )}
            </div>
        </header>
    );
}