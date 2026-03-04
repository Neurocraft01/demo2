'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STEPS = [
    { icon: '📧', step: '1', title: 'We Got Your Message', desc: 'Your enquiry has been received and logged in our system.' },
    { icon: '⏰', step: '2', title: 'We Reply Within 24 Hours', desc: 'Expect a detailed, personalised response from our team within 24 hours.' },
    { icon: '📅', step: '3', title: 'Free Consultation Call', desc: 'We\'ll schedule a free 30-min call to fully understand your requirements.' },
    { icon: '🚀', step: '4', title: 'We Start Building', desc: 'Once aligned, we kick off your project with a clear plan and timeline.' },
];

export default function ThankYouPage() {
    return (
        <>
            <Header />
            <main>
                {/* ─── HERO ─── */}
                <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
                    <div className="page-bg-text" style={{ fontSize: 'clamp(60px, 10vw, 130px)' }}>RECEIVED</div>
                    <div style={{ zIndex: 10, position: 'relative', padding: '0 20px', maxWidth: '700px', margin: '0 auto' }}>
                        {/* Check mark */}
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #384BFF, #7B5AFF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: '36px',
                            boxShadow: '0 0 40px rgba(56, 75, 255, 0.4)'
                        }}>
                            ✓
                        </div>
                        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px', fontSize: '14px' }}>
                            Message Received!
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto 20px' }}>
                            Thank You for{' '}
                            <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Reaching Out</span>
                        </h1>
                        <p style={{ color: 'var(--ink-3)', fontSize: '18px', lineHeight: 1.7, marginBottom: '36px' }}>
                            Your message is with our team. We&apos;ll personally review your requirements and get back to
                            you within <strong style={{ color: 'var(--ink)' }}>24 hours</strong>.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/" className="btn btn-primary"><i className="bx bx-home" /> Back to Home</Link>
                            <a href="https://calendly.com/aksaiautomation/contact" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <i className="bx bx-calendar" /> Book a Call Now
                            </a>
                        </div>
                    </div>
                </section>

                {/* ─── WHAT HAPPENS NEXT ─── */}
                <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '100px 28px' }}>
                    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>Next Steps</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
                                Here&apos;s What <span className="grad-text">Happens Next</span>
                            </h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            {STEPS.map((s) => (
                                <div key={s.step} style={{
                                    background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
                                    padding: '32px 24px', textAlign: 'center', position: 'relative'
                                }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%', background: 'var(--blue)', color: '#fff',
                                        fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 16px', position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)'
                                    }}>{s.step}</div>
                                    <div style={{ fontSize: '2.2rem', marginTop: '12px', marginBottom: '14px' }}>{s.icon}</div>
                                    <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '15px', marginBottom: '8px' }}>{s.title}</div>
                                    <p style={{ color: 'var(--ink-3)', fontSize: '13.5px', lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CALENDLY CTA ─── */}
                <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '80px 28px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--ink)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
                            Can&apos;t Wait? Book a Call Right Now
                        </h3>
                        <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
                            Skip the waiting — schedule a free 30-minute consultation directly in our calendar.
                            We&apos;ll discuss your project and give you honest expert advice at no cost.
                        </p>
                        <a href="https://calendly.com/aksaiautomation/contact" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '16px', padding: '16px 36px' }}>
                            <i className="bx bx-calendar-check" /> Open Calendly
                        </a>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
