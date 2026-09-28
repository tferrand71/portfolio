// =====================================================================
//  IdeaStorm — table des améliorations
//
//  Tout le contenu du jeu est décrit ici, et nulle part ailleurs. Le store
//  (store/useStore.js) ne contient plus une méthode d'achat par palier : il
//  lit cette table. C'est ce qui empêche le bug historique où la boutique
//  appelait `buyAuto1e120` — une action qui n'existait pas dans le store.
//
//  Les `id` sont les clés de sauvegarde historiques (`...Cost`). Elles ne
//  doivent pas changer : les parties déjà en base s'appuient dessus pour
//  retrouver le nombre d'exemplaires achetés (cf. migrateLegacySave).
// =====================================================================

/** Croissance du prix à chaque achat d'un même palier. */
export const COST_GROWTH = 1.5;

/** Points par clic d'un compte neuf, avant toute amélioration. */
export const BASE_PER_CLICK = 1;

/** Ascensions maximales, et score requis pour en déclencher une. */
export const REBIRTH_MAX = 6;
export const REBIRTH_REQUIREMENT = 1e36;

/**
 * Les deux scènes scénarisées du jeu.
 *
 * Les deux demandent d'être à la dernière ascension : rien ne se joue tant
 * qu'il reste un cycle à faire.
 *
 * L'écran de fin ouvre le dernier cycle, sur un score de 1e90 — le moment où
 * les paliers scellés viennent de se déverrouiller et où il reste pourtant
 * deux cents ordres de grandeur à gravir.
 *
 * L'easter egg le referme : boutique entièrement vidée, les deux Centillion
 * achetés. C'est la seule vraie ligne d'arrivée du jeu.
 */
export const ENDING_THRESHOLD = 1e90;
export const FINAL_UPGRADE_IDS = ["clickCentillionCost", "autoCentillionCost"];

/**
 * Seuil des paliers de fin de jeu.
 *
 * Tant qu'il reste une ascension à faire, tout ce qui coûte plus que le prix
 * d'une ascension est de l'argent jeté : le joueur va repartir de zéro et le
 * perdre. Ces paliers restent donc scellés jusqu'à la dernière ascension, où
 * ils deviennent la seule chose à faire. La boutique des six premiers cycles
 * s'arrête ainsi pile sur le montant qui permet d'ascensionner.
 */
export const ENDGAME_COST_FLOOR = REBIRTH_REQUIREMENT;

/**
 * Plafond du score. Un flottant IEEE 754 sature à ~1,797e308 : au-delà on
 * obtient Infinity, puis NaN dès la première soustraction, et la sauvegarde
 * part en vrille. On borne donc avant d'y arriver.
 */
export const SCORE_MAX = 1e308;

/**
 * Améliorations de clic. `bonus` est ajouté à la production de base, avant
 * application des multiplicateurs et du bonus d'ascension.
 *
 * Les listes sont triées par prix croissant : la version d'origine plaçait
 * godClickACost (1e12) après click100bCost (1e13), donc un palier moins cher
 * apparaissait après un plus cher.
 */
