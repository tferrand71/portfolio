import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    distDir: 'out', // Assure-toi que c'est bien 'out'
    // CETTE LIGNE EST LA SOLUTION :
    assetPrefix: './',
    // Note : Sur certains serveurs, on peut aussi essayer de tricher avec :
    // Mais la méthode la plus sûre est de s'assurer que le serveur autorise les underscores.
};

export default nextConfig;