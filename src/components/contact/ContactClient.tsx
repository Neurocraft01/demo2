'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ContactClient({ data, siteData }: { data: any, siteData: any }) {
    const { CONTACT_HERO, CONTACT_INFO, FORM_CONFIG, CONTACT_FAQS } = data;
    const { SITE_CONFIG } = siteData;

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.anim').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);
        const contactData = {
            user_name: formData.get('user_name') as string,
            user_email: formData.get('user_email') as string,
            phone: formData.get('phone') as string,
            service: formData.get('service') as string,
            message: formData.get('message') as string,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            setStatus('success');
            (e.target as HTMLFormElement).reset();

            // Open WhatsApp notification in new tab (for admin)
            if (result.whatsappUrl) {
                window.open(result.whatsappUrl, '_blank');
            }

            setTimeout(() => setStatus('idle'), 8000);
        } catch (err: unknown) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <main>
            {/* ─── PAGE HERO ─── */}
            <div className="page-hero">
                <div className="page-bg-text">CONTACT</div>
                <div className="page-hero-inner">
                    <div className="eyebrow-badge">
                        {CONTACT_HERO.badge}
                    </div>
                    <h1 className="page-title">
                        {CONTACT_HERO.title}{' '}
                        <span className="text-accent">{CONTACT_HERO.titleAccent}</span>
                    </h1>
                    <p className="page-subtitle">
                        {CONTACT_HERO.description}
                    </p>
                </div>
            </div>

            {/* ─── CONTACT GRID ─── */}
            <section className="section" style={{ paddingTop: '48px' }}>
                <div className="contact-page-grid">

                    {/* ── LEFT: Info ── */}
                    <div className="anim">
                        <div className="eyebrow">{CONTACT_INFO.sectionTitle}</div>
                        <h2 className="contact-heading">
                            {CONTACT_INFO.heading}
                        </h2>

                        {CONTACT_INFO.tiles.map((tile: any, i: any) => (
                            <div key={i} className="contact-tile">
                                <div className="c-icon">{tile.emoji}</div>
                                <div>
                                    <div className="c-label">{tile.label}</div>
                                    <div className="c-val">
                                        {tile.values.map((v: any, j: any) => (
                                            <span key={j}>
                                                {v.href ? <a href={v.href}>{v.text}</a> : v.text}
                                                {j < tile.values.length - 1 && <br />}
                                            </span>
                                        ))}
                                        {tile.subtext && (
                                            <><br /><span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{tile.subtext}</span></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="c-socials" style={{ marginTop: '28px' }}>
                            <a href={SITE_CONFIG?.social?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="c-soc" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                            <a href={SITE_CONFIG?.social?.linkedin || '#'} aria-label="LinkedIn" className="c-soc"><i className="bx bxl-linkedin" /></a>
                        </div>

                        <div className="cal-box">
                            <h3>{CONTACT_INFO.calendly.title}</h3>
                            <p>{CONTACT_INFO.calendly.description}</p>
                            <a href={CONTACT_INFO.calendly.linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <i className="bx bx-calendar" /> {CONTACT_INFO.calendly.linkText}
                            </a>
                        </div>
                    </div>

                    {/* ── RIGHT: Form ── */}
                    <div className="anim">
                        <div className="c-form-box">
                            <div className="c-callout">
                                <div className="c-callout-icon">💬</div>
                                <div className="c-callout-body">
                                    <h4 style={{ margin: 0, fontSize: 13, color: 'var(--ink)' }}>{FORM_CONFIG.calloutText}</h4>
                                </div>
                            </div>

                            <h3>{FORM_CONFIG.title}</h3>

                            {status === 'success' && (
                                <div className="form-alert form-alert-success">
                                    {FORM_CONFIG.successMessage}
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="form-alert form-alert-error">
                                    ✕ {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="fg">
                                        <input id="c-name" name="user_name" type="text" required placeholder="Your full name" />
                                    </div>
                                    <div className="fg">
                                        <input id="c-email" name="user_email" type="email" required placeholder="your@email.com" />
                                    </div>
                                </div>
                                <div className="fg">
                                    <input id="c-phone" name="phone" type="tel" placeholder="+91 00000 00000 (Optional)" />
                                </div>
                                <div className="fg">
                                    <select id="c-service" name="service" style={{ color: 'var(--ink)' }}>
                                        {FORM_CONFIG.services.map((s: any) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="fg">
                                    <textarea id="c-message" name="message" required placeholder="Tell us about your project, requirements, and timeline…" rows={5} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'sending'}>
                                    {status === 'sending' ? '⏳ Sending…' : <><i className="bx bx-send" /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            {/* ─── FAQs ─── */}
            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '80px 0' }}>
                <div className="section">
                    <div className="sh center anim">
                        <div className="eyebrow">FAQ</div>
                        <h2>Frequently Asked <span className="grad-text">Questions</span></h2>
                        <p>Everything you need to know before getting started</p>
                    </div>
                    <div className="faq-grid">
                        {CONTACT_FAQS.map((faq: any, i: any) => (
                            <div key={i} className="faq-item anim">
                                <div className="faq-q">{faq.q}</div>
                                <div className="faq-a">{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
