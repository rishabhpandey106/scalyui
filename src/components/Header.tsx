'use client';

import Link from 'next/link';
import { isAuthenticated, logout } from '@/lib/auth';
import { SquigglyText } from '@/components/ui/squiggly-text';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import UserDropdown from '@/components/UserDropdown';
import { getCurrentUser } from '@/lib/api';

export default function Header() {
    const [isAuth, setIsAuth] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const authed = isAuthenticated();
            setIsAuth(authed);
            setMounted(true);

            if (authed) {
                setIsLoadingUser(true);
                try {
                    const user = await getCurrentUser();
                    setUserData(user);
                } catch (error) {
                    // Fail silently. fetchWithAuth already handles 401 Unauthorized by logging out.
                    // If it's a 500 or 404, we don't want to force log out.
                    // logout();
                    console.log('User data fetch failed, but keeping session active.');
                } finally {
                    setIsLoadingUser(false);
                }
            } else {
                setUserData(null);
            }
        };

        checkAuth();
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
                            
                            {isLoadingUser ? (
                                <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 animate-pulse" />
                            ) : userData ? (
                                <UserDropdown user={userData} />
                            ) : (
                                <Link href="/dashboard" className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                                    Dashboard
                                </Link>
                            )}
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
