import React, { useRef } from 'react';
import { Download, FileText, Save, Upload, LogOut, Cloud, CloudOff, Check } from 'lucide-react';

const SAVE_LABELS = {
    saving: { icon: Cloud, text: 'Sauvegarde…', className: 'text-gray-400' },
    saved: { icon: Check, text: 'Sauvegardé', className: 'text-green-600' },
    error: { icon: CloudOff, text: 'Hors ligne', className: 'text-red-500' },
    guest: { icon: CloudOff, text: 'Non sauvegardé', className: 'text-amber-600' },
    idle: null,
};

const Header = ({ onPrint, onSaveJSON, onLoadJSON, user, saveState, onLogout }) => {
    // Référence pour simuler le clic sur l'input de fichier caché
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative no-print">
            <div className="flex items-center gap-3 text-blue-600">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-gray-800 leading-tight">CV Generator Pro</h1>
                    <p className="text-xs text-gray-400 font-medium">
                        {user ? `Connecté en tant que ${user.username}` : 'Mode découverte'}
                    </p>
                </div>
            </div>

            {(() => {
                const state = SAVE_LABELS[saveState];
                if (!state) return null;
                const Icon = state.icon;
                return (
                    <div className={`hidden md:flex items-center gap-2 text-xs font-medium ${state.className}`}>
                        <Icon size={15} />
                        {state.text}
                    </div>
                );
            })()}

            <div className="flex items-center gap-3">
                {/* Input caché pour sélectionner un fichier JSON sur ton PC */}
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={onLoadJSON}
                    className="hidden"
                />

                <button
                    onClick={triggerFileInput}
                    title="Charger une version de CV (.json)"
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
                >
                    <Upload size={18} className="text-blue-500" />
                    <span className="text-sm hidden sm:inline">Charger Data</span>
                </button>

                <button
                    onClick={onSaveJSON}
                    title="Télécharger les données du CV (.json)"
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
                >
                    <Save size={18} className="text-green-500" />
                    <span className="text-sm hidden sm:inline">Sauvegarder Data</span>
                </button>

                {/* Séparateur visuel */}
                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                <button
                    onClick={onPrint}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-slate-200"
                >
                    <Download size={18} />
                    <span>Télécharger PDF</span>
                </button>

                <button
                    onClick={onLogout}
                    title={user ? 'Se déconnecter' : 'Revenir à la connexion'}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm hidden lg:inline">{user ? 'Déconnexion' : 'Connexion'}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;