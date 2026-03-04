'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ALL_PROJECTS = [
    { title: 'YOMA Company Portfolio', gradientPart: 'Portfolio', desc: 'Built a responsive company landing page in React with interactive 3D elements. Clear content hierarchy with animations to enhance engagement and product clarity.', link: 'https://v0-yoma-website-clone.vercel.app/', tags: ['React', 'Three.js', '3D UI', 'Responsive'], category: 'landing' },
    { title: 'Drinkos Landing Website', gradientPart: 'Landing', desc: 'Led end-to-end front-end development — responsive layouts, client content curation, animation integration, and product flow illustrations.', link: 'https://thedrinkos.com/', tags: ['HTML/CSS', 'JavaScript', 'Animations'], category: 'landing' },
    { title: 'Yash Enterprises Company Website', gradientPart: 'Company', desc: 'Full frontend — responsive layouts, service modules, contact form integration, asset optimisation, and CI/CD deployment via Netlify.', link: 'https://yashenterprises.netlify.app/', tags: ['Next.js', 'Netlify', 'CI/CD', 'SEO'], category: 'website' },
    { title: 'Kunal Shinde Portfolio Website', gradientPart: 'Portfolio', desc: 'Modern portfolio presenting skills and projects as both an online resume and a showcase of UI skills and API integrations.', link: 'https://kunalshinde.netlify.app/', tags: ['React', 'API Integration', 'UI/UX'], category: 'portfolio' },
    { title: 'Olympics Data Analysis Dashboard', gradientPart: 'Data Analysis', desc: 'Comprehensive Olympics statistics analysis across multiple decades, with interactive visualisations revealing athlete performance trends.', link: '#', tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'], category: 'data-analysis' },
    { title: 'E-commerce Sales Analytics', gradientPart: 'Sales Analytics', desc: 'Robust sales analytics pipeline processing millions of transactions — uncovering patterns that drove a 23% increase in conversion rates.', link: '#', tags: ['Python', 'SQL', 'PowerBI', 'ML'], category: 'data-analysis' },
    { title: 'UBER Data Visualization', gradientPart: 'Visualization', desc: 'Interactive visualisation of Uber ride patterns across major cities — dynamic maps revealing peak hours, routes, and demand forecasts.', link: '#', tags: ['D3.js', 'Python', 'Tableau', 'GeoJSON'], category: 'visualization' },
    { title: 'SaaS Metrics Dashboard', gradientPart: 'Metrics Dashboard', desc: 'Real-time SaaS metrics dashboard tracking MRR, churn, user growth, and feature adoption for data-driven product decisions.', link: '#', tags: ['React', 'Chart.js', 'APIs', 'Real-time'], category: 'visualization' },
    { title: 'E-commerce AI Support Bot', gradientPart: 'AI Support Bot', desc: 'Intelligent customer support chatbot handling 80% of queries automatically using advanced NLP — significantly reducing support costs.', link: '#', tags: ['OpenAI', 'Python', 'Node.js', 'NLP'], category: 'chatbot' },
    { title: 'Business Workflow Automation', gradientPart: 'Workflow Automation', desc: 'Comprehensive n8n/Make automation for lead generation, email campaigns, CRM updates, and reporting — saving 20+ hours per week.', link: '#', tags: ['n8n', 'Make', 'Zapier', 'API'], category: 'automation' },
];

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'landing', label: 'Landing Pages' },
    { id: 'website', label: 'Websites' },
    { id: 'data-analysis', label: 'Data Analysis' },
    { id: 'visualization', label: 'Visualisation' },
    { id: 'chatbot', label: 'AI Chatbots' },
    { id: 'automation', label: 'Automation' },
    { id: 'portfolio', label: 'Portfolios' },
];

const CATEGORY_COLORS: Record<string, string> = {
    landing: '#6366f1', website: '#8b5cf6', 'data-analysis': '#0ea5e9',
    visualization: '#10b981', chatbot: '#f59e0b', automation: '#ef4444', portfolio: '#ec4899',
};

