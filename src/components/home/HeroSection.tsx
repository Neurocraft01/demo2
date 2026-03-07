'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HERO_WORDS, HERO_CONTENT } from '@/data/home';

export default function HeroSection() {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2500);
        return () => clearInterval(id);
    }, []);

    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);

    return (
        <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
                    style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}
                >
                    {HERO_CONTENT.badge}
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                    <motion.h1
                        initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        className="hero-title"
                    >
                        {HERO_CONTENT.titleLine1}
                    </motion.h1>
                    <motion.h1
                        initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className="hero-title hero-title-flex"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4em' }}
                    >
                        {HERO_CONTENT.titleLine2Prefix}{' '}
                        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', height: '1.2em' }}>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={HERO_WORDS[wordIndex]}
                                    initial={{ y: '110%', opacity: 0 }}
                                    animate={{ y: '0%', opacity: 1 }}
                                    exit={{ y: '-110%', opacity: 0 }}
                                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
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
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
                    className="hero-subtitle"
                >
                    {HERO_CONTENT.subtitle}
                </motion.p>
            </motion.div>

            <motion.div
                style={{ position: 'absolute', inset: 0, zIndex: 0, scale: imageScale }}
                initial={{ scale: 1.2, filter: 'blur(20px)', opacity: 0 }}
                animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.2 }}
                transition={{ duration: 2, ease: 'easeOut' }}
            >
                <Image src="/images/gradient.png" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority sizes="100vw" quality={60} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg) 95%)' }} />
            </motion.div>
        </section>
    );
}
