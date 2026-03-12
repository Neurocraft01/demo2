import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Observer from '@/components/Observer';
import { getSiteContent } from '@/lib/content';

export default async function AboutPage() {
    const { ABOUT_HERO, TEAM, VALUES, ABOUT_STATS, MILESTONES, STORY, LOCATION, ABOUT_MISSION } = await getSiteContent<any>('about');
    const { SITE_CONFIG } = await getSiteContent<any>('site');

    return (
        <>
            <Observer />
            <Header />
            <main>

                {/* ─── HERO ─── */}
                <div className="page-hero page-hero-tall">
                    <div className="page-bg-text">ABOUT</div>
                    <div className="page-hero-inner">
                        <div className="eyebrow-badge">
                            {ABOUT_HERO.badge}
                        </div>
                        <h1 className="page-title">
                            {ABOUT_HERO.title}{' '}
                            <span className="text-accent">{ABOUT_HERO.titleAccent}</span>
                        </h1>
                        <p className="page-subtitle" style={{ maxWidth: '620px' }}>
                            {ABOUT_HERO.description}
                        </p>
                        <div className="hero-btns">
                            <Link href="/contact" className="btn btn-primary"><i className="bx bx-phone" /> Work With Us</Link>
                            <Link href="/projects" className="btn btn-secondary"><i className="bx bx-briefcase" /> See Our Work</Link>
                        </div>
                    </div>
                </div>

                {/* ─── WELCOME / MISSION ─── */}
                <section style={{ padding: '100px 5vw', background: 'var(--bg)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title-large anim" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '-1px', color: 'var(--ink)' }}>
                            {ABOUT_MISSION.headlinePrefix} <span className="text-accent">{ABOUT_MISSION.headlineAccent}</span>
                        </h2>
                        <p className="anim" style={{ fontSize: '1.25rem', color: 'var(--ink-3)', marginTop: '20px', fontWeight: 500 }}>
                            {ABOUT_MISSION.subtitle}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                        {ABOUT_MISSION.cards.map((card: any) => (
                            <div key={card.title} className="about-card anim" style={{ display: 'block', background: 'var(--bg-2)' }}>
                                <div className="about-card-icon" style={{ marginBottom: '24px' }}>
                                    <i className={`bx ${card.icon}`} style={{ fontSize: '24px' }} />
                                </div>
                                <div className="about-card-body">
                                    <h4 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--ink)' }}>{card.title}</h4>
                                    <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: '1.7' }}>{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── STATS ─── */}
                <section className="stats-band">
                    <div className="stats-band-grid">
                        {ABOUT_STATS.map((s: any) => (
                            <div key={s.label} className="anim" style={{ textAlign: 'center' }}>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── STORY ─── */}
                <section className="section">
                    <div className="story-grid">
                        <div className="anim">
                            <div className="eyebrow">Our Story</div>
                            <h2 className="story-title">
                                {STORY.title.split('\n').map((line: any, i: any) => (
                                    <span key={i}>{line}{i === 0 && <br />}</span>
                                ))}
                            </h2>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '18px' }}>
                                {STORY.paragraph1}
                            </p>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
                                {STORY.paragraph2}
                            </p>
                            <Link href="/contact" className="btn btn-primary"><i className="bx bx-rocket" /> Start a Project</Link>
                        </div>

                        {/* Timeline */}
                        <div className="anim" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {MILESTONES.map((m: any, i: any) => (
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
                            {VALUES.map((v: any) => (
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
                    <div className="team-grid">
                        {TEAM.map((member: any) => (
                            <div key={member.name} className="team-card anim">
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
                    <div className="location-grid">
                        <div className="anim">
                            <div className="eyebrow">Where We Are</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: '20px' }}>
                                {LOCATION.title} <span style={{ color: 'var(--blue)' }}>{LOCATION.titleAccent}</span>
                            </h2>
                            <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
                                {LOCATION.description}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {LOCATION.details.map((item: any) => (
                                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-3)', fontSize: '15px' }}>
                                        <i className={`bx ${item.icon}`} style={{ color: 'var(--blue)', fontSize: '20px', flexShrink: 0 }} />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="anim" style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '48px', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📍</div>
                            <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--ink)', marginBottom: '8px' }}>{LOCATION.mapLabel}</div>
                            <div style={{ color: 'var(--ink-3)', fontSize: '14px', marginBottom: '28px' }}>{LOCATION.mapSublabel}</div>
                            <a href={LOCATION.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
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
                            <a href={SITE_CONFIG.contact.calendlyUrl} className="btn btn-white" target="_blank" rel="noopener noreferrer">
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
