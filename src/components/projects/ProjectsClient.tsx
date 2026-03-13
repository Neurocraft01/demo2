'use client';

import { useEffect, useState, useRef } from 'react';

export default function ProjectsClient({ data, siteData }: { data: any, siteData: any }) {
    const { ALL_PROJECTS, PROJECT_TABS, PROJECT_CATEGORY_COLORS, TESTIMONIALS } = data;
    const { SITE_CONFIG } = siteData;

    const [activeTab, setActiveTab] = useState('all');
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = activeTab === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter((p: any) => p.category === activeTab);

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
                            className={`tab-pill${activeTab === tab.id ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── BENTO GRID ─── */}
            <section ref={containerRef} className="bento-grid">
                {filtered.map((project: any, i: number) => {
                    const accent = PROJECT_CATEGORY_COLORS[project.category] || '#6366f1';
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
                                    {/* Company Logo or Fallback Initial */}
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `linear-gradient(135deg, ${accent}33, ${accent}11)`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {project.logo ? (
                                            <img src={project.logo} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                        ) : (
                                            <span style={{ fontSize: '24px', fontWeight: 800, color: accent }}>{project.title.charAt(0)}</span>
                                        )}
                                    </div>
                                    {project.link !== '#' && (
                                        <a 
                                            href={project.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="view-live-btn"
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '8px', 
                                                color: '#fff', 
                                                textDecoration: 'none', 
                                                fontSize: '14px', 
                                                fontWeight: 700, 
                                                padding: '10px 20px', 
                                                borderRadius: '100px', 
                                                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                                                boxShadow: `0 4px 20px ${accent}44, 0 0 0 1px ${accent}66`,
                                                transition: 'all 0.3s ease',
                                                letterSpacing: '0.3px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                                e.currentTarget.style.boxShadow = `0 8px 30px ${accent}55, 0 0 0 1px ${accent}88`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = `0 4px 20px ${accent}44, 0 0 0 1px ${accent}66`;
                                            }}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'pulse 2s infinite' }} />
                                            </span>
                                            View Live
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
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

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                                    {project.tags.map((t: any) => (
                                        <span key={t} className="tag-chip">{t}</span>
                                    ))}
                                </div>
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

            {/* ─── TESTIMONIALS ─── */}
            {TESTIMONIALS && TESTIMONIALS.length > 0 && (
                <section className="reveal-anim" style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 40px' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>
                        What Our <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Clients</span> Say
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {TESTIMONIALS.map((t: any, i: number) => (
                            <div key={i} className="reveal-anim" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', transitionDelay: `${i * 100}ms` }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px', fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {t.avatar ? (
                                            <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{t.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── CTA BAND ─── */}
            <div className="reveal-anim" style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.05))' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100%', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '24px' }}>Ready for Your Web Masterpiece?</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6 }}>Let&apos;s collaborate. We turn ambitious concepts into highly performant software products.</p>
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
