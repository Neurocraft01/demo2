'use client';

import { useRef, useEffect, useState } from 'react';
export default function FeaturesSection({ data }: { data: any }) {
  const { FEATURES_CONTENT } = data;
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section style={{ padding: '100px 5vw', background: 'var(--bg)' }} ref={ref}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="section-title-large" style={{ fontSize: '3rem' }}><span style={{ color: 'var(--blue)' }}>Why</span> Choose Us</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginTop: '16px' }}>{FEATURES_CONTENT.subtitle}</p>
            </div>

            <div className={`features-grid ${visible ? 'in-view' : ''}`}>
                {FEATURES_CONTENT.features.map((feature: any, i: any) => (
                    <div
                        key={feature.title}
                        className="feat-card fade-in-up"
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        <div className="feat-icon">
                            <span className="material-symbols-outlined">{feature.icon}</span>
                        </div>
                        <h4 style={{ fontSize: '20px', marginBottom: '16px' }}>{feature.title}</h4>
                        <p style={{ fontSize: '15px' }}>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