export const CLICK_UPGRADES = [
    { id: "clickUpgradeCost",             icon: "✨", label: "Poussière d'étoile",         baseCost: 50,    bonus: 1 },
    { id: "superClickCost",               icon: "☄️", label: "Météorite",     baseCost: 5e5,   bonus: 1e4 },
    { id: "megaClickCost",                icon: "🪨", label: "Astéroïde",       baseCost: 2.5e6, bonus: 1e5 },
    { id: "gigaClickCost",                icon: "🌑", label: "Comète",            baseCost: 1.5e7, bonus: 2e5 },
    { id: "click500kCost",                icon: "🌕", label: "Lune",   baseCost: 4e7,   bonus: 5e5 },
    { id: "click1mCost",                  icon: "🪐", label: "Planète",   baseCost: 1e8,   bonus: 1e6 },
    { id: "click10mCost",                 icon: "🌍", label: "Géante gazeuse",         baseCost: 1e9,   bonus: 1e7 },
    { id: "click100mCost",                icon: "⭐", label: "Naine blanche",        baseCost: 1e10,  bonus: 1e8 },
    { id: "click1bCost",                  icon: "☀️", label: "Étoile",        baseCost: 1e11,  bonus: 1e9 },
    { id: "click10bCost",                 icon: "🔆", label: "Supergéante",         baseCost: 1e12,  bonus: 1e10 },
    { id: "godClickACost",                icon: "💥", label: "Supernova",       baseCost: 1e12,  bonus: 1e12 },
    { id: "click100bCost",                icon: "🌟", label: "Pulsar",          baseCost: 1e13,  bonus: 1e11 },
    { id: "godClickAACost",               icon: "🕳️", label: "Trou noir",        baseCost: 1e15,  bonus: 1e15 },
    { id: "clickSextillionCost",          icon: "☁️", label: "Nébuleuse",       baseCost: 1e21,  bonus: 1e21 },
    { id: "clickNonillionCost",           icon: "🌠", label: "Amas d'étoiles",         baseCost: 1e27,  bonus: 1e27 },
    { id: "clickDuodecillionCost",        icon: "🌌", label: "Galaxie", baseCost: 1e36,  bonus: 1e36 },
    { id: "clickVigintillionCost",        icon: "🌌", label: "Amas de galaxies",      baseCost: 1e63,  bonus: 1e63 },
    { id: "clickTrigintillionCost",       icon: "🕸️", label: "Superamas",     baseCost: 1e93,  bonus: 1e93 },
    { id: "clickGoogolCost",              icon: "🧵", label: "Filament cosmique",            baseCost: 1e100, bonus: 1e100 },
    { id: "click1e120Cost",               icon: "🧲", label: "Grand Attracteur",         baseCost: 1e120, bonus: 1e120 },
    { id: "clickQuinquagintillionCost",   icon: "⬛", label: "Vide cosmique", baseCost: 1e153, bonus: 1e153 },
    { id: "click1e180Cost",               icon: "🔭", label: "Univers observable",       baseCost: 1e180, bonus: 1e180 },
    { id: "click1e240Cost",               icon: "♾️", label: "Multivers",          baseCost: 1e240, bonus: 1e240 },
    { id: "clickNonagintillionCost",      icon: "🫧", label: "Inflation éternelle",    baseCost: 1e273, bonus: 1e273 },
    { id: "click1e300Cost",               icon: "🌅", label: "Mort thermique",       baseCost: 1e300, bonus: 1e300 },
    { id: "clickCentillionCost",          icon: "⚫", label: "Singularité finale",        baseCost: 1e303, bonus: 1e303, legendary: true },
];

/**
 * Améliorations automatiques. Contrairement à la version d'origine, le bonus
 * n'est plus figé au moment de l'achat : il est recalculé à partir du nombre
 * d'exemplaires possédés. Une revente redonne donc exactement l'état d'avant.
 */
