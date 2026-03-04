import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                {/* Brand column */}
                <div className="footer-brand">
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div className="logo-icon" style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 900 }}>AKS</div>
                        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.3px' }}>AKS<em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>Automations</em></span>
                    </Link>
                    <p>AI-powered web development & automation agency based in Pune, India — working with clients worldwide.</p>
                    <div className="footer-socials">
                        <a href="https://www.instagram.com/aks_automation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                        <a href="#" aria-label="LinkedIn"><i className="bx bxl-linkedin" /></a>
                        <a href="#" aria-label="YouTube"><i className="bx bxl-youtube" /></a>
                        <a href="mailto:aksaiautomation@gmail.com" aria-label="Email"><i className="bx bx-envelope" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/#about">About Us</Link></li>
                        <li><Link href="/#process">Our Process</Link></li>
                        <li><Link href="/services">Services</Link></li>
                    </ul>
                </div>

                {/* Projects */}
                <div className="footer-col">
                    <h4>Projects</h4>
                    <ul>
                        <li><Link href="/projects">All Projects</Link></li>
                        <li><Link href="/projects?tab=website">Websites</Link></li>
                        <li><Link href="/projects?tab=automation">AI Automation</Link></li>
                        <li><Link href="/projects?tab=data-analysis">Data Analysis</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4>Get in Touch</h4>
                    <ul>
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><a href="tel:+919156903129">+91 91569 03129</a></li>
                        <li><a href="mailto:aksaiautomation@gmail.com">aksaiautomation@gmail.com</a></li>
                        <li><a href="https://calendly.com/aksaiautomation/contact" target="_blank" rel="noopener noreferrer">Book a Call ↗</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 AKS Automations. All rights reserved. Built with ❤️ in Pune, India.</p>
                <div className="footer-socials">
                    <a href="https://www.instagram.com/aks_automation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bx bxl-instagram" /></a>
                    <a href="#" aria-label="LinkedIn"><i className="bx bxl-linkedin" /></a>
                    <a href="mailto:aksaiautomation@gmail.com" aria-label="Email"><i className="bx bx-envelope" /></a>
                </div>
            </div>
        </footer>
    );
}
