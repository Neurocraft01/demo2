'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ALL_PROJECTS, PROJECT_TABS, PROJECT_CATEGORY_COLORS, PROJECT_STATS } from '@/data/projects';
import { SITE_CONFIG } from '@/data/site';

export default function ProjectsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = activeTab === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter((p) => p.category === activeTab);

    // Dynamic scroll interactions
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    obs.unobserve(e.target);
                }
            }),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        document.querySelectorAll('.reveal-anim').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [filtered]);

    return (
        <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
            <Header />

            <style jsx global>{`
                ::selection { background: #6366f1; color: white; }
                .reveal-anim {
                    opacity: 0;
                    transform: translateY(40px) scale(0.95);
                    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-anim.in-view {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 24px;
                }
                .bento-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .bento-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5);
                }
                .bento-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%);
                    opacity: 0;
                    transition: opacity 0.5s;
                    z-index: 0;
                    pointer-events: none;
                }
                .bento-card:hover::before { opacity: 1; }
                
                .card-content {
                    padding: 32px;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .bento-large { grid-column: span 8; min-height: 400px; }
                .bento-medium { grid-column: span 6; min-height: 350px; }
                .bento-small { grid-column: span 4; min-height: 350px; }
                
                @media (max-width: 1024px) {
                    .bento-large, .bento-medium, .bento-small { grid-column: span 6; }
                }
                @media (max-width: 768px) {
                    .bento-large, .bento-medium, .bento-small { grid-column: span 12; min-height: auto; }
                }

                .tag-chip {
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s;
                }

                .tab-pill {
                    padding: 12px 24px;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: transparent;
                    color: rgba(255,255,255,0.6);
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .tab-pill:hover {
                    color: white;
                    border-color: rgba(255,255,255,0.3);
                }
                .tab-pill.active {
                    background: white;
                    color: black;
                    border-color: white;
                }

                .gradient-text-hero {
                    background: linear-gradient(to right, #ffffff, #a1a1aa);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .mock-browser {
                    margin-top: auto;
                    background: rgba(10, 10, 15, 0.8);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px 12px 0 0;
                    overflow: hidden;
                    box-shadow: 0 -20px 40px rgba(0,0,0,0.5);
                    transform: translateY(20px);
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .bento-card:hover .mock-browser {
                    transform: translateY(0);
                }
                .browser-header {
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    gap: 8px;
                }
                .browser-dot { width: 10px; height: 10px; border-radius: 50%; }

                /* Lines animation in hero */
                .grid-lines {
                    position: absolute;
                    inset: 0;
                    background-size: 50px 50px;
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
                    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
                    z-index: 0;
                    pointer-events: none;
                }
            `}</style>

            <main>
                {/* ─── CREATIVE HERO PAGE ─── */}
                <section style={{
                    position: 'relative',
                    padding: '160px 24px 100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '60vh',
                    justifyContent: 'center'
                }}>
                    <div className="grid-lines" />
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60vw',
                        height: '60vw',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
                        filter: 'blur(60px)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                        <div className="reveal-anim" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '32px',
                            fontWeight: 600,
                            fontSize: '14px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 10px #6366f1' }} />
                            The Masterpieces
                        </div>
                        <h1 className="reveal-anim gradient-text-hero" style={{
                            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-2px',
                            marginBottom: '24px'
                        }}>
                            Engineered for Impact.<br />Designed to Surprise.
                        </h1>
                        <p className="reveal-anim" style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6,
                            maxWidth: '650px',
                            margin: '0 auto'
                        }}>
                            Explore our bento-grid of innovation. From highly-scalable SaaS applications to self-thinking AI automations. We build the impossible.
                        </p>
                    </div>
                </section>

                {/* ─── TABS ─── */}
                <div style={{ position: 'sticky', top: '80px', zIndex: 10, background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }} className="no-scrollbar">
                        {PROJECT_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── ADVANCED BENTO GRID ─── */}
                <section ref={containerRef} className="bento-grid">
                    {filtered.map((project, i) => {
                        const accent = PROJECT_CATEGORY_COLORS[project.category] || '#6366f1';
                        // Determine bento sizing creatively based on index modulo
                        let bentoClass = 'bento-small';
                        if (i % 5 === 0) bentoClass = 'bento-large';
                        else if (i % 3 === 0) bentoClass = 'bento-medium';
                        else if (i % 2 === 0) bentoClass = 'bento-medium';

                        return (
                            <div
                                key={i}
                                className={`reveal-anim bento-card ${bentoClass}`}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                }}
                            >
                                <div className="card-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `linear-gradient(135deg, ${accent}33, ${accent}11)`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '24px', color: accent }} className="material-symbols-outlined">
                                                {project.category === 'automation' ? 'smart_toy' : project.category === 'landing' ? 'web' : project.category === 'data-analysis' ? 'query_stats' : 'rocket_launch'}
                                            </span>
                                        </div>
                                        {project.link !== '#' && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '8px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                View Live <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_outward</span>
                                            </a>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: bentoClass === 'bento-large' ? '2.5rem' : '1.75rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
                                        {project.title.replace(project.gradientPart, '')}
                                        <span style={{ background: `linear-gradient(to right, ${accent}, #fff)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                            {project.gradientPart}
                                        </span>
                                    </h3>

                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '85%' }}>
                                        {project.desc}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', marginBottom: bentoClass === 'bento-small' ? '0' : '32px' }}>
                                        {project.tags.map((t) => (
                                            <span key={t} className="tag-chip">{t}</span>
                                        ))}
                                    </div>

                                    {(bentoClass === 'bento-large' || bentoClass === 'bento-medium') && (
                                        <div className="mock-browser">
                                            <div className="browser-header">
                                                <div className="browser-dot" style={{ background: '#ff5f56' }} />
                                                <div className="browser-dot" style={{ background: '#ffbd2e' }} />
                                                <div className="browser-dot" style={{ background: '#27c93f' }} />
                                            </div>
                                            <div style={{ padding: '24px', background: '#0f0f13', height: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {/* Code UI Mockup */}
                                                <div style={{ width: '40%', height: '12px', borderRadius: '4px', background: `linear-gradient(90deg, ${accent}88, rgba(255,255,255,0.05))` }} />
                                                <div style={{ width: '70%', height: '12px', borderRadius: '4px', background: `linear-gradient(90deg, ${accent}66, rgba(255,255,255,0.05))` }} />
                                                <div style={{ width: '55%', height: '12px', borderRadius: '4px', background: `linear-gradient(90deg, ${accent}44, rgba(255,255,255,0.05))` }} />
                                                <div style={{ width: '85%', height: '12px', borderRadius: '4px', background: `linear-gradient(90deg, ${accent}22, rgba(255,255,255,0.05))` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {filtered.length === 0 && (
                    <div className="reveal-anim" style={{ textAlign: 'center', padding: '100px 24px', minHeight: '40vh' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.5 }}>🚧</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>New Works Incoming</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>We are currently building the next generation of solutions for this category.</p>
                    </div>
                )}

                {/* ─── CTA BAND ─── */}
                <div className="reveal-anim" style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.05))' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100%', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '24px' }}>Ready for Your Web Masterpiece?</h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6 }}>Let’s collaborate. We turn ambitious concepts into highly performant software products.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href={SITE_CONFIG.contact.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 32px', background: '#fff', color: '#000', borderRadius: '100px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                Start a Conversation
                            </a>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
