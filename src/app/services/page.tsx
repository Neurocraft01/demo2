'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SERVICES = [
    {
        icon: '🌐', id: 'web-development', title: 'Web Development', badge: 'Popular', badgeClass: '',
        desc: 'Custom websites and web applications built with modern technologies, responsive design, and performance-first architecture.',
        features: ['Responsive Design', 'SEO Optimisation', 'Performance Focused', 'Cross-browser Compatible'],
    },
    {
        icon: '🤖', id: 'ai-chatbots', title: 'AI Agents & Chatbots', badge: 'Trending', badgeClass: 'trending',
        desc: 'Intelligent AI agents that automate your customer service, lead generation, and internal workflows around the clock.',
        features: ['Custom AI Agents', 'Chatbot Integration', 'Natural Language Processing', '24/7 Automation'],
    },
    {
        icon: '🗄️', id: 'backend-development', title: 'Backend Development', badge: null, badgeClass: '',
        desc: 'Robust server-side solutions with databases, APIs, and cloud integrations for scalable applications.',
        features: ['RESTful APIs', 'Database Design', 'Cloud Integration', 'Scalable Architecture'],
    },
    {
        icon: '📊', id: 'data-analysis', title: 'Data Analysis & Visualisation', badge: null, badgeClass: '',
        desc: 'Transform raw data into actionable insights with advanced analytics, dashboards, and machine learning.',
        features: ['Statistical Analysis', 'Predictive Modeling', 'Data Mining', 'Business Intelligence'],
    },
    {
        icon: '⚙️', id: 'automation', title: 'Automation Solutions', badge: 'Hot', badgeClass: 'hot',
        desc: 'Streamline your workflows with intelligent automation — from email campaigns to multi-step business pipelines.',
        features: ['Process Automation', 'Workflow Optimisation', 'Integration Services', 'Custom Scripts'],
    },
    {
        icon: '📈', id: 'seo-performance', title: 'SEO & Performance', badge: null, badgeClass: '',
        desc: 'Rank higher on Google and load faster — we optimise Core Web Vitals, local SEO, and content strategy.',
        features: ['Technical SEO Audit', 'Core Web Vitals', 'Local SEO Pune', 'Performance Optimisation'],
    },
];

const PACKAGES = [
    { title: 'Starter', desc: 'Perfect for small businesses', recommended: false, features: ['Static Website (Up to 5 pages)', 'Responsive Design', '6 Months Support', 'Hosting Setup', 'Contact Form'] },
    { title: 'Professional', desc: 'Complete solution for growing teams', recommended: true, features: ['Frontend + Booking System', 'Free Domain & Hosting', 'Database Integration', 'User Authentication', '12 Months Support'] },
    { title: 'Enterprise', desc: 'Advanced features for established brands', recommended: false, features: ['AI Agent Integration', 'AI Chatbot', 'Advanced SEO', 'Performance Analytics', 'Priority Support'] },
    { title: 'AI Automation', desc: 'Workflow automation & intelligent agents', recommended: false, features: ['Custom AI Agents', 'Workflow Automation', 'API Integrations', 'Process Optimisation', 'Comprehensive Support'] },
];

const FAQS = [
    { q: 'How long does a typical project take?', a: 'A simple website takes 1–2 weeks. Complex AI automation projects take 4–8 weeks. We provide a detailed timeline during consultation.' },
    { q: 'What is your pricing model?', a: 'We offer fixed pricing for well-defined projects and hourly for ongoing work. Contact us for a free custom quote.' },
    { q: 'Do you offer post-launch support?', a: 'Yes — all packages include 6–12 months of maintenance. We\'re also available for urgent issues 24/7.' },
    { q: 'Can you work with international clients?', a: 'Absolutely. We work with clients worldwide using Slack, Zoom, and GitHub for seamless collaboration across time zones.' },
];

export default function ServicesPage() {
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

                {/* ─── PAGE HERO ─── */}
                <div style={{ minHeight: '50vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '160px', paddingBottom: '60px', background: 'var(--bg)', overflow: 'hidden' }}>
                    <div className="page-bg-text">SERVICES</div>
                    <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%', position: 'relative' }}>
                        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}>
                            Our Services
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto', maxWidth: '800px' }}>
                            Transform Your Business with <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>AI-Powered Solutions</span>
                        </h1>
                        <p style={{ color: 'var(--ink-3)', maxWidth: '600px', margin: '20px auto 0', fontSize: '18px', lineHeight: 1.6 }}>
                            From intelligent web development to advanced automation — we deliver cutting-edge digital solutions
                            that revolutionise your operations and accelerate growth.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
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
                        {SERVICES.map((s) => (
                            <div key={s.id} className="srv-card anim" id={s.id}>
                                {s.badge && <div className={`srv-badge${s.badgeClass ? ' ' + s.badgeClass : ''}`}>{s.badge}</div>}
                                <div className="srv-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <ul className="srv-feats">
                                    {s.features.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                                <Link href={`/services/${s.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--blue)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', marginTop: '20px', transition: 'gap var(--t)' }}
                                    onMouseEnter={e => (e.currentTarget.style.gap = '12px')}
                                    onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
                                >
                                    Learn More <i className="bx bx-right-arrow-alt" />
                                </Link>
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
                            {[
                                { icon: '🧠', title: 'AI-Powered', desc: 'Leverage the latest AI to automate processes and build smarter user experiences.' },
                                { icon: '💻', title: 'Modern Stack', desc: 'Next.js, React, Python, Node.js — we always use the right tool for the job.' },
                                { icon: '🛟', title: '24/7 Support', desc: 'Dedicated support to keep your solutions running smoothly at all times.' },
                                { icon: '📈', title: 'Scalable', desc: 'Future-proof solutions that grow with your business requirements.' },
                                { icon: '⚡', title: 'Fast Delivery', desc: 'Streamlined process ensures quick turnarounds without compromising quality.' },
                                { icon: '💰', title: 'Cost-Effective', desc: 'High-quality results at competitive pricing — maximising your ROI.' },
                            ].map((f) => (
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
                    <div className="pkg-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {PACKAGES.map((pkg) => (
                            <div key={pkg.title} className={`pkg-card anim${pkg.recommended ? ' rec' : ''}`}>
                                {pkg.recommended && <div className="pkg-badge">⭐ Recommended</div>}
                                <h3>{pkg.title}</h3>
                                <p>{pkg.desc}</p>
                                <ul className="pkg-feats">
                                    {pkg.features.map((f) => <li key={f}>{f}</li>)}
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
                            {FAQS.map((faq, i) => (
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
                            <a href="https://calendly.com/aksaiautomation/contact" className="btn btn-white" target="_blank" rel="noopener noreferrer">
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
