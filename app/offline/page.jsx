'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiWifi, FiRefreshCw, FiArrowRight } from 'react-icons/fi';

export default function OfflinePage() {
    const [isRetrying, setIsRetrying] = useState(false);
    const [isOnline,   setIsOnline]   = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const up   = () => setIsOnline(true);
        const down = () => setIsOnline(false);
        window.addEventListener('online',  up);
        window.addEventListener('offline', down);
        return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
    }, []);

    const handleRetry = async () => {
        setIsRetrying(true);
        await new Promise(r => setTimeout(r, 800));
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md text-center"
            >
                <div className="flex justify-center mb-8">
                    <div className="relative w-24 h-24 rounded-3xl bg-accent/10 border-2
                                    border-accent/20 flex items-center justify-center">
                        <FiWifi className="text-4xl text-accent/50" />
                        <span className="absolute inset-0 rounded-3xl border-2 border-accent/20 animate-ping opacity-40" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">You&apos;re offline</h1>
                <p className="text-white/55 text-base leading-relaxed mb-2">
                    This page isn&apos;t available without a connection right now.
                </p>
                <p className="text-white/35 text-sm mb-10">
                    Pages you&apos;ve visited before will load normally — try one below.
                </p>

                <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase
                                 tracking-widest px-4 py-2 rounded-full mb-8 transition-all duration-300
                                 ${isOnline
                                     ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                                     : 'bg-red-500/10 text-red-400/70 border border-red-500/15'
                                 }`}>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400/60'}`} />
                    {isOnline ? 'Back online — ready to retry' : 'No internet connection'}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="flex items-center justify-center gap-2.5 w-full py-3.5
                                   bg-accent hover:bg-accent/80 disabled:bg-accent/40
                                   disabled:cursor-not-allowed text-white font-semibold
                                   rounded-xl transition-all duration-200"
                    >
                        <FiRefreshCw className={`text-base ${isRetrying ? 'animate-spin' : ''}`} />
                        {isRetrying ? 'Retrying…' : 'Try Again'}
                    </button>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                            { href: '/',       label: 'Home'     },
                            { href: '/work',   label: 'Projects' },
                            { href: '/blog',   label: 'Blog'     },
                            { href: '/resume', label: 'Resume'   },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href}
                                className="flex items-center justify-between px-4 py-3
                                           bg-white/4 hover:bg-white/8 border border-white/8
                                           hover:border-accent/30 text-white/65 hover:text-accent
                                           rounded-xl text-sm font-medium transition-all duration-150">
                                {label}
                                <FiArrowRight className="text-xs opacity-60" />
                            </Link>
                        ))}
                    </div>
                </div>

                <p className="mt-10 text-white/20 text-xs">Aakash Sharma · aakashsharma.com.np</p>
            </motion.div>
        </div>
    );
}
