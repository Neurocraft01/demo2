// ─── Services Page Content (CMS) ───
// Edit this file to update all content on the Services page

export const SERVICES_HERO = {
    badge: 'Our Services',
    title: 'Transform Your Business with',
    titleAccent: 'AI-Powered Solutions',
    description: 'From intelligent web development to advanced automation — we deliver cutting-edge digital solutions that revolutionise your operations and accelerate growth.',
};

export const SERVICES = [
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

export const PACKAGES = [
    { title: 'Starter', desc: 'Perfect for small businesses', recommended: false, features: ['Static Website (Up to 5 pages)', 'Responsive Design', '6 Months Support', 'Hosting Setup', 'Contact Form'] },
    { title: 'Professional', desc: 'Complete solution for growing teams', recommended: true, features: ['Frontend + Booking System', 'Free Domain & Hosting', 'Database Integration', 'User Authentication', '12 Months Support'] },
    { title: 'Enterprise', desc: 'Advanced features for established brands', recommended: false, features: ['AI Agent Integration', 'AI Chatbot', 'Advanced SEO', 'Performance Analytics', 'Priority Support'] },
    { title: 'AI Automation', desc: 'Workflow automation & intelligent agents', recommended: false, features: ['Custom AI Agents', 'Workflow Automation', 'API Integrations', 'Process Optimisation', 'Comprehensive Support'] },
];

export const WHY_US = [
    { icon: '🧠', title: 'AI-Powered', desc: 'Leverage the latest AI to automate processes and build smarter user experiences.' },
    { icon: '💻', title: 'Modern Stack', desc: 'Next.js, React, Python, Node.js — we always use the right tool for the job.' },
    { icon: '🛟', title: '24/7 Support', desc: 'Dedicated support to keep your solutions running smoothly at all times.' },
    { icon: '📈', title: 'Scalable', desc: 'Future-proof solutions that grow with your business requirements.' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Streamlined process ensures quick turnarounds without compromising quality.' },
    { icon: '💰', title: 'Cost-Effective', desc: 'High-quality results at competitive pricing — maximising your ROI.' },
];

export const SERVICES_FAQS = [
    { q: 'How long does a typical project take?', a: 'A simple website takes 1–2 weeks. Complex AI automation projects take 4–8 weeks. We provide a detailed timeline during consultation.' },
    { q: 'What is your pricing model?', a: 'We offer fixed pricing for well-defined projects and hourly for ongoing work. Contact us for a free custom quote.' },
    { q: 'Do you offer post-launch support?', a: "Yes — all packages include 6–12 months of maintenance. We're also available for urgent issues 24/7." },
    { q: 'Can you work with international clients?', a: 'Absolutely. We work with clients worldwide using Slack, Zoom, and GitHub for seamless collaboration across time zones.' },
];
