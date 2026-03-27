import { MetadataRoute } from 'next';

// Indispensable pour l'export statique sur Next.js 16
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/images/',
        },
        sitemap: 'https://tobias-ferrand.ovh/sitemap.xml',
    };
}