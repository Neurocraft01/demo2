'use client';
import { useEffect } from 'react';

/**
 * Injects Boxicons stylesheet after hydration — completely non-render-blocking.
 * This is the correct approach for Next.js App Router to avoid the onload prop error.
 */
export default function BoxiconsLoader() {
    useEffect(() => {
        if (document.querySelector('link[data-boxicons]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
        link.setAttribute('data-boxicons', 'true');
        document.head.appendChild(link);
    }, []);
    return null;
}
