'use client';

import { useRef, useEffect, useState } from 'react';
import { PROCESS_CONTENT } from '@/data/home';

export default function ProcessSection() {
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
        <section className="process-section" style={{ padding: '100px 5vw' }} ref={ref}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="section-title-large" style={{ fontSize: '3rem' }}>{PROCESS_CONTENT.title}</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginTop: '16px' }}>{PROCESS_CONTENT.subtitle}</p>
            </div>

            <div className={`process-grid ${visible ? 'in-view' : ''}`}>
                {PROCESS_CONTENT.steps.map((step, i) => (
                    <div
                        key={step.num}
                        className="process-step fade-in-up"
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div className="p-num">0{step.num}</div>
                            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--ink-4)', opacity: 0.3 }}>{step.icon}</span>
                        </div>
                        <h3 style={{ fontSize: '22px', marginBottom: '12px', fontWeight: 800 }}>{step.title}</h3>
                        <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
