"use client";
import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useContextApi } from '../context/contextApi';
import { GitHubProvider } from '../context/githubContext';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });

const SECRET_ROUTE = '/x7k2-management-9qp';
const SECRET_WORD = 'management';          // type this on desktop to navigate
const WINDOW_MS = 3000;                  // must be typed within 3 seconds

export default function ClientLayout({ children, myFont }) {
    const setFont = useContextApi((state) => state.setFont);
    const pathname = usePathname();
    const router = useRouter();

    // Track if current route is the secret admin route
    const isAdminRoute = pathname?.startsWith(SECRET_ROUTE);

    useEffect(() => {
        setFont(myFont.className);
    }, [setFont, myFont.className]);

    // ── Desktop: keystroke listener ───────────────────────────────────────────
    // User must type "management" within 3 seconds, anywhere on any page.
    // No button appears — direct navigation only.
    // Ignored while user is typing in an input / textarea / contenteditable.
    useEffect(() => {
        if (isAdminRoute) return; // don't listen when already in admin

        let buffer = '';
        let resetTimer = null;

        const onKeyDown = (e) => {
            // Ignore if focus is in a form field
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (['input', 'textarea', 'select'].includes(tag)) return;
            if (document.activeElement?.isContentEditable) return;

            // Only accept lowercase letters
            const char = e.key.length === 1 ? e.key.toLowerCase() : null;
            if (!char) return;

            buffer += char;

            // Keep only the last N chars matching the word length
            if (buffer.length > SECRET_WORD.length) {
                buffer = buffer.slice(-SECRET_WORD.length);
            }

            // Clear buffer if 3 seconds pass between keystrokes
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => { buffer = ''; }, WINDOW_MS);

            // Match!
            if (buffer === SECRET_WORD) {
                buffer = '';
                clearTimeout(resetTimer);
                router.push(SECRET_ROUTE);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            clearTimeout(resetTimer);
        };
    }, [isAdminRoute, router]);

    if (isAdminRoute) {
        return children;
    }

    return (
        <>
            <Suspense fallback={<div />}>
                <Header myFont={myFont} />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <GitHubProvider>
                    {children}
                </GitHubProvider>
            </Suspense>
        </>
    );
}
