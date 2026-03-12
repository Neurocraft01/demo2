import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Observer from '@/components/Observer';
import { getSiteContent } from '@/lib/content';
import ProjectsClient from '@/components/projects/ProjectsClient';

export default async function ProjectsPage() {
    const data = await getSiteContent<any>('projects');
    const { SITE_CONFIG } = await getSiteContent<any>('site');

    return (
        <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
            <Observer />
            <Header />

            <style dangerouslySetInnerHTML={{ __html: `
                ::selection { background: #6366f1; color: white; }
                .reveal-anim {
                    opacity: 0;
                    transform: translateY(40px) scale(0.95);
                    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-anim.in-view {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 24px;
                }
                .bento-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .bento-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5);
                }
                .bento-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%);
                    opacity: 0;
                    transition: opacity 0.5s;
                    z-index: 0;
                    pointer-events: none;
                }
                .bento-card:hover::before { opacity: 1; }
                
                .card-content {
                    padding: 32px;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .bento-large { grid-column: span 8; min-height: 400px; }
                .bento-medium { grid-column: span 6; min-height: 350px; }
                .bento-small { grid-column: span 4; min-height: 350px; }
                
                @media (max-width: 1024px) {
                    .bento-large, .bento-medium, .bento-small { grid-column: span 6; }
                }
                @media (max-width: 768px) {
                    .bento-large, .bento-medium, .bento-small { grid-column: span 12; min-height: auto; }
                }

                .tag-chip {
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s;
                }

                .tab-pill {
                    padding: 12px 24px;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: transparent;
                    color: rgba(255,255,255,0.6);
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .tab-pill:hover {
                    color: white;
                    border-color: rgba(255,255,255,0.3);
                }
                .tab-pill.active {
                    background: white;
                    color: black;
                    border-color: white;
                }

                .gradient-text-hero {
                    background: linear-gradient(to right, #ffffff, #a1a1aa);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                /* Lines animation in hero */
                .grid-lines {
                    position: absolute;
                    inset: 0;
                    background-size: 50px 50px;
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
                    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
                    z-index: 0;
                    pointer-events: none;
                }
            `}} />

            <main>
                {/* ─── CREATIVE HERO PAGE ─── */}
                <section style={{
                    position: 'relative',
                    padding: '160px 24px 100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '60vh',
                    justifyContent: 'center'
                }}>
                    <div className="grid-lines" />
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60vw',
                        height: '60vw',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
                        filter: 'blur(60px)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '32px',
                            fontWeight: 600,
                            fontSize: '14px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 10px #6366f1' }} />
                            The Masterpieces
                        </div>
                        <h1 className="gradient-text-hero" style={{
                            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-2px',
                            marginBottom: '24px'
                        }}>
                            Engineered for Impact.<br />Designed to Surprise.
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6,
                            maxWidth: '650px',
                            margin: '0 auto'
                        }}>
                            Explore our bento-grid of innovation. From highly-scalable SaaS applications to self-thinking AI automations. We build the impossible.
                        </p>
                    </div>
                </section>

                {/* ─── CLIENT CONTENT ─── */}
                <ProjectsClient data={data} siteData={{ SITE_CONFIG }} />
            </main>
            <Footer />
        </div>
    );
}
