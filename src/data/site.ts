// ─── Global Site Configuration (CMS) ───
// Edit this file to update site-wide content: branding, nav, footer, social links, metadata

export const SITE_CONFIG = {
    name: 'AKS Automations',
    tagline: 'Premium Digital Agency',
    description: 'Transforming digital presence with top-tier web development and software solutions.',
    url: 'https://aksautomations.com',
    logo: {
        short: 'AKS',
        full: 'AKSAutomations',
        // Cloudinary URLs — upload via Admin CMS → Site & SEO → logo → logoUrl / logoVerticalUrl
        logoUrl: '/horizontal logo.png', // horizontal banner logo for navbar
        logoVerticalUrl: '/vertical logo.png', // vertical/stacked logo for footer
    },
    contact: {
        email: 'aksaiautomation@gmail.com',
        phones: ['+91 91569 03129', '+91 93226 87523'],
        phonesRaw: ['+919156903129', '+919322687523'],
        location: 'Pune, Maharashtra, India',
        locationDetail: 'Working with clients globally',
        workingHours: 'Mon–Sat: 9 AM – 8 PM IST',
        emergencySupport: 'Emergency support: 24/7',
        calendlyUrl: 'https://calendly.com/aksaiautomation/contact',
        whatsappNumber: '919156903129', // without +
    },
    social: {
        instagram: 'https://www.instagram.com/aks_automation/',
        linkedin: '#',
        youtube: '#',
    },
    navLinks: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/projects', label: 'Projects' },
        { href: '/contact', label: 'Contact' },
    ],
    footer: {
        brandDesc: 'AI-powered web development & automation agency based in Pune, India — working with clients worldwide.',
        copyright: `© ${new Date().getFullYear()} AKS Automations. All rights reserved. Built with ❤️ in Pune, India.`,
        quickLinks: [
            { href: '/', label: 'Home' },
            { href: '/#about', label: 'About Us' },
            { href: '/#process', label: 'Our Process' },
            { href: '/services', label: 'Services' },
        ],
        projectLinks: [
            { href: '/projects', label: 'All Projects' },
            { href: '/projects?tab=website', label: 'Websites' },
            { href: '/projects?tab=automation', label: 'AI Automation' },
            { href: '/projects?tab=data-analysis', label: 'Data Analysis' },
        ],
        contactLinks: [
            { href: '/contact', label: 'Contact Us' },
            { href: 'tel:+919156903129', label: '+91 91569 03129' },
            { href: 'mailto:aksaiautomation@gmail.com', label: 'aksaiautomation@gmail.com' },
        ],
    },
};
