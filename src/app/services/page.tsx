import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Observer from '@/components/Observer';
import { getSiteContent } from '@/lib/content';

export default async function ServicesPage() {
    const { SERVICES_HERO, SERVICES, PACKAGES, WHY_US, SERVICES_FAQS } = await getSiteContent<any>('services');
    const { SITE_CONFIG } = await getSiteContent<any>('site');

    return (
        <>
            <Observer />
            <Header />
            <main>

                {/* ─── PAGE HERO ─── */}
                <div className="page-hero page-hero-tall">
                    <div className="page-bg-text">SERVICES</div>
                    <div className="page-hero-inner">
                        <div className="eyebrow-badge">
                            {SERVICES_HERO.badge}
                        </div>
                        <h1 className="page-title">
                            {SERVICES_HERO.title}{' '}
                            <span className="text-accent">{SERVICES_HERO.titleAccent}</span>
                        </h1>
                        <p className="page-subtitle">
                            {SERVICES_HERO.description}
                        </p>
                        <div className="hero-btns">
                            <a href="#services" className="btn btn-primary"><i className="bx bx-rocket" /> Explore Services</a>
                            <Link href="/contact" className="btn btn-secondary"><i className="bx bx-phone" /> Get Started</Link>
                        </div>
                    </div>
                </div>

                {/* ─── SERVICES GRID ─── */}
                <section className="section" id="services">
                    <div className="sh center anim">
                        <div className="eyebrow">What We Build</div>
                        <h2>Our Comprehensive <span className="grad-text">Services</span></h2>
                        <p>End-to-end digital solutions tailored to transform your business</p>
                    </div>
                    <div className="srv-grid">
                        {SERVICES.map((s: any) => (
                            <div key={s.id} className="srv-card anim" id={s.id}>
                                {s.badge && <div className={`srv-badge${s.badgeClass ? ' ' + s.badgeClass : ''}`}>{s.badge}</div>}
                                <div className="srv-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <ul className="srv-feats">
                                    {s.features.map((f: any) => <li key={f}>{f}</li>)}
                                </ul>
                                <a href={`/services/${s.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--blue)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', marginTop: '20px', transition: 'gap var(--t)' }}>
                                    Learn More <i className="bx bx-right-arrow-alt" />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── WHY US ─── */}
                <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
                    <div className="section">
                        <div className="sh center anim">
                            <div className="eyebrow">Our Advantage</div>
                            <h2>Why Choose <span className="grad-text">AKS Automations</span>?</h2>
                            <p>We combine cutting-edge technology with creative precision to deliver digital excellence</p>
                        </div>
                        <div className="features-grid">
                            {WHY_US.map((f: any) => (
                                <div key={f.title} className="feat-card anim">
                                    <div className="feat-icon">{f.icon}</div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── PACKAGES ─── */}
                <section className="section" id="packages">
                    <div className="sh center anim">
                        <div className="eyebrow">Pricing</div>
                        <h2>Service <span className="grad-text">Packages</span></h2>
                        <p>Choose the package that fits your business — or contact us for a custom quote</p>
                    </div>
                    <div className="pkg-grid">
                        {PACKAGES.map((pkg: any) => (
                            <div key={pkg.title} className={`pkg-card anim${pkg.recommended ? ' rec' : ''}`}>
                                {pkg.recommended && <div className="pkg-badge">⭐ Recommended</div>}
                                <h3>{pkg.title}</h3>
                                <p>{pkg.desc}</p>
                                <ul className="pkg-feats">
                                    {pkg.features.map((f: any) => <li key={f}>{f}</li>)}
                                </ul>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: '20px', justifyContent: 'center', width: '100%' }}>
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── FAQ ─── */}
                <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '80px 0' }}>
                    <div className="section">
                        <div className="sh center anim">
                            <div className="eyebrow">Support</div>
                            <h2>Frequently Asked <span className="grad-text">Questions</span></h2>
                            <p>Everything you need to know before getting started</p>
                        </div>
                        <div className="faq-grid">
                            {SERVICES_FAQS.map((faq: any, i: any) => (
                                <div key={i} className="faq-item anim">
                                    <div className="faq-q">{faq.q}</div>
                                    <div className="faq-a">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA BAND ─── */}
                <div className="cta-band">
                    <div className="cta-band-inner">
                        <h2>Ready to Transform Your Business?</h2>
                        <p>Let&apos;s discuss your project and create something extraordinary together</p>
                        <div className="cta-btns">
                            <a href={SITE_CONFIG.contact.calendlyUrl} className="btn btn-white" target="_blank" rel="noopener noreferrer">
                                <i className="bx bx-rocket" /> Schedule a Free Call
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