export default function ProjectsPage() {
    const [activeTab, setActiveTab] = useState('all');

    const filtered = activeTab === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter((p) => p.category === activeTab);

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
            { threshold: 0.08 }
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
                    <div className="page-bg-text">PORTFOLIO</div>
                    <div style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%', position: 'relative' }}>
                        <div style={{ color: 'var(--blue)', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '14px' }}>
                            Our Portfolio
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', margin: '0 auto', maxWidth: '800px' }}>
                            Work That <span style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Speaks</span> for Itself
                        </h1>
                        <p style={{ color: 'var(--ink-3)', maxWidth: '600px', margin: '20px auto 0', fontSize: '18px', lineHeight: 1.6 }}>
                            50+ projects across web development, AI automation, data analysis, and intelligent chatbots —
                            each built to make a real impact on our clients&apos; businesses.
                        </p>
                    </div>
                </div>

                {/* ─── FILTER TABS + GRID ─── */}
                <section className="section" style={{ paddingTop: '48px' }}>
                    <div className="tab-row">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Projects as premium cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px', marginTop: '8px' }}>
                        {filtered.map((project, i) => {
                            const accentColor = CATEGORY_COLORS[project.category] || '#4f46e5';
                            return (
                                <div key={i} className="anim" style={{
                                    background: 'var(--white)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--r-xl)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                                    willChange: 'transform',
                                }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.transform = 'translateY(-6px)';
                                        el.style.boxShadow = `0 12px 40px ${accentColor}22`;
                                        el.style.borderColor = `${accentColor}44`;
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.transform = '';
                                        el.style.boxShadow = '';
                                        el.style.borderColor = '';
                                    }}
                                >
                                    {/* Code preview header */}
                                    <div style={{
                                        background: '#0f111a',
                                        padding: '14px 18px 18px',
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'block' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                            {[75, 90, 55, 80, 45, 65].map((w, j) => (
                                                <div key={j} style={{
                                                    height: '7px', borderRadius: '99px',
                                                    background: `linear-gradient(90deg, ${accentColor}80, ${accentColor}22)`,
                                                    width: `${w}%`,
                                                    animation: `lineShimmer 2.8s ease-in-out ${j * 0.15}s infinite`,
                                                }} />
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                                            {project.tags.map((t) => (
                                                <span key={t} style={{
                                                    padding: '3px 9px', borderRadius: '99px',
                                                    border: `1px solid ${accentColor}44`,
                                                    fontSize: '10px', fontWeight: 600,
                                                    color: accentColor, background: `${accentColor}11`,
                                                }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '22px 22px 24px' }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.3 }}>
                                            {project.title.replace(project.gradientPart, '')}
                                            <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                {project.gradientPart}
                                            </span>
                                        </h3>
                                        <p style={{ fontSize: '13.5px', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '20px' }}>{project.desc}</p>
                                        {project.link !== '#' ? (
                                            <a href={project.link} className="proj-link" target="_blank" rel="noopener noreferrer">
                                                <i className="bx bx-link-external" /> View Live Site
                                            </a>
                                        ) : (
                                            <Link href="/contact" className="proj-link">
                                                <i className="bx bx-envelope" /> Get Similar Solution
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                            <h3 style={{ color: 'var(--ink)', marginBottom: '10px' }}>No projects in this category yet</h3>
                            <p style={{ color: 'var(--ink-3)' }}>Check back soon or <Link href="/contact" style={{ color: 'var(--indigo-mid)' }}>contact us</Link> for a custom solution</p>
                        </div>
                    )}
                </section>

                {/* ─── STATS BAND ─── */}
                <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '52px 28px' }}>
                    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '32px', textAlign: 'center' }}>
                        {[['50+', 'Projects Completed'], ['98%', 'Client Satisfaction'], ['3+', 'Years of Experience'], ['24/7', 'Support Available']].map(([num, label]) => (
                            <div key={label} className="anim">
                                <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-2px', background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '8px' }}>{num}</div>
                                <div style={{ fontSize: '13px', color: 'var(--ink-4)', fontWeight: 600 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── CTA BAND ─── */}
                <div className="cta-band">
                    <div className="cta-band-inner">
                        <h2>Want a Project Like These?</h2>
                        <p>Let&apos;s build something extraordinary for your business — from ideation to deployment</p>
                        <div className="cta-btns">
                            <a href="https://calendly.com/aksaiautomation/contact" className="btn btn-white" target="_blank" rel="noopener noreferrer">
                                <i className="bx bx-rocket" /> Start Your Project
                            </a>
                            <Link href="/contact" className="btn btn-ghost">
                                <i className="bx bx-send" /> Send an Enquiry
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}
