'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function IntroSection({ data }: { data: any }) {
  const { INTRO_CONTENT } = data;
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="intro-section" ref={ref}>
            <div className={`intro-grid ${visible ? 'in-view' : ''}`}>
                <div className="intro-headline fade-in-left">
                    {INTRO_CONTENT.headline.before}
                    <strong style={{ fontWeight: 700 }}>{INTRO_CONTENT.headline.bold1}</strong>
                    {INTRO_CONTENT.headline.middle}
                    <strong style={{ fontWeight: 700 }}>{INTRO_CONTENT.headline.bold2}</strong>
                    {INTRO_CONTENT.headline.after}
                </div>

                <div className="intro-body fade-in-right">
                    <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.7 }}>
                        {INTRO_CONTENT.description}
                    </p>
                    <Link href={INTRO_CONTENT.ctaLink} className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: '40px', fontSize: '16px' }}>
                        {INTRO_CONTENT.ctaText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
