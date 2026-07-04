"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaGamepad } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;
const DINO_WIDTH = 44;
const DINO_HEIGHT = 47;
const DINO_DUCK_HEIGHT = 30;
const GROUND_Y = GAME_HEIGHT - 20;

export default function NotFound() {
    const [isGaming, setIsGaming] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    
    // Rendu pour l'animation
    const [, setTick] = useState(0);
    
    // Refs pour la physique (évite les lags de re-render React)
    const dinoRef = useRef({ y: GROUND_Y - DINO_HEIGHT, vy: 0, isDucking: false });
    const obstaclesRef = useRef<{x: number, w: number, h: number, passed: boolean, type: number}[]>([]);
    const particlesRef = useRef<{x: number, y: number, speed: number, size: number}[]>([]);
    
    const frameRef = useRef<number>(0);
    const gameSpeed = useRef(6);
    const scoreRef = useRef(0);
    const walkState = useRef(false);

    // Initialiser les particules du décor (étoiles/poussière)
    useEffect(() => {
        const initialParticles = [];
        for (let i = 0; i < 30; i++) {
            initialParticles.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * (GAME_HEIGHT - 30),
                speed: Math.random() * 0.5 + 0.1,
                size: Math.random() * 2 + 1
            });
        }
        particlesRef.current = initialParticles;
        
        // Charger le high score
        const saved = localStorage.getItem("dinoHighScore");
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const resetGame = () => {
        dinoRef.current = { y: GROUND_Y - DINO_HEIGHT, vy: 0, isDucking: false };
        obstaclesRef.current = [];
        gameSpeed.current = 6;
        scoreRef.current = 0;
        setScore(0);
        setGameOver(false);
    };

    useEffect(() => {
        if (!isGaming || gameOver) return;

        let lastTime = performance.now();
        let walkTimer = 0;

        const update = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            // --- PHYSIQUE DU DINO ---
            const dino = dinoRef.current;
            const currentHeight = dino.isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT;
            const currentGroundY = GROUND_Y - currentHeight;

            dino.vy += 0.8; // Gravité plus forte pour un saut plus sec
            
            // Si on se baisse en l'air, on tombe plus vite
            if (dino.isDucking && dino.y < currentGroundY) {
                dino.vy += 1.5; 
            }
            
            dino.y += dino.vy;

            // Collision avec le sol
            if (dino.y >= currentGroundY) {
                dino.y = currentGroundY;
                dino.vy = 0;
            }

            // --- ANIMATION DE MARCHE ---
            if (dino.y >= currentGroundY) {
                walkTimer += deltaTime;
                if (walkTimer > 100) { // Alterner les jambes toutes les 100ms
                    walkState.current = !walkState.current;
                    walkTimer = 0;
                }
            } else {
                walkState.current = false; // Figer les jambes en l'air
            }

            // --- DÉCOR (PARALLAX) ---
            particlesRef.current.forEach(p => {
                p.x -= gameSpeed.current * p.speed;
                if (p.x < 0) {
                    p.x = GAME_WIDTH;
                    p.y = Math.random() * (GAME_HEIGHT - 30);
                }
            });

            // --- OBSTACLES ---
            obstaclesRef.current.forEach(obs => {
                obs.x -= gameSpeed.current;
            });

            // Supprimer les obstacles hors écran
            if (obstaclesRef.current.length > 0 && obstaclesRef.current[0].x < -60) {
                obstaclesRef.current.shift();
            }

            // Faire apparaître de nouveaux obstacles
            const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1];
            const minGap = 300 + (gameSpeed.current * 15);
            
            if (!lastObs || (GAME_WIDTH - lastObs.x > minGap)) {
                if (Math.random() < 0.04) { 
                    const isFlying = Math.random() < 0.2 && scoreRef.current > 300; // Les ptérodactyles apparaissent plus tard
                    
                    if (isFlying) {
                        // Oiseau / Ptérodactyle (Rouge)
                        const flyHeights = [GROUND_Y - 40, GROUND_Y - 70, GROUND_Y - 100];
                        const y = flyHeights[Math.floor(Math.random() * flyHeights.length)];
                        obstaclesRef.current.push({ x: GAME_WIDTH, w: 40, h: 30, passed: false, type: 2 });
                        // Hack: on utilise 'h' pour stocker la coordonnée Y pour les objets volants
                        obstaclesRef.current[obstaclesRef.current.length - 1].h = y;
                    } else {
                        // Cactus (Rouge)
                        const heights = [40, 55, 70];
                        const h = heights[Math.floor(Math.random() * heights.length)];
                        const w = h > 50 ? 30 : 20; // Les grands cactus sont plus larges
                        obstaclesRef.current.push({ x: GAME_WIDTH, w: w, h: h, passed: false, type: 1 });
                    }
                }
            }

            // --- COLLISIONS ---
            let hit = false;
            // Hitbox réduite pour être moins frustrant
            const hitboxPadding = 5; 
            const dinoLeft = 50 + hitboxPadding;
            const dinoRight = 50 + DINO_WIDTH - hitboxPadding;
            const dinoTop = dino.y + hitboxPadding;
            const dinoBottom = dino.y + currentHeight - hitboxPadding;

            obstaclesRef.current.forEach(obs => {
                let obsLeft, obsRight, obsTop, obsBottom;

                if (obs.type === 1) { // Cactus
                    obsLeft = obs.x + hitboxPadding;
                    obsRight = obs.x + obs.w - hitboxPadding;
                    obsTop = GROUND_Y - obs.h + hitboxPadding;
                    obsBottom = GROUND_Y;
                } else { // Volant
                    obsLeft = obs.x + hitboxPadding;
                    obsRight = obs.x + obs.w - hitboxPadding;
                    obsTop = obs.h + hitboxPadding;
                    obsBottom = obs.h + 30 - hitboxPadding;
                }

                if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom) {
                    hit = true;
                }

                if (!obs.passed && obs.x + obs.w < dinoLeft) {
                    obs.passed = true;
                    scoreRef.current += 10;
                    gameSpeed.current += 0.05; // Augmente la difficulté
                }
            });

            if (hit) {
                setGameOver(true);
                const finalScore = Math.floor(scoreRef.current);
                setScore(finalScore);
                
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    localStorage.setItem("dinoHighScore", finalScore.toString());
                }
                return; 
            }

            scoreRef.current += 0.1;
            setScore(Math.floor(scoreRef.current));
            
            setTick(t => t + 1);
            frameRef.current = requestAnimationFrame(update);
        };

        frameRef.current = requestAnimationFrame(update);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                const currentGroundY = GROUND_Y - (dinoRef.current.isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT);
                if (dinoRef.current.y >= currentGroundY - 1) { 
                    dinoRef.current.vy = -14; 
                }
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                dinoRef.current.isDucking = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowDown') {
                dinoRef.current.isDucking = false;
            }
        };

        const handleTouchStart = () => {
            const currentGroundY = GROUND_Y - (dinoRef.current.isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT);
            if (dinoRef.current.y >= currentGroundY - 1) { 
                dinoRef.current.vy = -14;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('touchstart', handleTouchStart);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('touchstart', handleTouchStart);
        };
    }, [isGaming, gameOver, highScore]);

    // --- COMPOSANTS VISUELS (PIXEL ART CSS) ---
    const renderDino = () => {
        const isJumping = dinoRef.current.y < GROUND_Y - DINO_HEIGHT - 5;
        const isDucking = dinoRef.current.isDucking;
        
        if (isDucking) {
            return (
                <div className="relative w-full h-full bg-[var(--color-gold)] rounded-sm shadow-[0_0_15px_var(--color-gold)]">
                    {/* Oeil */}
                    <div className="absolute top-2 right-4 w-2 h-2 bg-black rounded-full" />
                    {/* Tête aplatie */}
                    <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-[var(--color-gold)] rounded-tr-md" />
                </div>
            );
        }

        return (
            <div className="relative w-full h-full">
                {/* Tête */}
                <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-[var(--color-gold)] rounded-tr-md shadow-[0_0_15px_var(--color-gold)]">
                    {/* Oeil */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
                    {/* Museau */}
                    <div className="absolute top-5 right-0 w-[80%] h-[20%] bg-black opacity-20" />
                </div>
                {/* Corps */}
                <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-[var(--color-gold)] shadow-[0_0_15px_var(--color-gold)]" />
                {/* Queue */}
                <div className="absolute top-[40%] left-0 w-[20%] h-[20%] bg-[var(--color-gold)]" />
                {/* Petit bras */}
                <div className="absolute top-[45%] right-[10%] w-[15%] h-[10%] bg-[var(--color-gold)]" />
                
                {/* Jambes (Animées) */}
                <div className={`absolute bottom-0 left-[25%] w-[15%] h-[20%] bg-[var(--color-gold)] ${isJumping ? '' : (walkState.current ? 'hidden' : '')}`} />
                <div className={`absolute bottom-0 left-[50%] w-[15%] h-[20%] bg-[var(--color-gold)] ${isJumping ? 'bottom-[5px]' : (!walkState.current ? 'hidden' : '')}`} />
            </div>
        );
    };

    const renderCactus = (obs: any) => (
        <div className="relative w-full h-full">
            {/* Tronc central */}
            <div className="absolute bottom-0 left-[35%] w-[30%] h-full bg-[var(--color-red)] rounded-t-sm shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
            {/* Branche Gauche */}
            <div className="absolute top-[30%] left-0 w-[35%] h-[20%] bg-[var(--color-red)] rounded-l-sm" />
            <div className="absolute top-[10%] left-0 w-[15%] h-[40%] bg-[var(--color-red)] rounded-t-sm" />
            {/* Branche Droite */}
            {obs.w > 20 && (
                <>
                    <div className="absolute top-[50%] right-0 w-[35%] h-[20%] bg-[var(--color-red)] rounded-r-sm" />
                    <div className="absolute top-[20%] right-0 w-[15%] h-[50%] bg-[var(--color-red)] rounded-t-sm" />
                </>
            )}
        </div>
    );
    
    const renderBird = () => (
        <div className="relative w-full h-full animate-pulse">
            {/* Aile haut/bas selon walkState pour faire battre les ailes */}
            <div className={`absolute left-[30%] w-[40%] h-[30%] bg-[var(--color-red)] shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all ${walkState.current ? 'top-0' : 'top-[70%]'}`} />
            {/* Corps */}
            <div className="absolute top-[40%] left-0 w-[100%] h-[30%] bg-[var(--color-red)] rounded-full" />
            <div className="absolute top-[45%] right-2 w-2 h-2 bg-black rounded-full z-10" />
        </div>
    );

    return (
        <main className="min-h-screen flex flex-col bg-rich-black text-white relative overflow-hidden">
            <Navbar />
            
            <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] bg-[var(--color-mauve)]/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="flex-grow flex items-center justify-center px-4 relative z-10 pt-32 pb-20">
                <div className="max-w-4xl w-full text-center">
                    <AnimatePresence mode="wait">
                        {!isGaming ? (
                            <motion.div
                                key="404-text"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 
                                    className="text-[100px] md:text-[160px] font-serif font-bold text-[var(--color-gold)] mb-2 tracking-tighter leading-none"
                                    style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
                                >
                                    404
                                </h1>
                                
                                <h2 className="text-2xl md:text-4xl font-serif text-[var(--color-text-main)] mb-8 font-bold">
                                    Page introuvable
                                </h2>

                                <p className="text-[var(--color-text-muted)] text-sm md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
                                    Il semblerait que vous vous soyez perdu dans le code. Mais puisque vous êtes là, battez le record !
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link 
                                        href="/" 
                                        className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--color-glass-border)] text-[var(--color-text-main)] font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[var(--color-glass)] hover:scale-105 transition-all duration-300"
                                    >
                                        <FaHome className="text-xl" />
                                        Accueil
                                    </Link>
                                    
                                    <button 
                                        onClick={() => { setIsGaming(true); resetGame(); }}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-gold)] text-black font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_var(--color-gold)]"
                                    >
                                        <FaGamepad className="text-xl" />
                                        Lancer le Jeu
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dino-game-advanced"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center bg-[var(--color-glass)] backdrop-blur-xl p-4 md:p-8 rounded-3xl border border-[var(--color-glass-border)] mx-auto w-full shadow-2xl"
                            >
                                <div className="flex justify-between w-full max-w-[800px] mb-6 items-center px-4">
                                    <div className="flex flex-col items-start">
                                        <h3 className="text-xl md:text-3xl font-bold font-serif text-[var(--color-gold)] tracking-widest">
                                            {score.toString().padStart(5, '0')}
                                        </h3>
                                        {highScore > 0 && (
                                            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
                                                HI: {highScore.toString().padStart(5, '0')}
                                            </p>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setIsGaming(false)}
                                        className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full"
                                    >
                                        Quitter
                                    </button>
                                </div>

                                {/* FENÊTRE DU JEU */}
                                <div 
                                    className={`bg-[#07050A] border border-[var(--color-glass-border)] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] w-full max-w-[800px] rounded-xl transition-transform duration-75 ${gameOver ? 'scale-[0.98]' : ''}`}
                                    style={{ height: `${GAME_HEIGHT}px` }}
                                >
                                    {/* Particules (Étoiles/Poussière) */}
                                    {particlesRef.current.map((p, i) => (
                                        <div 
                                            key={`p-${i}`}
                                            className="absolute bg-white/30 rounded-full"
                                            style={{
                                                left: `${p.x}px`,
                                                top: `${p.y}px`,
                                                width: `${p.size}px`,
                                                height: `${p.size}px`
                                            }}
                                        />
                                    ))}

                                    {/* Ligne de sol texturée */}
                                    <div className="absolute bottom-5 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-30" />
                                    
                                    {/* Dino Player */}
                                    <div 
                                        className="absolute"
                                        style={{ 
                                            width: `${DINO_WIDTH}px`, 
                                            height: `${dinoRef.current.isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT}px`, 
                                            left: '50px', 
                                            top: `${dinoRef.current.y}px`,
                                        }} 
                                    >
                                        {renderDino()}
                                    </div>
                                    
                                    {/* Obstacles */}
                                    {obstaclesRef.current.map((obs, index) => (
                                        <div 
                                            key={index}
                                            className="absolute"
                                            style={{ 
                                                width: `${obs.w}px`, 
                                                height: `${obs.h}px`, 
                                                left: `${obs.x}px`, 
                                                top: obs.type === 2 ? `${obs.h}px` : undefined, // Si oiseau, h est la position Y
                                                bottom: obs.type === 1 ? '20px' : undefined // Si cactus, fixé au sol
                                            }} 
                                        >
                                            {obs.type === 1 ? renderCactus(obs) : renderBird()}
                                        </div>
                                    ))}

                                    {/* OVERLAY GAME OVER */}
                                    <AnimatePresence>
                                        {gameOver && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                                            >
                                                <p className="text-[var(--color-red)] font-bold text-3xl md:text-5xl mb-6 uppercase tracking-widest font-serif drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                                                    Game Over
                                                </p>
                                                <button 
                                                    onClick={resetGame}
                                                    className="px-8 py-4 bg-[var(--color-gold)] text-black font-bold uppercase tracking-widest rounded-full text-sm hover:bg-white hover:scale-110 transition-all shadow-[0_0_30px_-5px_var(--color-gold)]"
                                                >
                                                    Réessayer
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <div className="mt-6 flex flex-col items-center gap-2">
                                    <p className="text-xs md:text-sm uppercase tracking-widest text-[var(--color-text-main)] font-bold">
                                        Contrôles
                                    </p>
                                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-text-muted)] opacity-70 flex gap-4">
                                        <span>[ ESPACE / ↑ ] : Sauter</span>
                                        <span>[ ↓ ] : S'accroupir</span>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </main>
    );
}
