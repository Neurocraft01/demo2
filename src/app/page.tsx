'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HERO_WORDS = ['FUTURE', 'INTELLIGENCE', 'AUTOMATION', 'SOLUTIONS', 'TOMORROW'];

const PROJECTS = [
  { title: 'YOMA Company', scope: 'Web Development / 3D', image: '/images/yoma.png', link: 'https://v0-yoma-website-clone.vercel.app/' },
  { title: 'Drinkos Solutions', scope: 'E-Commerce / UI/UX', image: '/images/drinkos.png', link: 'https://thedrinkos.com/' },
  { title: 'Yash Enterprises', scope: 'Corporate Website', image: '/images/yash.png', link: 'https://yashenterprises.netlify.app/' },
];

const STATS = [
  { value: '50+', label: 'Global Clients' },
  { value: '80+', label: 'Digital Products' },
  { value: '100%', label: 'Commitment' },
];

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
        <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}
            >
              Premium Digital Agency
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--ink)', margin: 0 }}
              >
                CRAFTING
              </motion.h1>
              <motion.h1
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.2em', overflow: 'hidden' }}
              >
                THE{' '}
                {/* Cycling animated word */}
                <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'bottom' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={HERO_WORDS[wordIndex]}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-110%', opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                      style={{
                        display: 'inline-block',
                        color: 'var(--blue)',
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
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
              style={{ color: 'var(--ink-3)', maxWidth: '500px', margin: '30px auto 0', fontSize: '18px', lineHeight: 1.6 }}
            >
              We build awwwards-winning websites, intelligent AI solutions, and scalable web applications for bold brands.
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
        <section style={{ padding: '150px 5vw', background: 'var(--bg-2)', position: 'relative', zIndex: 5 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
              style={{ flex: '1 1 400px', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--ink)', fontWeight: 300, lineHeight: 1.3 }}
            >
              We bridge the gap between <strong style={{ fontWeight: 700 }}>aesthetics</strong> and <strong style={{ fontWeight: 700 }}>engineering</strong>. Transforming complex problems into elegant digital experiences.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
              style={{ flex: '1 1 300px' }}
            >
              <p style={{ color: 'var(--ink-3)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.7 }}>
                AKS Automations is a next-generation tech agency. We don&apos;t just build websites; we engineer high-performance platforms that dominate the digital space. Focus on smooth UI, seamless loading, and premium design.
              </p>
              <Link href="/about" className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: '40px', fontSize: '16px' }}>
                Discover Our Agency
              </Link>
            </motion.div>
          </div>
        </section>

        {/* =============== SHOWCASE / PORTFOLIO =============== */}
        <section style={{ padding: '100px 0', background: 'var(--bg)' }}>
          <div style={{ padding: '0 5vw', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: 'var(--ink)', fontWeight: 800, margin: 0, letterSpacing: '-2px' }}>
              SELECTED <span style={{ color: 'var(--blue)' }}>WORKS</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '150px' }}>
            {PROJECTS.map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <ProjectCard key={project.title} project={project} isEven={isEven} index={idx} />
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '120px' }}>
            <Link href="/projects" className="btn btn-secondary" style={{ padding: '16px 40px', borderRadius: '40px', fontSize: '16px', borderColor: 'var(--blue)', color: 'var(--blue)' }}>
              View Complete Archive
            </Link>
          </div>
        </section>

        {/* =============== STATS (SCROLL REVEAL) =============== */}
        <section style={{ padding: '150px 5vw', background: 'var(--bg-3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                style={{ textAlign: 'center', flex: '1 1 200px' }}
              >
                <div style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 900, color: 'var(--blue)', lineHeight: 1, letterSpacing: '-3px' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--ink)', fontSize: '16px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '10px' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =============== CTA / FOOTER START =============== */}
        <section style={{ padding: '200px 5vw 100px', background: 'var(--bg-2)', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--ink)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '30px' }}>
              HAVE A VISION?<br />
              <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>LET&apos;S BUILD IT.</span>
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 50px' }}>
              We collaborate with visionary brands to create digital experiences that leave a lasting impact.
            </p>
            <a href="https://calendly.com/aksaiautomation/contact" target="_blank" rel="noopener noreferrer"
              className="btn btn-primary" style={{ padding: '20px 48px', borderRadius: '50px', fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>
              START A PROJECT
            </a>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function ProjectCard({ project, isEven, index }: { project: any, isEven: boolean, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: isEven ? 'row' : 'row-reverse', alignItems: 'center', gap: '5vw', padding: '0 5vw', flexWrap: 'wrap' }}>
      {/* Image Reveal with Parallax inside */}
      <motion.div
        initial={{ clipPath: 'inset(10% 0 0 0)', opacity: 0 }}
        whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        style={{ flex: '1 1 500px', height: '60vh', minHeight: '400px', position: 'relative', overflow: 'hidden', borderRadius: '24px' }}
      >
        <motion.div style={{ width: '100%', height: '120%', position: 'absolute', top: '-10%', y }}>
          <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'var(--blue-dim)', opacity: 0.1 }} />
        </motion.div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ flex: '1 1 300px' }}
      >
        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontSize: '14px' }}>
          {String(index + 1).padStart(2, '0')} — {project.scope}
        </div>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ink)', fontWeight: 800, margin: '0 0 30px', letterSpacing: '-1px', lineHeight: 1.2 }}>
          {project.title}
        </h3>
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '14px 32px', borderRadius: '30px' }}>
          Explore Case Study
        </a>
      </motion.div>
    </div>
  );
}

