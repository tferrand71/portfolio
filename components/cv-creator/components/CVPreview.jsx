import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
// lucide-react a retiré les icônes de marque : on prend celles de react-icons,
// déjà utilisé par le portfolio. Même prop `size`, substitution transparente.
import { FaLinkedin as Linkedin, FaGithub as Github } from 'react-icons/fa';

const CVPreview = ({ data }) => {
    // On sécurise les variables avec un objet vide {} par défaut
    const { personal = {}, theme = {}, experiences, education, skills, languages, certifications, projects, interests } = data || {};
    const mainColor = theme.color || '#2563eb';

    const sidebarStyle = { backgroundColor: theme.sidebar || '#1e293b', color: 'white' };
    const contentStyle = { backgroundColor: theme.background || '#ffffff' };

    return (
        <div className="a4-screen flex print-exact mx-auto shadow-2xl overflow-hidden text-gray-800">

            {/* === COLONNE GAUCHE (SIDEBAR) === */}
            <div className="w-[35%] flex flex-col relative print-exact min-h-full" style={sidebarStyle}>
                <div className="absolute top-0 w-full h-2 opacity-30 bg-white"></div>
                <div className="p-8 flex flex-col gap-8">

                    {/* PHOTO */}
                    <div className="flex justify-center mt-4">
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white/10 flex items-center justify-center">
                            {personal?.photo ? (
                                <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold opacity-50 text-white">{personal?.fullName?.charAt(0) || "T"}</span>
                            )}
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 border-b border-white/20 pb-2">Contact</h3>
                        <div className="flex flex-col gap-3 text-sm font-light opacity-90">
                            {/* Remplacement de items-center par items-start, ajout de shrink-0 sur l'icône et break-all sur le texte */}
                            {personal?.email && <div className="flex items-start gap-3"><Mail size={14} className="shrink-0 mt-0.5"/> <span className="break-all">{personal.email}</span></div>}
                            {personal?.phone && <div className="flex items-start gap-3"><Phone size={14} className="shrink-0 mt-0.5"/> <span>{personal.phone}</span></div>}
                            {personal?.address && <div className="flex items-start gap-3"><MapPin size={14} className="shrink-0 mt-0.5"/> <span>{personal.address}</span></div>}

                            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
                                {/* Ici on remplace "truncate" par "break-all" */}
                                {personal?.linkedin && <div className="flex items-start gap-3"><Linkedin size={14} className="shrink-0 mt-0.5"/> <span className="text-xs break-all">{personal.linkedin}</span></div>}
                                {personal?.github && <div className="flex items-start gap-3"><Github size={14} className="shrink-0 mt-0.5"/> <span className="text-xs break-all">{personal.github}</span></div>}
                                {personal?.website && <div className="flex items-start gap-3"><Globe size={14} className="shrink-0 mt-0.5"/> <span className="text-xs break-all">{personal.website}</span></div>}
                            </div>
                        </div>
                    </div>

                    {/* COMPÉTENCES */}
                    {skills?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 border-b border-white/20 pb-2">Compétences</h3>
                            <div className="flex flex-col gap-4">
                                {skills.map(skillCat => (
                                    <div key={skillCat.id}>
                                        {skillCat.category && (
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-2">
                                                {skillCat.category}
                                            </h4>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {skillCat.items?.map(item => (
                                                <span key={item.id} className="bg-white/10 px-2 py-1 rounded text-xs border border-white/10 shadow-sm">
                                                    {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {certifications?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 border-b border-white/20 pb-2">Certifications</h3>
                            <div className="flex flex-col gap-2">
                                {certifications.map(cert => (
                                    <span key={cert.id} className="text-sm font-medium opacity-90 block">
                                        {cert.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* LANGUES */}
                    {languages?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 border-b border-white/20 pb-2">Langues</h3>
                            <div className="flex flex-col gap-2">
                                {languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between items-center text-sm">
                                        <span className="font-medium opacity-90">{lang.name}</span>
                                        <span className="italic text-xs opacity-70 bg-white/10 px-2 py-0.5 rounded">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CENTRES D'INTÉRÊT */}
                    {interests?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 border-b border-white/20 pb-2">Centres d'intérêt</h3>
                            <div className="flex flex-wrap gap-2">
                                {interests.map(interest => (
                                    <span key={interest.id} className="bg-white/10 px-2 py-1 rounded text-xs border border-white/10 shadow-sm">
                                        {interest.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* === COLONNE DROITE (CONTENU) === */}
            <div className="w-[65%] p-10 flex flex-col" style={contentStyle}>

                {/* HEADER */}
                <header className="mt-6 mb-10">
                    <h1 className="text-4xl font-extrabold uppercase tracking-tight leading-none mb-2 text-gray-900">{personal?.fullName}</h1>
                    <h2 className="text-xl font-medium tracking-wide" style={{ color: mainColor }}>{personal?.title}</h2>
                </header>

                {/* RESUME */}
                {personal?.summary && (
                    <section className="mb-8">
                        <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                            <span className="w-6 h-1 rounded" style={{backgroundColor: mainColor}}></span> Profil
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            {personal.summary}
                        </p>
                    </section>
                )}

                {/* EXPÉRIENCES */}
                {experiences?.length > 0 && (
                    <section className="mb-8">
                        <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2 text-sm">
                            <span className="w-6 h-1 rounded" style={{backgroundColor: mainColor}}></span> Expériences
                        </h3>

                        <div className="flex flex-col gap-6">
                            {experiences.map(exp => (
                                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{backgroundColor: mainColor}}></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-md text-gray-800">{exp.role}</h4>
                                    </div>
                                    <div className="text-sm font-semibold mb-2" style={{color: mainColor}}>{exp.company}</div>
                                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                        {exp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROJETS PERSONNELS */}
                {projects?.length > 0 && (
                    <section className="mb-8">
                        <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2 text-sm">
                            <span className="w-6 h-1 rounded" style={{backgroundColor: mainColor}}></span> Projets Personnels
                        </h3>

                        <div className="flex flex-col gap-6">
                            {projects.map(proj => (
                                <div key={proj.id} className="relative pl-4 border-l-2 border-gray-200">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{backgroundColor: mainColor}}></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-md text-gray-800">{proj.name}</h4>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{proj.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                        {proj.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* FORMATION */}
                {education?.length > 0 && (
                    <section>
                        <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2 text-sm">
                            <span className="w-6 h-1 rounded" style={{backgroundColor: mainColor}}></span> Formation
                        </h3>
                        <div className="flex flex-col gap-4">
                            {education.map(edu => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-sm text-gray-800">{edu.degree}</div>
                                        <div className="text-xs text-gray-500 italic">{edu.school}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default CVPreview;