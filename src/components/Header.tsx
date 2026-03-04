'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem('aks-theme') as 'dark' | 'light' | null;
        const initial = saved || 'light';
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('aks-theme', next);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/projects', label: 'Projects' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
                <div className="header-inner">
                    {/* Logo */}
                    <Link href="/" className="logo">
                        <div className="logo-icon">AKS</div>
                        <span className="logo-text">AKS<em>Automations</em></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="desktop-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={pathname === link.href ? 'active' : ''}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="header-actions">
                        {/* Theme Toggle */}
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`} />
                        </button>

                        {/* Social Icons */}
                        <div className="social-icons">
                            <a href="https://www.instagram.com/aks_automation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="bx bxl-instagram" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <i className="bx bxl-linkedin" />
                            </a>
                        </div>

                        {/* CTA */}
                        <Link href="/contact" className="header-cta">
                            Get in Touch ↗
                        </Link>

                        {/* Mobile Button */}
                        <button
                            className="mobile-btn"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <i className="bx bx-menu" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
                <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
                <div className="mobile-panel">
                    <button
                        className="mobile-close"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <i className="bx bx-x" />
                    </button>
                    <nav className="mobile-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={pathname === link.href ? 'active' : ''}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: '100%', padding: '12px', borderRadius: 'var(--r)',
                                background: 'var(--blue-dim)', border: '1px solid rgba(56,75,255,0.2)',
                                color: 'var(--blue)', font: '600 14px var(--font-inter, Inter)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                gap: '8px', justifyContent: 'center',
                            }}
                        >
                            <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`} />
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
