import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicePageClient from './ServicePageClient';

// ─── DATA ────────────────────────────────────────────────────────────────────
export const SERVICE_DATA: Record<string, {
    title: string;
    tagline: string;
    heroKeyword: string;
    seoTitle: string;
    seoDesc: string;
    icon: string;
    bgWord: string;
    color: string;
    intro: string;
    whatWeBuild: { icon: string; title: string; desc: string }[];
    techStack: string[];
    process: { step: string; title: string; desc: string }[];
    results: { value: string; label: string }[];
    faqs: { q: string; a: string }[];
}> = {
    'web-development': {
        title: 'Web Development',
        tagline: 'Fast. Beautiful. Built to Convert.',
        heroKeyword: 'Web Development',
        seoTitle: 'Web Development Company Pune | AKS Automations',
        seoDesc: 'Leading web development agency in Pune and Pimpri Chinchwad. We build blazing-fast, SEO-optimised, beautiful websites and web applications using Next.js & React.',
        icon: '🌐',
        bgWord: 'WEB',
        color: '#384BFF',
        intro: 'We build high-performance websites and web apps for businesses across Pune, Pimpri Chinchwad, and globally. From simple landing pages to complex platforms — every pixel is crafted for conversion, speed, and SEO.',
        whatWeBuild: [
            { icon: '🏠', title: 'Landing Pages', desc: 'High-converting pages built for campaigns, product launches, and lead generation with A/B testing ready architecture.' },
            { icon: '🛒', title: 'E-Commerce Stores', desc: 'Full-featured online stores with inventory management, payments, and order tracking.' },
            { icon: '🏢', title: 'Corporate Websites', desc: 'Professional multi-page websites that establish authority and drive enquiries.' },
            { icon: '⚡', title: 'Web Applications', desc: 'Complex, data-driven apps with user authentication, dashboards, and real-time features.' },
            { icon: '📱', title: 'Progressive Web Apps', desc: 'App-like experiences in the browser with offline support and push notifications.' },
            { icon: '🎨', title: 'Design Systems', desc: 'Scalable, consistent component libraries that accelerate future development.' },
        ],
        techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Vercel', 'Figma', 'Stripe', 'Sanity CMS'],
        process: [
            { step: '01', title: 'Discovery & Scoping', desc: 'We dive deep into your goals, audience, and competition. Deliverable: requirements doc + sitemap.' },
            { step: '02', title: 'Design & Prototype', desc: 'Figma wireframes → high-fidelity designs. You approve every screen before we write a single line of code.' },
            { step: '03', title: 'Development', desc: 'Pixel-perfect build using modern frameworks. Clean, documented code with CI/CD pipelines.' },
            { step: '04', title: 'Testing & Launch', desc: 'Cross-device, cross-browser QA. SEO audit. Performance optimisation. Then we go live.' },
        ],
        results: [
            { value: '98+', label: 'Lighthouse Score' },
            { value: '1–3wk', label: 'Typical Delivery' },
            { value: '40%', label: 'Avg Conversion Lift' },
            { value: '50+', label: 'Sites Shipped' },
        ],
        faqs: [
            { q: 'How long does a website take to build?', a: 'A typical landing page takes 5–7 days. A full multi-page corporate site takes 2–3 weeks. E-commerce and web apps take 4–8 weeks depending on complexity.' },
            { q: 'Do you provide hosting?', a: 'Yes — we set up and manage hosting on Vercel, AWS, or any preferred provider as part of our packages.' },
            { q: 'Will my website rank on Google?', a: 'We build with SEO best practices from day one: semantic HTML, metadata, Core Web Vitals, and schema markup. We also offer an SEO add-on for ongoing optimisation.' },
            { q: 'Can you redesign an existing website?', a: 'Absolutely. We handle full redesigns and migrations, preserving your existing SEO ranking signals throughout.' },
        ],
    },
    'ai-chatbots': {
        title: 'AI Agents & Chatbots',
        tagline: 'Intelligent Automation That Never Sleeps.',
        heroKeyword: 'AI Chatbots',
        seoTitle: 'AI Chatbot Development Pune | AKS Automations',
        seoDesc: 'Custom AI chatbot and intelligent agent development in Pune. We build GPT-4, Claude, and Gemini powered chatbots for customer support, lead generation, and sales — deployed 24/7.',
        icon: '🤖',
        bgWord: 'AI',
        color: '#7B5AFF',
        intro: 'We build custom AI-powered chatbots and autonomous agents for businesses across Pune, Pimpri Chinchwad, and beyond. From customer support bots to complex multi-agent workflows — we deploy intelligence that works around the clock.',
        whatWeBuild: [
            { icon: '💬', title: 'Customer Support Bots', desc: 'Handle 80% of support queries automatically with context-aware AI — escalate to humans only when needed.' },
            { icon: '🎯', title: 'Lead Generation Agents', desc: 'Engage website visitors, qualify leads, and book discovery calls automatically — even at 3 AM.' },
            { icon: '🛒', title: 'E-Commerce Assistants', desc: 'Product recommendations, order tracking, returns — all handled by AI with a human touch.' },
            { icon: '📊', title: 'Internal Knowledge Bots', desc: 'Train AI on your company\'s documentation, SOPs, and data — instant answer engine for your team.' },
            { icon: '📞', title: 'Voice AI Agents', desc: 'Phone-based AI agents that handle inbound calls, take bookings, and collect information.' },
            { icon: '🔗', title: 'Multi-Agent Pipelines', desc: 'Orchestrated AI agents that research, write, review, and publish content — or any complex workflow.' },
        ],
        techStack: ['OpenAI GPT-4', 'Claude 3.5', 'Gemini 1.5', 'LangChain', 'Python', 'FastAPI', 'Pinecone', 'Supabase', 'Twilio', 'WhatsApp API'],
        process: [
            { step: '01', title: 'Use Case Mapping', desc: 'We map your customer journeys and identify where AI creates the most value.' },
            { step: '02', title: 'Data & Knowledge Setup', desc: 'We connect your knowledge base, product catalog, or CRM as the AI\'s source of truth.' },
            { step: '03', title: 'Bot Build & Training', desc: 'Build the agent, train on your data, configure guardrails and escalation paths.' },
            { step: '04', title: 'Deploy & Monitor', desc: 'Go live on your website, WhatsApp, or any channel. We monitor performance and improve continuously.' },
        ],
        results: [
            { value: '80%', label: 'Queries Resolved' },
            { value: '24/7', label: 'Always Online' },
            { value: '3×', label: 'Lead Conversion' },
            { value: '<2wk', label: 'Deployment Time' },
        ],
        faqs: [
            { q: 'Which AI models do you use?', a: 'We use OpenAI GPT-4, Anthropic Claude 3.5, and Google Gemini 1.5 — selecting the best model for your specific use case and budget.' },
            { q: 'Can the chatbot learn from our existing data?', a: 'Yes — we use RAG (Retrieval-Augmented Generation) to train bots on your PDFs, website content, SOPs, and databases.' },
            { q: 'Where can the bot be deployed?', a: 'Website widget, WhatsApp, Telegram, Slack, Discord, or any platform with an API. We handle the full integration.' },
            { q: 'Is our data secure?', a: 'We follow data minimisation principles, use encrypted connections, and can deploy on-premise or in your own cloud for maximum privacy.' },
        ],
    },
    'automation': {
        title: 'Automation Solutions',
        tagline: 'Eliminate Repetition. Amplify Output.',
        heroKeyword: 'Automation',
        seoTitle: 'Business Automation Agency Pune | AKS Automations',
        seoDesc: 'Business process automation and workflow solutions in Pune and Pimpri Chinchwad. We automate email, CRM, reporting, social media, and custom workflows using n8n, Zapier, and custom Python scripts.',
        icon: '⚙️',
        bgWord: 'AUTO',
        color: '#00C2A8',
        intro: 'We identify manual, repetitive tasks in your business and replace them with intelligent automated workflows. Our clients in Pune and Pimpri Chinchwad save an average of 20+ hours per week after working with us.',
        whatWeBuild: [
            { icon: '📧', title: 'Email & CRM Automation', desc: 'Welcome sequences, follow-ups, lead nurturing, and pipeline management — all on autopilot.' },
            { icon: '📊', title: 'Automated Reporting', desc: 'Pull data from any source, generate PDF/Excel reports, and deliver them to the right people on schedule.' },
            { icon: '📱', title: 'Social Media Automation', desc: 'Schedule, post, and cross-publish content across Instagram, LinkedIn, Twitter, and more.' },
            { icon: '🔗', title: 'App Integration Workflows', desc: 'Connect Shopify, HubSpot, Notion, Airtable, Google Sheets and 1000s of other apps seamlessly.' },
            { icon: '🤖', title: 'AI-Enhanced Automation', desc: 'Add AI decision-making to your workflows — classify, summarise, translate, and act on data automatically.' },
            { icon: '🏭', title: 'Custom Business Pipelines', desc: 'End-to-end automation of your unique business processes — from lead capture to invoice generation.' },
        ],
        techStack: ['n8n', 'Zapier', 'Make (Integromat)', 'Python', 'Node.js', 'Google Apps Script', 'REST APIs', 'Webhooks', 'Airtable', 'HubSpot'],
        process: [
            { step: '01', title: 'Process Audit', desc: 'We document your current workflows and identify the highest-ROI automation opportunities.' },
            { step: '02', title: 'Automation Design', desc: 'We map the automated flow, including edge cases, error handling, and human escalation points.' },
            { step: '03', title: 'Build & Test', desc: 'We build the workflow on your chosen platform and rigourously test every path.' },
            { step: '04', title: 'Handover & Monitor', desc: 'We train your team, document everything, and monitor the system for the first 30 days.' },
        ],
        results: [
            { value: '20h+', label: 'Saved Per Week' },
            { value: '95%', label: 'Error Reduction' },
            { value: '3×', label: 'Team Output' },
            { value: '1wk', label: 'Setup Time' },
        ],
        faqs: [
            { q: 'What tools do you use for automation?', a: 'We use n8n (self-hosted), Make (Integromat), Zapier, and custom Python scripts depending on complexity, budget, and data privacy needs.' },
            { q: 'Do we need technical knowledge to maintain the automations?', a: 'No — we build with maintainability in mind and deliver thorough documentation. We also offer ongoing maintenance packages.' },
            { q: 'Can you automate our existing tools (HubSpot, Shopify, etc.)?', a: 'Yes — we have deep experience integrating 100+ SaaS tools and can connect virtually any platform via API or webhook.' },
            { q: 'What if an automation fails?', a: 'We build error handling and alert systems into every workflow. If something breaks, you and we are notified instantly.' },
        ],
    },
    'data-analysis': {
        title: 'Data Analysis & Dashboards',
        tagline: 'Turn Raw Data into Business Decisions.',
        heroKeyword: 'Data Analysis',
        seoTitle: 'Data Analytics Company Pune | AKS Automations',
        seoDesc: 'Professional data analysis and business intelligence dashboards in Pune and Pimpri Chinchwad. We turn raw data into actionable insights using Python, Power BI, and custom interactive dashboards.',
        icon: '📊',
        bgWord: 'DATA',
        color: '#F59E0B',
        intro: 'We transform messy, scattered data into clear, actionable business intelligence. Our Pune-based data team builds custom dashboards, runs statistical analysis, and creates predictive models that help you make smarter decisions faster.',
        whatWeBuild: [
            { icon: '📈', title: 'Interactive Dashboards', desc: 'Real-time dashboards in Power BI, Tableau, or custom-built web apps — visualise your KPIs at a glance.' },
            { icon: '🔍', title: 'Exploratory Data Analysis', desc: 'Deep-dive statistical analysis to uncover trends, anomalies, and hidden patterns in your data.' },
            { icon: '🤖', title: 'Predictive Modelling', desc: 'Machine learning models that forecast sales, churn, demand, and other critical business metrics.' },
            { icon: '🧹', title: 'Data Cleaning & ETL', desc: 'We clean, transform, and structure messy datasets into reliable, analysis-ready formats.' },
            { icon: '📋', title: 'Automated Reports', desc: 'Scheduled PDF/Excel reports generated automatically and delivered to stakeholders on time.' },
            { icon: '🗄️', title: 'Data Warehouse Setup', desc: 'Design and implement scalable data infrastructure for growing businesses.' },
        ],
        techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Power BI', 'Tableau', 'SQL', 'PostgreSQL', 'BigQuery', 'Jupyter'],
        process: [
            { step: '01', title: 'Data Discovery', desc: 'We audit your existing data sources, quality, and gaps — then define the key questions to answer.' },
            { step: '02', title: 'Data Engineering', desc: 'Clean, structure, and pipeline your data into a reliable analysis-ready format.' },
            { step: '03', title: 'Analysis & Modelling', desc: 'Run statistical analysis, build ML models, and generate meaningful insights.' },
            { step: '04', title: 'Visualise & Deliver', desc: 'Present insights through clear dashboards and reports your team can understand and act on.' },
        ],
        results: [
            { value: '10×', label: 'Faster Decisions' },
            { value: '95%', label: 'Data Accuracy' },
            { value: '30%', label: 'Cost Visibility' },
            { value: '2wk', label: 'First Dashboard' },
        ],
        faqs: [
            { q: 'What data sources can you work with?', a: 'Any — Excel, CSV, databases (MySQL, PostgreSQL, MongoDB), APIs, Google Sheets, Salesforce, HubSpot, and more.' },
            { q: 'Do we need a large dataset?', a: 'Not necessarily. We can extract value from datasets as small as a few hundred rows, and we\'ll tell you honestly what\'s feasible.' },
            { q: 'What is the output — reports or dashboards?', a: 'Both — we deliver a mix of automated scheduled reports and live interactive dashboards depending on your needs.' },
            { q: 'Can you build predictive models for our business?', a: 'Yes — we use machine learning (scikit-learn, XGBoost, etc.) to build forecasting models for sales, inventory, churn, and more.' },
        ],
    },
    'backend-development': {
        title: 'Backend Development',
        tagline: 'Scalable Infrastructure. Zero Downtime.',
        heroKeyword: 'Backend Development',
        seoTitle: 'Backend Development Company Pune | AKS Automations',
        seoDesc: 'Expert backend and API development in Pune and Pimpri Chinchwad. We build scalable RESTful APIs, databases, and cloud infrastructure using Node.js, Python, and PostgreSQL.',
        icon: '🗄️',
        bgWord: 'API',
        color: '#10B981',
        intro: 'We engineer robust, scalable server-side systems that power your applications. From high-traffic REST APIs to complex database architectures — we build backend infrastructure that handles growth without breaking a sweat.',
        whatWeBuild: [
            { icon: '🔗', title: 'RESTful APIs', desc: 'Clean, documented, versioned APIs following OpenAPI standards — ready for web, mobile, and third-party integrations.' },
            { icon: '⚡', title: 'GraphQL APIs', desc: 'Flexible, efficient data fetching for complex frontends with nested data requirements.' },
            { icon: '🗄️', title: 'Database Design', desc: 'Optimised relational and NoSQL database schemas with indexing, migrations, and query optimisation.' },
            { icon: '☁️', title: 'Cloud Architecture', desc: 'AWS, Google Cloud, and Azure deployments with auto-scaling, load balancing, and 99.9% uptime.' },
            { icon: '🔐', title: 'Auth & Security', desc: 'JWT, OAuth 2.0, role-based access control, and security hardening for production systems.' },
            { icon: '🔁', title: 'Microservices', desc: 'Decompose monoliths into maintainable, independently deployable microservices.' },
        ],
        techStack: ['Node.js', 'Python', 'FastAPI', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Nginx'],
        process: [
            { step: '01', title: 'Architecture Design', desc: 'We design the system architecture, data models, and API contracts before writing code.' },
            { step: '02', title: 'Development', desc: 'Clean, tested, documented code following SOLID principles and your team\'s conventions.' },
            { step: '03', title: 'Testing & Security', desc: 'Unit tests, integration tests, load testing, and a security audit before production.' },
            { step: '04', title: 'Deploy & Scale', desc: 'CI/CD pipeline setup, monitoring dashboards, and on-call alerts for production incidents.' },
        ],
        results: [
            { value: '99.9%', label: 'Uptime' },
            { value: '<100ms', label: 'API Response' },
            { value: '10M+', label: 'Requests/Day' },
            { value: '100%', label: 'Test Coverage' },
        ],
        faqs: [
            { q: 'What backend technologies do you use?', a: 'We primarily use Node.js (Express/Fastify) and Python (FastAPI/Django) — we choose based on your use case and existing stack.' },
            { q: 'Can you migrate our existing backend?', a: 'Yes — we perform phased migrations with zero downtime strategies, ensuring continuity throughout the process.' },
            { q: 'Do you set up DevOps and CI/CD?', a: 'Yes — we provision infrastructure on AWS/GCP and set up automated deployment pipelines using GitHub Actions or GitLab CI.' },
            { q: 'How do you handle database scaling?', a: 'We implement read replicas, caching layers (Redis), connection pooling, and query optimisation to handle growth.' },
        ],
    },
    'seo-performance': {
        title: 'SEO & Performance',
        tagline: 'Rank Higher. Load Faster. Win More.',
        heroKeyword: 'SEO',
        seoTitle: 'SEO Agency Pune | Website Performance Optimisation | AKS Automations',
        seoDesc: 'Professional SEO and website performance optimisation agency in Pune and Pimpri Chinchwad. We improve Google rankings, Core Web Vitals, and page speed to drive organic traffic and conversions.',
        icon: '📈',
        bgWord: 'SEO',
        color: '#EF4444',
        intro: 'We help businesses in Pune, Pimpri Chinchwad, and across India dominate Google search results. Our technical SEO audits, content strategy, and performance engineering drive measurable organic growth that compounds over time.',
        whatWeBuild: [
            { icon: '🔍', title: 'Technical SEO Audit', desc: 'Comprehensive audit of crawlability, indexation, structured data, Core Web Vitals, and on-page signals.' },
            { icon: '📝', title: 'Content Strategy', desc: 'Keyword research, content calendar, and SEO-optimised content that ranks for high-intent queries.' },
            { icon: '⚡', title: 'Core Web Vitals Fix', desc: 'LCP, FID/INP, and CLS improvements — we make your site pass Google\'s performance thresholds.' },
            { icon: '🔗', title: 'Link Building', desc: 'White-hat backlink acquisition from relevant, high-authority domains in your industry.' },
            { icon: '📍', title: 'Local SEO', desc: 'Google Business Profile optimisation, local citation building, and map pack ranking for Pune/Pimpri Chinchwad.' },
            { icon: '📊', title: 'Analytics & Reporting', desc: 'GA4, Search Console, and custom dashboards — clear reporting on rankings, traffic, and ROI.' },
        ],
        techStack: ['Google Search Console', 'GA4', 'Ahrefs', 'Screaming Frog', 'PageSpeed Insights', 'Schema Markup', 'Next.js SSG/SSR', 'Cloudflare', 'GTmetrix', 'Lighthouse'],
        process: [
            { step: '01', title: 'Full Site Audit', desc: 'We audit your entire site — technical, on-page, and off-page — to produce a prioritised action plan.' },
            { step: '02', title: 'Quick Wins (Week 1–2)', desc: 'Fix critical technical issues, optimise meta tags, and implement schema markup for immediate gains.' },
            { step: '03', title: 'Content & Authority', desc: 'Publish optimised content and build authoritative backlinks over 60–90 days.' },
            { step: '04', title: 'Track & Iterate', desc: 'Monthly reporting. A/B test page elements. Double down on what works.' },
        ],
        results: [
            { value: '3×', label: 'Organic Traffic' },
            { value: 'Top 3', label: 'Local Rankings' },
            { value: '98+', label: 'PageSpeed Score' },
            { value: '90d', label: 'To See Results' },
        ],
        faqs: [
            { q: 'How long does SEO take to show results?', a: 'Technical fixes and Core Web Vitals improvements show results in 2–4 weeks. Organic ranking improvements typically take 60–120 days to compound.' },
            { q: 'Do you do local SEO for Pune/Pimpri Chinchwad?', a: 'Yes — local SEO is a speciality. We optimise for "near me" searches, Google Maps, and local business directories specific to Pune.' },
            { q: 'Will you write the SEO content, or do we?', a: 'We can do both — we offer fully-written SEO content as an add-on, or we can provide detailed content briefs for your team to write.' },
            { q: 'How do you measure SEO success?', a: 'Keyword rankings, organic traffic, click-through rate, and most importantly — qualified leads and conversions from organic search.' },
        ],
    },
};

// ─── METADATA ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const svc = SERVICE_DATA[slug];
    if (!svc) return { title: 'Service Not Found' };
    return {
        title: svc.seoTitle,
        description: svc.seoDesc,
        keywords: `${svc.heroKeyword} Pune, ${svc.heroKeyword} Pimpri Chinchwad, AKS Automations`,
    };
}

export function generateStaticParams() {
    return Object.keys(SERVICE_DATA).map((slug) => ({ slug }));
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function ServiceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const svc = SERVICE_DATA[slug];
    if (!svc) notFound();

    return (
        <>
            <Header />
            <ServicePageClient svc={svc} slug={slug} />
            <Footer />
        </>
    );
}