export const AUTO_UPGRADES = [
    { id: "autoUpgradeCost",       icon: "🔭", label: "Lunette astronomique",   baseCost: 100,   bonus: 2 },
    { id: "auto500kCost",          icon: "📡", label: "Radiotélescope",         baseCost: 4e7,   bonus: 5e5 },
    { id: "auto1mCost",            icon: "🛰️", label: "Satellite",        baseCost: 1e8,   bonus: 1e6 },
    { id: "auto10mCost",           icon: "🚀", label: "Sonde interstellaire",       baseCost: 1e9,   bonus: 1e7 },
    { id: "auto100mCost",          icon: "🛸", label: "Station orbitale",          baseCost: 1e10,  bonus: 1e8 },
    { id: "auto1bCost",            icon: "🌕", label: "Base lunaire",        baseCost: 1e11,  bonus: 1e9 },
    { id: "godAutoACost",          icon: "⚡", label: "Collecteur solaire",   baseCost: 1e12,  bonus: 1e12 },
    { id: "auto10bCost",           icon: "🏗️", label: "Ascenseur spatial",   baseCost: 1e12,  bonus: 1e10 },
    { id: "auto100bCost",          icon: "🪐", label: "Terraformation",       baseCost: 1e13,  bonus: 1e11 },
    { id: "godAutoAACost",         icon: "🌐", label: "Anneau de Niven", baseCost: 1e15, bonus: 1e15 },
    { id: "autoSextillionCost",    icon: "☀️", label: "Sphère de Dyson",  baseCost: 1e21,  bonus: 1e21 },
    { id: "autoNonillionCost",     icon: "🧠", label: "Cerveau Matriochka",        baseCost: 1e27,  bonus: 1e27 },
    { id: "autoDuodecillionCost",  icon: "🏭", label: "Forge stellaire",     baseCost: 1e36,  bonus: 1e36 },
    { id: "autoGoogolCost",        icon: "🌞", label: "Essaim de Dyson", baseCost: 1e100, bonus: 1e100 },
    { id: "auto1e120Cost",         icon: "🌀", label: "Moteur à courbure",      baseCost: 1e120, bonus: 1e120 },
    { id: "auto1e180Cost",         icon: "🕳️", label: "Trou de ver", baseCost: 1e180, bonus: 1e180 },
    { id: "auto1e240Cost",         icon: "🏗️", label: "Forge de galaxies",   baseCost: 1e240, bonus: 1e240 },
    { id: "auto1e300Cost",         icon: "🌌", label: "Moteur d'univers", baseCost: 1e300, bonus: 1e300 },
    { id: "autoCentillionCost",    icon: "⚫", label: "Le Grand Tout",   baseCost: 1e303, bonus: 1e303, legendary: true },
];

/**
 * Multiplicateurs. Ils s'appliquent à la somme des bonus, pas au score :
 * l'ordre d'achat n'a donc aucune importance, et une revente reste exacte.
 */
export const MULTIPLIERS = [
    { id: "multX2Cost",         icon: "🌙", label: "Assistance gravitationnelle",     target: "click", factor: 2, baseCost: 1e8,   growth: 3, unlockAt: 1e6 },
    { id: "ultimateClickCost",  icon: "☄️", label: "Manœuvre d'Oberth",     target: "click", factor: 3, baseCost: 2.5e6, growth: 4, unlockAt: 1e7 },
    { id: "autoMultX2Cost",     icon: "🛰️", label: "Réseau relais",     target: "auto",  factor: 2, baseCost: 1e8,   growth: 3, unlockAt: 1e6 },
];

/**
 * Compagnons : achat unique, production automatique. Le média associé
 * s'affiche en surimpression (components/MediaOverlay.jsx).
 */
export const COMPANIONS = [
    { id: "catUpgradeCost",  flag: "catBought",    icon: "🤪", label: "Félicette", baseCost: 250,   bonus: 5,     media: { type: "image", src: "/ideastorm-media/chat-debile.webp" } },
    { id: "cat2UpgradeCost", flag: "cat2Bought",   icon: "🥷", label: "Chat de Schrödinger",  baseCost: 2500,  bonus: 60,    media: { type: "video", src: "/ideastorm-media/mimir.mp4" } },
    { id: "volcanCost",      flag: "volcanBought", icon: "🔫", label: "Artilleur orbital",  baseCost: 25000, bonus: 700,   media: { type: "video", src: "/ideastorm-media/pistolet.mp4" } },
    { id: "cat3UpgradeCost", flag: "cat3Bought",   icon: "👑", label: "Empereur de la Voie lactée",    baseCost: 2e5,   bonus: 6000,  media: { type: "video", src: "/ideastorm-media/seducteur.mp4" } },
    { id: "gooseCost",       flag: "gooseBought",  icon: "🪿", label: "Oie de Kessler",  baseCost: 1e6,   bonus: 35000, media: { type: "video", src: "/ideastorm-media/goose.mp4" } },
];

/** Index id → définition, tous types confondus. */
export const UPGRADE_BY_ID = Object.fromEntries(
    [...CLICK_UPGRADES, ...AUTO_UPGRADES, ...MULTIPLIERS, ...COMPANIONS].map((u) => [u.id, u])
);

/** Tous les identifiants persistés, dans l'ordre d'affichage. */
export const ALL_UPGRADE_IDS = Object.keys(UPGRADE_BY_ID);
