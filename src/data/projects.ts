// ─── Projects Page Content (CMS) ───
// Edit this file to update all projects displayed on the portfolio page

export const ALL_PROJECTS = [
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

export const PROJECT_TABS = [
    { id: 'all', label: 'All' },
    { id: 'landing', label: 'Landing Pages' },
    { id: 'website', label: 'Websites' },
    { id: 'data-analysis', label: 'Data Analysis' },
    { id: 'visualization', label: 'Visualisation' },
    { id: 'chatbot', label: 'AI Chatbots' },
    { id: 'automation', label: 'Automation' },
    { id: 'portfolio', label: 'Portfolios' },
];

export const PROJECT_CATEGORY_COLORS: Record<string, string> = {
    landing: '#6366f1', website: '#8b5cf6', 'data-analysis': '#0ea5e9',
    visualization: '#10b981', chatbot: '#f59e0b', automation: '#ef4444', portfolio: '#ec4899',
};

export const PROJECT_STATS = [
    { value: '50+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '3+', label: 'Years of Experience' },
    { value: '24/7', label: 'Support Available' },
];
