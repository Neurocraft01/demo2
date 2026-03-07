'use client';

import { motion } from 'framer-motion';
import { FEATURES_CONTENT } from '@/data/home';

export default function FeaturesSection() {
    return (
        <section style={{ padding: '100px 5vw', background: 'var(--bg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="section-title-large" style={{ fontSize: '3rem' }}><span style={{ color: 'var(--blue)' }}>Why</span> Choose Us</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginTop: '16px' }}>{FEATURES_CONTENT.subtitle}</p>
            </div>

            <div className="features-grid">
                {FEATURES_CONTENT.features.map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="feat-card"
                    >
                        <div className="feat-icon">
                            <span className="material-symbols-outlined">{feature.icon}</span>
                        </div>
                        <h4 style={{ fontSize: '20px', marginBottom: '16px' }}>{feature.title}</h4>
                        <p style={{ fontSize: '15px' }}>{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
