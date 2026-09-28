import React, { useMemo } from "react";
import Image from "next/image";

import { COMPANIONS } from "../data/upgrades.js";
import useStore from "../store/useStore.js";

/** Un emplacement d'écran par compagnon, pour qu'ils ne se recouvrent pas. */
const SLOTS = {
    catUpgradeCost: "is-media--bl",
    cat2UpgradeCost: "is-media--br",
    volcanCost: "is-media--ml",
    cat3UpgradeCost: "is-media--tl",
    gooseCost: "is-media--tr",
};

/** Affiche les compagnons achetés, en décoration : jamais cliquables. */
export default function MediaOverlay() {
    // `owned` ne change qu'à l'achat : la liste dérivée reste stable entre
    // deux tics de score, contrairement à un sélecteur qui filtrerait.
    const owned = useStore((s) => s.owned);
    const companions = useMemo(() => COMPANIONS.filter((c) => owned[c.id]), [owned]);

    if (companions.length === 0) return null;

    return (
        <div className="is-media-layer" aria-hidden="true">
            {companions.map((c) =>
                c.media.type === "video" ? (
                    <video
                        key={c.id}
                        className={`is-media ${SLOTS[c.id] ?? "is-media--br"}`}
                        src={c.media.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <Image
                        key={c.id}
                        className={`is-media ${SLOTS[c.id] ?? "is-media--bl"}`}
                        src={c.media.src}
                        alt=""
                        width={140}
                        height={140}
                        unoptimized
                    />
                )
            )}
        </div>
    );
}
