'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TEAM = [
    { name: 'Aryan Kumbhar', role: 'Founder & Full-Stack Developer', emoji: '👨‍💻', bio: 'Expert in Next.js, React, and AI integrations. Passionate about building scalable, beautiful digital experiences.' },
    { name: 'Sahil Shinde', role: 'AI & Automation Lead', emoji: '🤖', bio: 'Specialises in AI agents, workflow automation, and integrating cutting-edge LLMs into real-world business processes.' },
    { name: 'Kedar Jadhav', role: 'Backend & Data Engineer', emoji: '🗄️', bio: 'Builds robust APIs, databases, and data pipelines that power the products our clients rely on every day.' },
];

const VALUES = [
    { icon: '🎯', title: 'Precision Execution', desc: 'Every deliverable is crafted with meticulous attention to detail. We don\'t ship until it\'s right.' },
    { icon: '🚀', title: 'Speed Without Compromise', desc: 'We move fast — typical projects deliver in 1–3 weeks — but never at the cost of quality.' },
    { icon: '🤝', title: 'Client Partnership', desc: 'We treat every client as a long-term partner, not a one-off transaction. Your growth is our success.' },
    { icon: '🧠', title: 'AI-First Thinking', desc: 'We bring AI into everything we build — from automating workflows to building intelligent user experiences.' },
    { icon: '📣', title: 'Radical Transparency', desc: 'No hidden costs, no vague timelines. You always know what we\'re building and how it\'s going.' },
    { icon: '🌍', title: 'Global Standards, Local Heart', desc: 'World-class execution from Pune — we compete with the best agencies anywhere on the planet.' },
];

const STATS = [
    { value: '50+', label: 'Happy Clients' },
    { value: '80+', label: 'Projects Shipped' },
    { value: '3+', label: 'Years Experience' },
    { value: '100%', label: 'Commitment Rate' },
];

const MILESTONES = [
    { year: '2021', title: 'AKS Founded', desc: 'Started as a solo freelance web development studio in Pune.' },
    { year: '2022', title: 'First 10 Clients', desc: 'Expanded to first 10 paying clients, delivering custom websites and apps across India.' },
    { year: '2023', title: 'AI Integration Begins', desc: 'Launched AI chatbot and automation services, positioning as a full-stack AI agency.' },
    { year: '2024', title: 'Team of 3', desc: 'Grew to a dedicated team of 3 specialists covering web, AI, and data engineering.' },
    { year: '2025', title: '50+ Clients, Going Global', desc: 'Now serving clients across India, UAE, UK, and USA — expanding internationally.' },
];

