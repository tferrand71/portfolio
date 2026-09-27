// Modèle de départ d'un nouveau CV.
//
// Le projet d'origine pré-remplissait ce fichier avec les coordonnées réelles
// de Tobias (email, téléphone, adresse) : chaque visiteur de la démo les
// recevait. Le modèle est désormais vierge — un CV appartient à son auteur.
export const EMPTY_CV_DATA = {
    personal: {
        photo: null,
        fullName: '',
        title: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
        website: '',
        linkedin: '',
        github: ''
    },
    theme: { color: '#2563eb', sidebar: '#1e293b', background: '#ffffff' },
    skills: [],
    certifications: [],
    languages: [],
    experiences: [],
    projects: [],
    education: [],
    interests: []
};

/** Garantit qu'un document venant du serveur a toujours la structure complète. */
export function withDefaults(data) {
    const safe = data && typeof data === 'object' ? data : {};
    return {
        ...EMPTY_CV_DATA,
        ...safe,
        personal: { ...EMPTY_CV_DATA.personal, ...(safe.personal ?? {}) },
        theme: { ...EMPTY_CV_DATA.theme, ...(safe.theme ?? {}) }
    };
}
