'use client';

import { motion } from 'framer-motion';
import { PROCESS_CONTENT } from '@/data/home';

export default function ProcessSection() {
    return (
        <section className="process-section" style={{ padding: '100px 5vw' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="section-title-large" style={{ fontSize: '3rem' }}>{PROCESS_CONTENT.title}</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginTop: '16px' }}>{PROCESS_CONTENT.subtitle}</p>
            </div>

            <div className="process-grid">
                {PROCESS_CONTENT.steps.map((step, i) => (
                    <motion.div
                        key={step.num}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="process-step"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div className="p-num">0{step.num}</div>
                            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--ink-4)', opacity: 0.3 }}>{step.icon}</span>
                        </div>
                        <h3 style={{ fontSize: '22px', marginBottom: '12px', fontWeight: 800 }}>{step.title}</h3>
                        <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.6 }}>{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
