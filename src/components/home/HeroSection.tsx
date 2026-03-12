'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function HeroSection({ data }: { data: any }) {
    const { HERO_WORDS, HERO_CONTENT } = data;
    const [wordIndex, setWordIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));
        const id = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2500);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div
                className={`hero-content-wrapper ${isVisible ? 'hero-visible' : ''}`}
                style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%' }}
            >
                <div
                    className="hero-badge-anim"
                    style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}
                >
                    {HERO_CONTENT.badge}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                    <h1 className="hero-title hero-title-anim">
                        {HERO_CONTENT.titleLine1}
                    </h1>
                    <h1
                        className="hero-title hero-title-flex hero-title-anim-delay"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4em' }}
                    >
                        {HERO_CONTENT.titleLine2Prefix}{' '}
                        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', height: '1.2em' }}>
                            <span
                                key={HERO_WORDS[wordIndex]}
                                className="hero-word-rotate"
                                style={{
                                    display: 'block',
                                    color: 'var(--blue)',
                                    fontStyle: 'italic',
                                    whiteSpace: 'nowrap',
                                    paddingRight: '0.08em',
                                    lineHeight: 1
                                }}
                            >
                                {HERO_WORDS[wordIndex]}
                            </span>
                        </span>
                    </h1>
                </div>

                <p className="hero-subtitle hero-subtitle-anim">
                    {HERO_CONTENT.subtitle}
                </p>
            </div>

            <div
                className="hero-bg-image"
                style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            >
                <Image src="/images/gradient.png" alt="" fill style={{ objectFit: 'cover', opacity: 0.2 }} priority sizes="100vw" quality={50} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg) 95%)' }} />
            </div>
        </section>
    );
}
