'use client';
// context/githubContext.js
//
// Provides real-time GitHub stats (repoCount, totalCommits) to the whole app.
//
// Usage:
//   1. Wrap your layout with <GitHubProvider> (see below)
//   2. In any client component: const { data } = useGitHub();
//      data.repoCount    → number of owned (non-fork) repos
//      data.totalCommits → total commits across all owned repos
//
// The provider:
//   - Fetches from /api/github-stats on first render (client-side)
//   - Falls back to DEFAULT_STATS if the API call fails
//   - Exposes isLoading and error so you can handle states gracefully

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';

// ─── Defaults ─────────────────────────────────────────────────────────────────
// Shown immediately on first render while the real data loads.
// Update these to match your current real numbers so there's no jarring jump.
const DEFAULT_STATS = { repoCount: 35, totalCommits: 350 };

// ─── Context ──────────────────────────────────────────────────────────────────
const GitHubContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * @param {{ children: React.ReactNode }} props
 */
export const GitHubProvider = ({ children }) => {
    const [data, setData] = useState(DEFAULT_STATS);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/github-stats', {
                // Always ask the server — the server-side cache handles deduplication.
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error(`GitHub stats API responded with ${res.status}`);
            }

            const json = await res.json();
            const { repoCount, totalCommits } = json ?? {};

            // Shape guard — only update state when we have real numbers
            if (
                typeof repoCount === 'number' && repoCount >= 0 &&
                typeof totalCommits === 'number' && totalCommits >= 0
            ) {
                setData({ repoCount, totalCommits });
            } else {
                console.warn('[GitHubProvider] Unexpected response shape:', json);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.warn('[GitHubProvider] Fetch error:', err.message);
                setError(err.message);
                // Keep showing DEFAULT_STATS on error — don't reset to zeros
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch once on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchStats();
    }, [fetchStats]);

    const value = {
        data,
        isLoading,
        error,
        /** Call this to manually refresh stats (e.g. after pushing a new repo) */
        revalidate: fetchStats,
    };

    return (
        <GitHubContext.Provider value={value}>
            {children}
        </GitHubContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access GitHub stats inside any client component.
 * Must be used inside <GitHubProvider>.
 *
 * @returns {{
 *   data: { repoCount: number, totalCommits: number },
 *   isLoading: boolean,
 *   error: string | null,
 *   revalidate: () => Promise<void>
 * }}
 */
export const useGitHub = () => {
    const ctx = useContext(GitHubContext);
    if (!ctx) {
        throw new Error('useGitHub must be used inside <GitHubProvider>');
    }
    return ctx;
};