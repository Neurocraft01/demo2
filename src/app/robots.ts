import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/thank-you'], // Disallow private routes
        },
        sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    };
}
