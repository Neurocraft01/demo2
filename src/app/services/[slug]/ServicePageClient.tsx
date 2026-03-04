'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { SERVICE_DATA } from './page';

type SvcData = (typeof SERVICE_DATA)[string];

export default function ServicePageClient({ svc, slug }: { svc: SvcData; slug: string }) {
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.anim').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <main>
            {/* ─── HERO ─── */}
            <div style={{ minHeight: '55vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--bg)', overflow: 'hidden' }}>
                <div className="page-bg-text">{svc.bgWord}</div>
                <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%', position: 'relative' }}>
                    <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}>
                        {svc.title}
                    </div>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>{svc.icon}</div>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto', maxWidth: '820px' }}>
                        {svc.tagline.split(' ').slice(0, -2).join(' ')}{' '}
                        <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>
                            {svc.tagline.split(' ').slice(-2).join(' ')}
                        </span>
                    </h1>
                    <p style={{ color: 'var(--ink-3)', maxWidth: '620px', margin: '20px auto 0', fontSize: '18px', lineHeight: 1.7 }}>
                        {svc.intro}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '36px' }}>
                        <Link href="/contact" className="btn btn-primary"><i className="bx bx-phone" /> Get a Free Quote</Link>
                        <Link href="/services" className="btn btn-secondary"><i className="bx bx-grid-alt" /> All Services</Link>
                    </div>
                </div>
            </div>

            {/* ─── WHAT WE BUILD ─── */}
            <section className="section" id="details" style={{ background: 'var(--bg)' }}>
                <div className="sh center anim">
                    <div className="eyebrow">What We Deliver</div>
                    <h2>Our <span className="grad-text">{svc.heroKeyword}</span> Services</h2>
                    <p>Everything you need — delivered with precision and built to last</p>
                </div>
                <div className="features-grid" style={{ marginTop: '52px' }}>
                    {svc.whatWeBuild.map((item) => (
                        <div key={item.title} className="feat-card anim">
                            <div className="feat-icon">{item.icon}</div>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── RESULTS ─── */}
            <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 28px' }}>
                <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
                    {svc.results.map((r) => (
                        <div key={r.label} className="anim" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: 'var(--blue)', lineHeight: 1, letterSpacing: '-1px', marginBottom: '8px' }}>{r.value}</div>
                            <div style={{ color: 'var(--ink-3)', fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{r.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── PROCESS ─── */}
            <section className="section">
                <div className="sh center anim">
                    <div className="eyebrow">How We Work</div>
                    <h2>Our <span className="grad-text">Process</span></h2>
                    <p>A proven 4-step process that delivers results, every time</p>
                </div>
                <div className="process-grid" style={{ maxWidth: 'var(--max-w)', margin: '52px auto 0', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {svc.process.map((p) => (
                        <div key={p.step} className="process-step anim">
                            <div className="p-num">{p.step}</div>
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── TECH STACK ─── */}
            <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 28px' }}>
                <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
                    <div className="sh center anim" style={{ marginBottom: '40px' }}>
                        <div className="eyebrow">Tech Stack</div>
                        <h2>Tools & <span className="grad-text">Technologies</span></h2>
                        <p>We always choose the right tool for the right job</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }} className="anim">
                        {svc.techStack.map((tech) => (
                            <span key={tech} style={{
                                padding: '10px 20px', borderRadius: '99px',
                                background: 'var(--bg-3)', border: '1px solid var(--border-2)',
                                color: 'var(--ink)', fontWeight: 600, fontSize: '14px',
                                transition: 'border-color var(--t), background var(--t), color var(--t)',
                                cursor: 'default'
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--blue)'; (e.currentTarget as HTMLSpanElement).style.background = 'var(--blue-dim)'; (e.currentTarget as HTMLSpanElement).style.color = 'var(--blue)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.borderColor = ''; (e.currentTarget as HTMLSpanElement).style.background = ''; (e.currentTarget as HTMLSpanElement).style.color = ''; }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="section">
                <div className="sh center anim">
                    <div className="eyebrow">Questions</div>
                    <h2>Frequently Asked <span className="grad-text">Questions</span></h2>
                    <p>Everything you need to know about our {svc.title} service</p>
                </div>
                <div className="faq-grid" style={{ maxWidth: 'var(--max-w)', margin: '52px auto 0' }}>
                    {svc.faqs.map((faq, i) => (
                        <div key={i} className="faq-item anim">
                            <div className="faq-q">{faq.q}</div>
                            <div className="faq-a">{faq.a}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── OTHER SERVICES ─── */}
            <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '80px 28px' }}>
                <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
                    <div className="sh center anim" style={{ marginBottom: '40px' }}>
                        <div className="eyebrow">More Services</div>
                        <h2>Explore <span className="grad-text">Everything We Do</span></h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }} className="anim">
                        {[
                            { slug: 'web-development', label: '🌐 Web Development' },
                            { slug: 'ai-chatbots', label: '🤖 AI Chatbots' },
                            { slug: 'automation', label: '⚙️ Automation' },
                            { slug: 'data-analysis', label: '📊 Data Analysis' },
                            { slug: 'backend-development', label: '🗄️ Backend Dev' },
                            { slug: 'seo-performance', label: '📈 SEO & Performance' },
                        ].filter(s => s.slug !== slug).map(s => (
                            <Link key={s.slug} href={`/services/${s.slug}`} className="btn btn-secondary">
                                {s.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <div className="cta-band">
                <div className="cta-band-inner">
                    <h2>Ready to Get Started?</h2>
                    <p>Tell us about your project and get a free quote within 24 hours.</p>
                    <div className="cta-btns">
                        <a href="https://calendly.com/aksaiautomation/contact" className="btn btn-white" target="_blank" rel="noopener noreferrer">
                            <i className="bx bx-calendar" /> Book Free Consultation
                        </a>
                        <Link href="/contact" className="btn btn-ghost">
                            <i className="bx bx-send" /> Send a Message
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