export default function AboutPage() {
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.anim').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <Header />
            <main>

                {/* ─── HERO ─── */}
                <div style={{ minHeight: '55vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--bg)', overflow: 'hidden' }}>
                    <div className="page-bg-text">ABOUT</div>
                    <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%', position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}>
                            Who We Are
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto' }}>
                            A Team That Builds{' '}
                            <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Digital Futures</span>
                        </h1>
                        <p style={{ color: 'var(--ink-3)', maxWidth: '620px', margin: '24px auto 0', fontSize: '18px', lineHeight: 1.7 }}>
                            AKS Automations is a premium digital agency based in Pune, India. We combine AI, web engineering,
                            and automation to build products that drive real business results for bold brands worldwide.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '36px' }}>
                            <Link href="/contact" className="btn btn-primary"><i className="bx bx-phone" /> Work With Us</Link>
                            <Link href="/projects" className="btn btn-secondary"><i className="bx bx-briefcase" /> See Our Work</Link>
                        </div>
                    </div>
                </div>

                {/* ─── STATS ─── */}
                <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '60px 28px' }}>
                    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {STATS.map((s) => (
                            <div key={s.label} className="anim" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--blue)', lineHeight: 1, letterSpacing: '-2px' }}>{s.value}</div>
                                <div style={{ color: 'var(--ink-3)', fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '8px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── STORY ─── */}
                <section className="section">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
                        <div className="anim">
                            <div className="eyebrow">Our Story</div>
                            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '24px' }}>
                                Built in Pune,<br />Trusted Worldwide
                            </h2>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '18px' }}>
                                AKS Automations started in 2021 as a one-person freelance studio. Our founder, Aryan Kumbhar,
                                saw a gap in the Pune market — businesses needed world-class digital solutions but were being
                                underserved by agencies that prioritised volume over craft.
                            </p>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
                                Today we&apos;re a team of specialists in web development, AI automation, and data engineering —
                                executing at a level that competes with top global agencies, at pricing that makes sense for
                                Indian and international SMEs alike.
                            </p>
                            <Link href="/contact" className="btn btn-primary"><i className="bx bx-rocket" /> Start a Project</Link>
                        </div>

                        {/* Timeline */}
                        <div className="anim" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {MILESTONES.map((m, i) => (
                                <div key={m.year} style={{ display: 'flex', gap: '20px', paddingBottom: i < MILESTONES.length - 1 ? '28px' : '0', position: 'relative' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--blue)', color: '#fff', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.year}</div>
                                        {i < MILESTONES.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border)', margin: '8px 0' }} />}
                                    </div>
                                    <div style={{ paddingTop: '10px', paddingBottom: '8px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '15px', marginBottom: '4px' }}>{m.title}</div>
                                        <div style={{ color: 'var(--ink-3)', fontSize: '14px', lineHeight: 1.6 }}>{m.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── VALUES ─── */}
                <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '100px 28px' }}>
                    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
                        <div className="sh center anim">
                            <div className="eyebrow">What Drives Us</div>
                            <h2>Our Core <span className="grad-text">Values</span></h2>
                            <p>The principles behind every decision we make and every line of code we write</p>
                        </div>
                        <div className="features-grid">
                            {VALUES.map((v) => (
                                <div key={v.title} className="feat-card anim">
                                    <div className="feat-icon">{v.icon}</div>
                                    <h4>{v.title}</h4>
                                    <p>{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── TEAM ─── */}
                <section className="section">
                    <div className="sh center anim">
                        <div className="eyebrow">The People</div>
                        <h2>Meet the <span className="grad-text">Team</span></h2>
                        <p>A tight-knit group of builders, thinkers, and problem-solvers</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '52px', maxWidth: 'var(--max-w)', margin: '52px auto 0' }}>
                        {TEAM.map((member) => (
                            <div key={member.name} className="anim" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '40px 32px', textAlign: 'center', transition: 'border-color var(--t), box-shadow var(--t), transform var(--t)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--blue)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--s-blue)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.transform = ''; }}
                            >
                                <div style={{ fontSize: '3.5rem', marginBottom: '20px', display: 'block' }}>{member.emoji}</div>
                                <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '6px' }}>{member.name}</div>
                                <div style={{ color: 'var(--blue)', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>{member.role}</div>
                                <p style={{ color: 'var(--ink-3)', fontSize: '14px', lineHeight: 1.7 }}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── LOCATION ─── */}
                <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '80px 28px' }}>
                    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                        <div className="anim">
                            <div className="eyebrow">Where We Are</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: '20px' }}>
                                Proudly Based in <span style={{ color: 'var(--blue)' }}>Pune, India</span>
                            </h2>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
                                Our studio is located in Pune, Maharashtra — one of India&apos;s fastest-growing tech hubs.
                                We work with clients across Pune, Pimpri Chinchwad, Mumbai, and internationally via Slack, Zoom, and GitHub.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { icon: 'bx-map', text: 'Pune, Maharashtra, India – 411001' },
                                    { icon: 'bx-time', text: 'Mon–Sat: 9 AM – 8 PM IST · Emergency: 24/7' },
                                    { icon: 'bx-globe', text: 'Serving clients globally — India, UAE, UK, USA' },
                                ].map(item => (
                                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-3)', fontSize: '15px' }}>
                                        <i className={`bx ${item.icon}`} style={{ color: 'var(--blue)', fontSize: '20px', flexShrink: 0 }} />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="anim" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '48px', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📍</div>
                            <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--ink)', marginBottom: '8px' }}>Pune & Pimpri Chinchwad</div>
                            <div style={{ color: 'var(--ink-3)', fontSize: '14px', marginBottom: '28px' }}>Maharashtra, India</div>
                            <a href="https://maps.google.com/?q=Pune,Maharashtra,India" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <i className="bx bx-map" /> Open in Maps
                            </a>
                        </div>
                    </div>
                </section>

                {/* ─── CTA ─── */}
                <div className="cta-band">
                    <div className="cta-band-inner">
                        <h2>Ready to Work Together?</h2>
                        <p>Whether you&apos;re a startup, SME, or enterprise — we&apos;d love to hear about your project.</p>
                        <div className="cta-btns">
                            <a href="https://calendly.com/aksaiautomation/contact" className="btn btn-white" target="_blank" rel="noopener noreferrer">
                                <i className="bx bx-calendar" /> Book a Free Call
                            </a>
                            <Link href="/contact" className="btn btn-ghost">
                                <i className="bx bx-send" /> Send a Message
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}
