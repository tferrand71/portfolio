import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Configuration optimisée pour Vercel (on retire l'export statique OVH)
    async rewrites() {
        return [
            {
                source: '/cv-creator',
                destination: '/cv-creator/index.html',
            },
            {
                source: '/cv-creator/',
                destination: '/cv-creator/index.html',
            },
            {
                source: '/ideastorm',
                destination: '/ideastorm/index.html',
            },
            {
                source: '/ideastorm/',
                destination: '/ideastorm/index.html',
            }
        ];
    }
};

export default nextConfig;