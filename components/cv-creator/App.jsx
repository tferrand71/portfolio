import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import Header from './components/Header';
import CVEditor from './components/CVEditor';
import CVPreview from './components/CVPreview';
import AuthScreen from './components/AuthScreen';
import { EMPTY_CV_DATA, withDefaults } from './defaultCv';
import { fetchDocument, saveDocument, signOut } from './api';

/**
 * Le CV n'est plus jamais conservé dans localStorage.
 *
 * Avant : le document vivait dans localStorage sous une clé unique, partagée
 * par tous les comptes et tous les visiteurs d'un même navigateur — d'où le CV
 * du précédent utilisateur qui réapparaissait à la connexion suivante.
 *
 * Maintenant : le CV est chargé depuis le serveur pour le compte porté par le
 * cookie de session, et remis à blanc dès la déconnexion.
 */
export default function App() {
    const [status, setStatus] = useState('loading'); // loading | anonymous | guest | ready
    const [user, setUser] = useState(null);
    const [cvData, setCvData] = useState(EMPTY_CV_DATA);
    const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error

    const componentRef = useRef(null);
    // Empêche la première sauvegarde de partir avant que le document ne soit chargé.
    const loadedRef = useRef(false);

    // --- Session : on demande au serveur qui est connecté ---------------
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const result = await fetchDocument();
                if (cancelled) return;
                if (result) {
                    setUser(result.user);
                    setCvData(withDefaults(result.data));
                    loadedRef.current = true;
                    setStatus('ready');
                } else {
                    setStatus('anonymous');
                }
            } catch {
                if (!cancelled) setStatus('anonymous');
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // --- Sauvegarde automatique, temporisée -----------------------------
    useEffect(() => {
        if (status !== 'ready' || !loadedRef.current) return;

        setSaveState('saving');
        const timer = setTimeout(async () => {
            try {
                await saveDocument(cvData);
                setSaveState('saved');
            } catch {
                setSaveState('error');
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [cvData, status]);

    const handleAuthenticated = useCallback(async (authUser) => {
        setUser(authUser);
        // On repart systématiquement du document du compte qui vient de se
        // connecter : aucune donnée de l'écran précédent n'est conservée.
        loadedRef.current = false;
        setCvData(EMPTY_CV_DATA);
        const result = await fetchDocument();
        setCvData(withDefaults(result?.data));
        loadedRef.current = true;
        setStatus('ready');
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await signOut();
        } catch {
            // Le cookie sera de toute façon ignoré côté serveur.
        }
        loadedRef.current = false;
        setUser(null);
        setCvData(EMPTY_CV_DATA); // l'écran est vidé avant d'afficher la connexion
        setSaveState('idle');
        setStatus('anonymous');
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `CV - ${cvData.personal?.fullName || 'Sans nom'}`,
    });

    const handleSaveJSON = () => {
        const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `CV_${cvData.personal?.fullName?.replace(/\s+/g, '_') || 'Profil'}_${dateStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleLoadJSON = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                setCvData(withDefaults(JSON.parse(e.target.result)));
            } catch (error) {
                alert("Fichier illisible. Vérifie qu'il s'agit bien d'un export JSON de CV Creator.");
                console.error(error);
            }
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    if (status === 'loading') {
        return (
            <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                Chargement…
            </div>
        );
    }

    if (status === 'anonymous') {
        return (
            <AuthScreen
                onAuthenticated={handleAuthenticated}
                onTryWithoutAccount={() => {
                    setCvData(EMPTY_CV_DATA);
                    setStatus('guest');
                }}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 font-sans text-gray-900">
            <Header
                onPrint={handlePrint}
                onSaveJSON={handleSaveJSON}
                onLoadJSON={handleLoadJSON}
                user={user}
                saveState={status === 'ready' ? saveState : 'guest'}
                onLogout={status === 'ready' ? handleLogout : () => setStatus('anonymous')}
            />

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-[400px] bg-white border-r border-gray-200 overflow-y-auto z-10 no-print">
                    <CVEditor data={cvData} setData={setCvData} />
                </aside>
                <main className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center items-start">
                    <div
                        ref={componentRef}
                        className="transform scale-[0.8] origin-top lg:scale-90 xl:scale-100 transition-transform shadow-2xl"
                    >
                        <CVPreview data={cvData} />
                    </div>
                </main>
            </div>
        </div>
    );
}
