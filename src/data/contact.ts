// ─── Contact Page Content (CMS) ───
// Edit this file to update all content on the Contact page

export const CONTACT_HERO = {
    badge: 'Get In Touch',
    title: "Let's Build Something",
    titleAccent: 'Great',
    description: 'Ready to transform your ideas into reality? Reach out — we respond within 24 hours and offer a free 30-minute consultation to every new client.',
};

export const CONTACT_INFO = {
    sectionTitle: 'Contact Details',
    heading: "We'd Love to Hear From You",
    tiles: [
        {
            emoji: '📞', label: 'Phone',
            values: [
                { text: '+91 91569 03129', href: 'tel:+919156903129' },
                { text: '+91 93226 87523', href: 'tel:+919322687523' },
            ],
        },
        {
            emoji: '✉️', label: 'Email',
            values: [
                { text: 'aksaiautomation@gmail.com', href: 'mailto:aksaiautomation@gmail.com' },
            ],
        },
        {
            emoji: '📍', label: 'Location',
            values: [
                { text: 'Pune, Maharashtra, India', href: '' },
            ],
            subtext: 'Working with clients globally',
        },
        {
            emoji: '🕐', label: 'Working Hours',
            values: [
                { text: 'Mon–Sat: 9 AM – 8 PM IST', href: '' },
            ],
            subtext: 'Emergency support: 24/7',
        },
    ],
    calendly: {
        title: '📅 Book a Free 30-min Call',
        description: "Tell us what you're building. We'll give you honest advice on the best approach.",
        linkText: 'Open Calendly',
        linkUrl: 'https://calendly.com/aksaiautomation/contact',
    },
};

export const FORM_CONFIG = {
    calloutText: 'We reply within 24 hours',
    title: 'Send Us a Message',
    successMessage: "✓ Message sent! We'll be in touch within 24 hours.",
    services: [
        { value: '', label: 'Select a service…' },
        { value: 'web-development', label: 'Web Development' },
        { value: 'ai-chatbots', label: 'AI Agents & Chatbots' },
        { value: 'automation', label: 'Automation Solutions' },
        { value: 'data-analysis', label: 'Data Analysis' },
        { value: 'backend', label: 'Backend Development' },
        { value: 'custom', label: 'Custom Solution' },
    ],
};

export const CONTACT_FAQS = [
    { q: 'How long does a typical project take?', a: 'A simple website takes 1–2 weeks. Complex AI automation projects can take 4–8 weeks. We provide detailed timelines during our free consultation call.' },
    { q: 'What is your pricing model?', a: 'We offer fixed pricing for well-defined projects and hourly for ongoing work. Contact us for a free quote tailored to your specific needs.' },
    { q: 'Do you provide post-launch support?', a: "Yes! All packages include post-launch support — 6–12 months depending on your package. We're always available for urgent issues." },
    { q: 'Can you work with international clients?', a: 'Absolutely. We work with clients worldwide via Slack, Zoom, and GitHub — flexible with time zones.' },
    { q: 'What technologies do you use?', a: 'Next.js, React, Python, Node.js, PostgreSQL, AWS, Google Cloud, and for AI: OpenAI, Claude, Gemini, and more.' },
    { q: 'How do I get started?', a: 'Fill in the form, email us, or book a free Calendly call. We respond within 24 hours to discuss your requirements.' },
];
