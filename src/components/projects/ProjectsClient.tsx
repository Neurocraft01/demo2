'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function ProjectsClient({ data, siteData }: { data: any, siteData: any }) {
    const { ALL_PROJECTS, PROJECT_TABS, PROJECT_CATEGORY_COLORS } = data;
    const { SITE_CONFIG } = siteData;

    const [activeTab, setActiveTab] = useState('all');
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = activeTab === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter((p: any) => p.category === activeTab);

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
        <>
            {/* ─── TABS ─── */}
            <div style={{ position: 'sticky', top: '80px', zIndex: 10, background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }} className="no-scrollbar">
                    {PROJECT_TABS.map((tab: any) => (
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
                {filtered.map((project: any, i: any) => {
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
                                    {project.tags.map((t: any) => (
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
                        <a href={SITE_CONFIG?.contact?.calendlyUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 32px', background: '#fff', color: '#000', borderRadius: '100px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            Start a Conversation
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
