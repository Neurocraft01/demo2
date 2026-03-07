'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { INTRO_CONTENT } from '@/data/home';

export default function IntroSection() {
    return (
        <section className="intro-section">
            <div className="intro-grid">
                <motion.div
                    initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
                    className="intro-headline"
                >
                    {INTRO_CONTENT.headline.before}
                    <strong style={{ fontWeight: 700 }}>{INTRO_CONTENT.headline.bold1}</strong>
                    {INTRO_CONTENT.headline.middle}
                    <strong style={{ fontWeight: 700 }}>{INTRO_CONTENT.headline.bold2}</strong>
                    {INTRO_CONTENT.headline.after}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                    className="intro-body"
                >
                    <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.7 }}>
                        {INTRO_CONTENT.description}
                    </p>
                    <Link href={INTRO_CONTENT.ctaLink} className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: '40px', fontSize: '16px' }}>
                        {INTRO_CONTENT.ctaText}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
