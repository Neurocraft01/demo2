'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HERO_WORDS, HERO_CONTENT, INTRO_CONTENT, TECH_STACK, PROCESS_CONTENT, FEATURES_CONTENT, CTA_CONTENT } from '@/data/home';
import { SITE_CONFIG } from '@/data/site';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle hero words every 2.5s
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2500);
    return () => clearInterval(id);
  }, []);

  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Image Scale
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);

  return (
    <div ref={containerRef} style={{ background: 'var(--bg)' }}>
      <Header />

      <main style={{ overflow: 'hidden' }}>
        {/* =============== HERO =============== */}
        <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                {/* Cycling animated word */}
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

          {/* Abstract Hero Image Background */}
          <motion.div
            style={{ position: 'absolute', inset: 0, zIndex: 0, scale: imageScale }}
            initial={{ scale: 1.2, filter: 'blur(20px)', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.2 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <Image src="/images/gradient.png" alt="Hero Background" fill style={{ objectFit: 'cover' }} priority />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg) 95%)' }} />
          </motion.div>
        </section>

        {/* =============== ABOUT / INTRO =============== */}
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

        {/* =============== TECHNOLOGIES SCROLL =============== */}
        <section className="tech-band" style={{ padding: '60px 0', borderTop: 'none' }}>
          <div className="tech-band-label">Technologies That Power Us</div>
          <p style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: '15px', marginBottom: '40px' }}>
            Cutting-edge tools and frameworks for modern web development
          </p>
          <div className="tech-section">
            <div className="tech-track">
              {/* Loop exactly twice for a seamless CSS scroll */}
              {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <div key={i} className="tech-tile">
                  <div className="tech-tile-icon" style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <Image src={tech.icon} alt={tech.name} fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== OUR PROCESS =============== */}
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

        {/* =============== WHY CHOOSE US =============== */}
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

        {/* =============== CTA / FOOTER START =============== */}
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

      </main>
      <Footer />
    </div>
  );
}
