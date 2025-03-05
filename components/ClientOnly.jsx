'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnly component to prevent hydration errors with browser-only APIs like localStorage
 * Only renders children after component has mounted on the client
 */
export default function ClientOnly({ children }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
} 