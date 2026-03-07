import Image from 'next/image';
import { TECH_STACK } from '@/data/home';

export default function TechSection() {
    return (
        <section className="tech-band" style={{ padding: '60px 0', borderTop: 'none' }}>
            <div className="tech-band-label">Technologies That Power Us</div>
            <p style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: '15px', marginBottom: '40px' }}>
                Cutting-edge tools and frameworks for modern web development
            </p>
            <div className="tech-section">
                <div className="tech-track">
                    {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                        <div key={i} className="tech-tile">
                            <div className="tech-tile-icon" style={{ position: 'relative', width: '64px', height: '64px' }}>
                                <Image src={tech.icon} alt={tech.name} fill style={{ objectFit: 'contain' }} loading="lazy" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
