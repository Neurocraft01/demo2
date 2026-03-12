'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/data/site';

export default function Footer() {
    const logoUrl: string = SITE_CONFIG.logo.logoUrl || '';
    const logoVerticalUrl: string = SITE_CONFIG.logo.logoVerticalUrl || '';
    const brandDesc: string = SITE_CONFIG.footer.brandDesc;
    const copyright: string = SITE_CONFIG.footer.copyright;
    const quickLinks = SITE_CONFIG.footer.quickLinks;
    const projectLinks = SITE_CONFIG.footer.projectLinks;
    const contactLinks = SITE_CONFIG.footer.contactLinks;

    return (
        <footer className="footer">
            <div className="footer-grid">
                {/* Brand column */}
                <div className="footer-brand">
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        {logoVerticalUrl ? (
                            <Image
                                src={logoVerticalUrl}
                                alt="AKS Automations"
                                width={160}
                                height={80}
                                style={{ objectFit: 'contain', maxHeight: '80px', width: 'auto' }}
                            />
                        ) : logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt="AKS Automations"
                                width={160}
                                height={40}
                                style={{ objectFit: 'contain', maxHeight: '40px', width: 'auto' }}
                            />
                        ) : (
                            <>
                                <div className="logo-icon" style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 900 }}>{SITE_CONFIG.logo.short}</div>
                                <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.3px' }}>AKS<em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>Automations</em></span>
                            </>
                        )}
                    </Link>
                    <p>{brandDesc}</p>
                    <div className="footer-socials">
                        <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                        <a href={SITE_CONFIG.social.linkedin} aria-label="LinkedIn"><i className="bx bxl-linkedin" /></a>
                        <a href={SITE_CONFIG.social.youtube} aria-label="YouTube"><i className="bx bxl-youtube" /></a>
                        <a href={`mailto:${SITE_CONFIG.contact.email}`} aria-label="Email"><i className="bx bx-envelope" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        {quickLinks.map((link) => (
                            <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Projects */}
                <div className="footer-col">
                    <h4>Projects</h4>
                    <ul>
                        {projectLinks.map((link) => (
                            <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4>Get in Touch</h4>
                    <ul>
                        {contactLinks.map((link) => (
                            <li key={link.href}>
                                {link.href.startsWith('/') ? (
                                    <Link href={link.href}>{link.label}</Link>
                                ) : (
                                    <a href={link.href}>{link.label}</a>
                                )}
                            </li>
                        ))}
                        <li><a href={SITE_CONFIG.contact.calendlyUrl} target="_blank" rel="noopener noreferrer">Book a Call ↗</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>{copyright}</p>
                <div className="footer-socials">
                    <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                    <a href={SITE_CONFIG.social.linkedin} aria-label="LinkedIn"><i className="bx bxl-linkedin" /></a>
                    <a href={`mailto:${SITE_CONFIG.contact.email}`} aria-label="Email"><i className="bx bx-envelope" /></a>
                </div>
            </div>
        </footer>
    );
}
