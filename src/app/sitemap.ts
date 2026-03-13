import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/site';
import { SERVICES } from '@/data/services';
import { PORTFOLIO_PROJECTS } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_CONFIG.url;

    // Base static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }
    ];

    // Dynamic Service routes
    const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
        url: `${baseUrl}/services/${service.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Dynamic Project routes (if you have individual project pages, otherwise remove this section)
    const projectRoutes: MetadataRoute.Sitemap = PORTFOLIO_PROJECTS.map((project) => ({
        url: `${baseUrl}/projects#${project.id}`, // or /projects/[id] if you have dynamic pages
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    return [...routes, ...serviceRoutes, ...projectRoutes];
}
