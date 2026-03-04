'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FAQS = [
    { q: 'How long does a typical project take?', a: 'A simple website takes 1–2 weeks. Complex AI automation projects can take 4–8 weeks. We provide detailed timelines during our free consultation call.' },
    { q: 'What is your pricing model?', a: 'We offer fixed pricing for well-defined projects and hourly for ongoing work. Contact us for a free quote tailored to your specific needs.' },
    { q: 'Do you provide post-launch support?', a: 'Yes! All packages include post-launch support — 6–12 months depending on your package. We\'re always available for urgent issues.' },
    { q: 'Can you work with international clients?', a: 'Absolutely. We work with clients worldwide via Slack, Zoom, and GitHub — flexible with time zones.' },
    { q: 'What technologies do you use?', a: 'Next.js, React, Python, Node.js, PostgreSQL, AWS, Google Cloud, and for AI: OpenAI, Claude, Gemini, and more.' },
    { q: 'How do I get started?', a: 'Fill in the form, email us, or book a free Calendly call. We respond within 24 hours to discuss your requirements.' },
];

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

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
        await new Promise((r) => setTimeout(r, 1400));
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <>
            <Header />
            <main>

                {/* ─── PAGE HERO ─── */}
                <div style={{ minHeight: '40vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '160px', paddingBottom: '60px', background: 'var(--bg)', overflow: 'hidden' }}>
                    <div className="page-bg-text">CONTACT</div>
                    <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%', maxWidth: '800px', position: 'relative' }}>
                        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}>
                            Get In Touch
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto', marginBottom: '20px' }}>
                            Let&apos;s Build Something <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Great</span>
                        </h1>
                        <p style={{ color: 'var(--ink-3)', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>
                            Ready to transform your ideas into reality? Reach out — we respond within 24 hours and offer a
                            free 30-minute consultation to every new client.
                        </p>
                    </div>
                </div>

                {/* ─── CONTACT GRID ─── */}
                <section className="section" style={{ paddingTop: '48px' }}>
                    <div className="contact-page-grid">

                        {/* ── LEFT: Info ── */}
                        <div className="anim">
                            <div className="eyebrow">Contact Details</div>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--ink)', marginBottom: '32px', lineHeight: 1.15 }}>
                                We&apos;d Love to Hear From You
                            </h2>

                            <div className="contact-tile">
                                <div className="c-icon">📞</div>
                                <div>
                                    <div className="c-label">Phone</div>
                                    <div className="c-val">
                                        <a href="tel:+919156903129">+91 91569 03129</a><br />
                                        <a href="tel:+919322687523">+91 93226 87523</a>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-tile">
                                <div className="c-icon">✉️</div>
                                <div>
                                    <div className="c-label">Email</div>
                                    <div className="c-val"><a href="mailto:aksaiautomation@gmail.com">aksaiautomation@gmail.com</a></div>
                                </div>
                            </div>
                            <div className="contact-tile">
                                <div className="c-icon">📍</div>
                                <div>
                                    <div className="c-label">Location</div>
                                    <div className="c-val">Pune, Maharashtra, India<br /><span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>Working with clients globally</span></div>
                                </div>
                            </div>
                            <div className="contact-tile">
                                <div className="c-icon">🕐</div>
                                <div>
                                    <div className="c-label">Working Hours</div>
                                    <div className="c-val">Mon–Sat: 9 AM – 8 PM IST<br />Emergency support: 24/7</div>
                                </div>
                            </div>

                            <div className="c-socials" style={{ marginTop: '28px' }}>
                                <a href="https://www.instagram.com/aks_automation/" target="_blank" rel="noopener noreferrer" className="c-soc" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                                <a href="#" aria-label="LinkedIn" className="c-soc"><i className="bx bxl-linkedin" /></a>
                            </div>

                            <div className="cal-box">
                                <h3>📅 Book a Free 30-min Call</h3>
                                <p>Tell us what you&apos;re building. We&apos;ll give you honest advice on the best approach.</p>
                                <a href="https://calendly.com/aksaiautomation/contact" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    <i className="bx bx-calendar" /> Open Calendly
                                </a>
                            </div>
                        </div>

                        {/* ── RIGHT: Form ── */}
                        <div className="anim">
                            <div className="c-form-box" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '40px' }}>
                                <div className="c-callout">
                                    <div className="c-callout-icon">💬</div>
                                    <div className="c-callout-body">
                                        <h4 style={{ margin: 0, fontSize: 13, color: 'var(--ink)' }}>We reply within 24 hours</h4>
                                    </div>
                                </div>

                                <h3>Send Us a Message</h3>

                                {status === 'success' && (
                                    <div style={{
                                        padding: '14px 18px', borderRadius: '12px', background: '#f0fdf4',
                                        border: '1px solid #bbf7d0', color: '#16a34a', marginBottom: '20px',
                                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500,
                                    }}>
                                        ✓ Message sent! We&apos;ll be in touch within 24 hours.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
                                            <option value="">Select a service…</option>
                                            <option value="web-development">Web Development</option>
                                            <option value="ai-chatbots">AI Agents &amp; Chatbots</option>
                                            <option value="automation">Automation Solutions</option>
                                            <option value="data-analysis">Data Analysis</option>
                                            <option value="backend">Backend Development</option>
                                            <option value="custom">Custom Solution</option>
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
                            {FAQS.map((faq, i) => (
                                <div key={i} className="faq-item anim">
                                    <div className="faq-q">{faq.q}</div>
                                    <div className="faq-a">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
