import { MetadataRoute } from 'next';
import { projects } from '../data/projects';

// Indispensable pour l'export statique sur Next.js 16
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tobias-ferrand.ovh';

    const routes = ['', '/projets', '/veille', '/cours'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projets/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...projectRoutes];
}