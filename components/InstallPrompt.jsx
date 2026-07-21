'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiShare } from 'react-icons/fi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';

const DISMISSED_KEY = 'pwa-install-dismissed';

export default function InstallPrompt() {
    const [installEvent, setInstallEvent] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showIos, setShowIos] = useState(false);
    const [showFirefox, setShowFirefox] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(DISMISSED_KEY)) return;

        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        if (isStandalone) return;

        const ua = navigator.userAgent;

        // ── iOS Safari ──────────────────────────────────────────────────────
        const isIos = /iphone|ipad|ipod/i.test(ua);
        const isSafari = /safari/i.test(ua) && !/crios|fxios|opios|chrome/i.test(ua);
        if (isIos && isSafari && !window.navigator.standalone) {
            const t = setTimeout(() => setShowIos(true), 5000);
            return () => clearTimeout(t);
        }

        // ── Firefox ─────────────────────────────────────────────────────────
        // Firefox never fires beforeinstallprompt — it intentionally does not
        // support the install prompt API (as of 2025). Show manual instructions
        // directing users to use the Firefox menu on Android, or the extension
        // "PWAs for Firefox" on desktop.
        const isFirefox = /firefox/i.test(ua) && !/seamonkey/i.test(ua);
        if (isFirefox) {
            const t = setTimeout(() => setShowFirefox(true), 5000);
            return () => clearTimeout(t);
        }

        // ── Chrome / Edge / Samsung / Opera (Chromium) ──────────────────────
        const handler = (e) => {
            e.preventDefault();
            setInstallEvent(e);
            setTimeout(() => setShowBanner(true), 4000);
        };
        const onInstalled = () => { setShowBanner(false); setInstallEvent(null); };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!installEvent) return;
        setIsInstalling(true);
        try {
            await installEvent.prompt();
            const { outcome } = await installEvent.userChoice;
            if (outcome === 'accepted') setShowBanner(false);
        } catch (err) {
            console.warn('[InstallPrompt]', err.message);
        } finally {
            setIsInstalling(false);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        setShowIos(false);
        setShowFirefox(false);
        sessionStorage.setItem(DISMISSED_KEY, '1');
    };

    return (
        <AnimatePresence>
            {/* ── Chrome / Edge / Android install banner ── */}
            {showBanner && installEvent && (
                <motion.div
                    key="install-banner"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="fixed bottom-4 left-4 right-4 z-[80] max-w-sm mx-auto
                               sm:left-auto sm:right-4 sm:max-w-xs"
                >
                    <div className="bg-[#1e1e28] border border-accent/30 rounded-2xl
                                    shadow-2xl shadow-black/50 p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25
                                            flex items-center justify-center flex-shrink-0">
                                <HiDevicePhoneMobile className="text-accent text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm leading-snug">
                                    Install Portfolio App
                                </p>
                                <p className="text-white/45 text-xs mt-0.5 leading-relaxed">
                                    Add to your home screen — works offline too.
                                </p>
                            </div>
                            <button onClick={handleDismiss} aria-label="Dismiss"
                                className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0 mt-0.5">
                                <FiX size={16} />
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button onClick={handleDismiss}
                                className="flex-1 py-2 text-xs font-semibold text-white/45
                                           hover:text-white/70 transition-colors rounded-lg
                                           bg-white/5 hover:bg-white/8">
                                Not now
                            </button>
                            <button onClick={handleInstall} disabled={isInstalling}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2
                                           text-xs font-bold text-white bg-accent hover:bg-accent/80
                                           disabled:bg-accent/40 disabled:cursor-not-allowed
                                           rounded-lg transition-all duration-200">
                                {isInstalling
                                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <FiDownload size={12} />}
                                {isInstalling ? 'Installing…' : 'Install'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── iOS Safari manual instructions ── */}
            {showIos && (
                <motion.div
                    key="ios-banner"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="fixed bottom-4 left-4 right-4 z-[80] max-w-sm mx-auto"
                >
                    <div className="bg-[#1e1e28] border border-accent/30 rounded-2xl
                                    shadow-2xl shadow-black/50 p-4 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <HiDevicePhoneMobile className="text-accent text-lg" />
                                <p className="text-white font-semibold text-sm">Install on iPhone</p>
                            </div>
                            <button onClick={handleDismiss} aria-label="Dismiss"
                                className="text-white/30 hover:text-white/70 transition-colors">
                                <FiX size={16} />
                            </button>
                        </div>
                        <ol className="space-y-2">
                            {[
                                { icon: <FiShare size={13} />, text: 'Tap the Share button in Safari' },
                                { icon: <span className="text-xs font-bold">+</span>, text: 'Select "Add to Home Screen"' },
                                { icon: <span className="text-xs">✓</span>, text: 'Tap "Add" — done!' },
                            ].map(({ icon, text }, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/25
                                                     flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                                        {icon}
                                    </span>
                                    <span className="text-white/60 text-xs leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ol>
                        <button onClick={handleDismiss}
                            className="mt-3 w-full py-2 text-xs font-semibold text-white/40
                                       hover:text-white/60 transition-colors rounded-lg bg-white/5 hover:bg-white/8">
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── Firefox manual instructions ── */}
            {showFirefox && (
                <motion.div
                    key="firefox-banner"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="fixed bottom-4 left-4 right-4 z-[80] max-w-sm mx-auto"
                >
                    <div className="bg-[#1e1e28] border border-accent/30 rounded-2xl
                                    shadow-2xl shadow-black/50 p-4 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <HiDevicePhoneMobile className="text-accent text-lg" />
                                <p className="text-white font-semibold text-sm">Install on Firefox</p>
                            </div>
                            <button onClick={handleDismiss} aria-label="Dismiss"
                                className="text-white/30 hover:text-white/70 transition-colors">
                                <FiX size={16} />
                            </button>
                        </div>

                        {/* Two paths: desktop vs Android */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-1.5">
                                    Desktop Firefox
                                </p>
                                <ol className="space-y-1.5">
                                    {[
                                        'Go to Firefox Settings → Labs (or about:preferences#experimental)',
                                        'Enable "Progressive Web Apps" (Taskbar tabs)',
                                        'Restart Firefox, then revisit this site — an install icon appears in the address bar',
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25
                                                             flex items-center justify-center text-accent
                                                             text-[9px] font-bold flex-shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-white/55 text-[11px] leading-relaxed">{text}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="border-t border-white/6 pt-3">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-1.5">
                                    Firefox on Android
                                </p>
                                <ol className="space-y-1.5">
                                    {[
                                        'Tap the ⋮ menu (top right)',
                                        'Tap "Add to Home Screen"',
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-4 h-4 rounded-full bg-accent/15 border border-accent/25
                                                             flex items-center justify-center text-accent
                                                             text-[9px] font-bold flex-shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-white/55 text-[11px] leading-relaxed">{text}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <button onClick={handleDismiss}
                            className="mt-3 w-full py-2 text-xs font-semibold text-white/40
                                       hover:text-white/60 transition-colors rounded-lg bg-white/5 hover:bg-white/8">
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}