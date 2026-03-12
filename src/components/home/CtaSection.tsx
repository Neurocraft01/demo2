'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function CtaSection({ data, siteData }: { data: any, siteData: any }) {
  const { CTA_CONTENT } = data;
  const { SITE_CONFIG } = siteData;
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="cta-band" style={{ padding: '120px 5vw' }} ref={ref}>
            <div className={`cta-band-inner${visible ? ' cta-visible' : ''}`}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}>
                    {CTA_CONTENT.title}
                </h2>
                <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '600px', margin: '20px auto 40px' }}>
                    {CTA_CONTENT.subtitle}
                </p>
                <div className="cta-btns">
                    <a href={SITE_CONFIG.contact.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: 'var(--bg)', color: 'var(--ink)', padding: '18px 40px', borderRadius: '40px', fontSize: '16px', fontWeight: 800 }}>
                        {CTA_CONTENT.cta1Text}
                    </a>
                    <Link href="/contact" className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', padding: '18px 40px', borderRadius: '40px', fontSize: '16px' }}>
                        {CTA_CONTENT.cta2Text}
                    </Link>
                </div>
            </div>
        </section>
    );
}
