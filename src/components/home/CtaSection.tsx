'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CTA_CONTENT } from '@/data/home';
import { SITE_CONFIG } from '@/data/site';

export default function CtaSection() {
    return (
        <section className="cta-band" style={{ padding: '120px 5vw' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="cta-band-inner"
            >
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
            </motion.div>
        </section>
    );
}
