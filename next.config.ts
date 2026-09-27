import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Les sous-projets sont désormais des routes Next à part entière
    // (/ideastorm et /cv-creator) : plus aucune rewrite vers du HTML statique.
};

export default nextConfig;