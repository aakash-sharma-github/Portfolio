"use client";
import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useContextApi } from '../context/contextApi';
import { GitHubProvider } from '../context/githubContext';

// Lazy load components to improve initial load time
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition'), { ssr: false });
const StairTransation = dynamic(() => import('@/components/StairTransation'), { ssr: false });

export default function ClientLayout({ children, myFont }) {
    const setFont = useContextApi((state) => state.setFont);
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    useEffect(() => {
        setFont(myFont.className);
    }, [setFont, myFont.className]);

    if (isAdminRoute) {
        return children;
    }

    return (
        <>
            <Suspense fallback={<div />}>
                <Header myFont={myFont} />
            </Suspense>
            <Suspense fallback={<div />}>
                <StairTransation />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <PageTransition>
                    <GitHubProvider>
                        {children}
                    </GitHubProvider>
                </PageTransition>
            </Suspense>
        </>
    );
}
