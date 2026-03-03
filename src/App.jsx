import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Plus, Mail, Calendar, UserPlus } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN (Mantenida) ---
const POWER_AUTOMATE_URL = "https://defaultd026e4c15892497ab9daee493c9f03.64.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/58399658d2814f708a2774d517d4b66a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W9bUtaaDctUdbMF6_y7e63sZ7GExKXeuYite_O5T4kg"; 

const authConfig = {
    auth: {
        clientId: "23d1168d-113b-48c0-a4fe-6e6d743f77af",
        authority: "https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364",
        redirectUri: "https://fenixhaze.github.io/mrmbog_credentials/", 
    },
    cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
};

const msalInstance = new PublicClientApplication(authConfig);

function MainContent() {
  const { instance, accounts } = useMsal();
  const [activeTab, setActiveTab] = useState('landing'); 
  const [talentData, setTalentData] = useState([]); 
  const [flatProjects, setFlatProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [squad, setSquad] = useState([]); // TWEAK 3: Tu Squad
  const [filterRole, setFilterRole] = useState('All');
  const [showSquadModal, setShowSquadModal] = useState(false); // TWEAK 5
  const [customProjectTitle, setCustomProjectTitle] = useState("MI PROYECTO DE ÉLITE"); // TWEAK 5

  const chatContainerRef = useRef(null);

  // --- LÓGICA DE SQUAD ---
  const toggleSquad = (person) => {
      setSquad(prev => prev.some(p => p.Name === person.Name) ? prev.filter(p => p.Name !== person.Name) : [...prev, person]);
  };

  const addEntireTeamToSquad = (teamNames) => {
    const peopleToAdd = talentData.filter(t => teamNames.includes(t.Name));
    setSquad(prev => {
        const newOnes = peopleToAdd.filter(p => !prev.some(s => s.Name === p.Name));
        return [...prev, ...newOnes];
    });
  };

  // --- FETCH DATA (Mantenido) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = { scopes: ["User.Read"], account: accounts[0] };
        try { await instance.acquireTokenSilent(request); } catch (e) { if (e.name === "InteractionRequiredAuthError") await instance.acquireTokenRedirect(request); }

        const baseUrl = window.location.hostname.includes('github.io') ? '/mrmbog_credentials' : '';
        const [tRes, pRes] = await Promise.all([
          fetch(`${baseUrl}/Talent_Database.csv`), 
          fetch(`${baseUrl}/Projects_Database.csv`) 
        ]);

        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        setTalentData(rawTalent.map(p => ({
            ...p,
            skillsArray: (p.Tags || "").split(',').map(s => s.trim()).filter(Boolean)
        })));

        const projectsCSV = await pRes.text();
        const rawProjects = Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        setFlatProjects(rawProjects.map(p => ({
          ...p,
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/1200/800"],
          tagsArray: (p.Tags || "").split(',').map(t => t.trim()).filter(Boolean),
          teamArray: (p.TeamIDs || "").split(',').map(t => t.trim()).filter(Boolean) // TWEAK 4
        })));

        setChatHistory([{ type: 'ai', text: `Consultoría Estratégica MRM. ¿Qué equipo de élite vamos a conformar hoy?` }]);
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, [instance, accounts]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    const invLite = JSON.stringify(flatProjects.slice(0, 12).map(p => ({ id: p.ID, n: p.Title })));
    const talLite = JSON.stringify(talentData.slice(0, 15).map(t => ({ n: t.Name, r: t.Role, s: t.skillsArray?.slice(0,3).join(',') })));

    try {
        const response = await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ PreguntaUsuario: userMsg, Inventario: invLite, Talento: talLite })
        });
        const data = await response.json();
        const rawContent = data.content || data.text || "";
        
        let pIds = [], tNames = [], cleanReason = "";
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                pIds = parsed.match_ids || [];
                tNames = parsed.talent_names || [];
                cleanReason = parsed.reason || "";
            } catch { cleanReason = rawContent; }
        } else { cleanReason = rawContent; }

        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: cleanReason, 
            results: flatProjects.filter(p => pIds.includes(p.ID)), 
            recommendedTalent: talentData.filter(t => tNames.includes(t.Name)).slice(0, 4) 
        }]);
    } catch (err) { setChatHistory(prev => [...prev, { type: 'ai', text: "Error analizando solicitud." }]); } 
    finally { setIsTyping(false); }
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole)), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase tracking-widest animate-pulse">MRM BOGOTÁ</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start">
        <div className="flex flex-col items-start cursor-pointer" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
            <div className="mrm-sub-header text-[10px] text-[#7D68F6] mt-2 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col leading-[1.1]">
                <span>Bogota</span><span>Creative</span><span>Credentials</span>
            </div>
        </div>

        {/* TWEAK 3: COMPONENTE "TU SQUAD" */}
        <div className="flex gap-4 items-center">
            {activeTab !== 'landing' && (
                <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
                    {[ {id: 'chat', label: 'IA Copilot', icon: <MessageSquare size={14}/>}, {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>}, {id: 'team', label: 'Talento', icon: <Users size={14}/>} ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white' : 'hover:bg-white/10 text-white/40'}`}> {tab.icon} {tab.label} </button>
                    ))}
                </nav>
            )}
            
            <motion.div 
                onClick={() => setShowSquadModal(true)}
                className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20"
                whileHover={{ scale: 1.05 }}
            >
                <span className="text-[10px] font-black uppercase tracking-widest">Tu Squad ({squad.length})</span>
                <div className="flex -space-x-3">
                    {squad.slice(0, 3).map((p, idx) => (
                        <img key={idx} src={p.ImageURL} className="w-8 h-8 rounded-full border-2 border-[#7D68F6] bg-black object-cover" alt="squad"/>
                    ))}
                </div>
            </motion.div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-stretch h-screen overflow-hidden">
              {[
                { id: 'chat', title: 'Consultoría IA', desc: 'Armamos tu equipo y portafolio de élite.', icon: <MessageSquare size={48}/>, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964' },
                { id: 'projects', title: 'Proyectos', desc: 'Credenciales que definen nuestra visión.', icon: <Briefcase size={48}/>, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070' },
                { id: 'team', title: 'Talento', desc: 'El corazón creativo de Bogotá.', icon: <Users size={48}/>, img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070' }
              ].map((card) => (
                <motion.div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/10">
                  {/* TWEAK 1: GRADIENTE PARA MEJOR VISUALIZACIÓN */}
                  <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 z-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000 ease-out" alt="bg"/></div>
                  <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-24"><div className="mb-8 text-[#7D68F6] group-hover:translate-y-[-10px] transition-transform duration-500">{card.icon}</div><h3 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">{card.title}</h3><p className="text-white/60 text-lg leading-relaxed max-w-xs mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{card.desc}</p><div className="flex items-center gap-3 text-[#7D68F6] font-black text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">Explorar <ChevronRight size={18}/></div></div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-48 w-full px-6 flex flex-col h-screen">
                <div className="relative flex-1 mb-8 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-10 pb-4 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[95%] p-5 px-6 rounded-[2rem] text-[15px] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90">{msg.text}</p>
                                    {/* Mismos resultados que antes... */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full mb-12">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe tu necesidad..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[64px] backdrop-blur-md resize-none shadow-2xl" />
                    <button onClick={handleSend} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 px-12 max-w-7xl mx-auto pb-40">
                <div className="mb-12"><h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Proyectos</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {flatProjects.map((project, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedProject(project)} className="bg-[#141414] border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-xl flex flex-col">
                            <div className="h-64 overflow-hidden relative bg-black">
                                <img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="img"/>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h4 className="text-[20px] font-black uppercase text-white tracking-tighter mb-2">{project.Title}</h4>
                                <p className="text-[12px] text-[#7D68F6] font-black uppercase tracking-widest mb-6">{project.Category}</p>
                                <div className="text-[11px] font-black uppercase text-white/40 group-hover:text-white transition-colors flex items-center gap-2 pt-4 border-t border-white/5">
                                    Ver detalles <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* TWEAK 2 & 4: MODAL DE PROYECTO ACTUALIZADO */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0f0f0f] border border-white/10 w-full max-w-5xl h-[90vh] rounded-[3rem] overflow-hidden relative flex flex-col shadow-2xl">
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 z-10 p-4 bg-black/50 rounded-full hover:bg-[#7D68F6] transition-all text-white"><X size={24}/></button>
              
              <div className="h-[40%] bg-black relative flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                  {selectedProject.images.map((img, i) => (<img key={i} src={img} className="w-full h-full flex-shrink-0 snap-start object-cover" alt="gallery"/>))}
              </div>

              <div className="p-12 flex-1 overflow-y-auto hide-scrollbar grid grid-cols-12 gap-10">
                  <div className="col-span-7">
                      <p className="text-[#7D68F6] font-black uppercase tracking-[0.4em] text-xs mb-2 mrm-sub-header">{selectedProject.Category}</p>
                      <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 text-white">{selectedProject.Title}</h2>
                      
                      {/* TWEAK 2: CHIPS DE SKILLS EN MODAL */}
                      <div className="flex flex-wrap gap-2 mb-8">
                          {selectedProject.tagsArray?.map((tag, idx) => (
                              <span key={idx} className="text-[10px] font-black uppercase px-4 py-2 bg-[#7D68F6]/10 text-[#7D68F6] rounded-full border border-[#7D68F6]/20">{tag}</span>
                          ))}
                      </div>
                      
                      <div className="text-white/80 leading-relaxed text-lg">{selectedProject.Description}</div>
                  </div>

                  {/* TWEAK 4: PERSONAS QUE PARTICIPARON */}
                  <div className="col-span-5 border-l border-white/10 pl-10 flex flex-col">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-6 mrm-sub-header">Participantes del Proyecto</h4>
                      <div className="space-y-4 mb-8">
                          {talentData.filter(t => selectedProject.teamArray?.includes(t.Name)).map((person, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5 group hover:border-[#7D68F6]/50 transition-all">
                                  <div className="flex items-center gap-4">
                                      <img src={person.ImageURL} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="avatar"/>
                                      <div>
                                          <p className="text-[12px] font-black uppercase">{person.Name}</p>
                                          <p className="text-[9px] text-white/40 font-bold uppercase">{person.Role}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => toggleSquad(person)} className="p-2 bg-black/50 rounded-full hover:bg-[#7D68F6] text-white">
                                      <UserPlus size={14}/>
                                  </button>
                              </div>
                          ))}
                      </div>
                      
                      <button 
                        onClick={() => addEntireTeamToSquad(selectedProject.teamArray || [])}
                        className="mt-auto w-full py-5 bg-[#7D68F6] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-xl shadow-[#7D68F6]/20"
                      >
                        Agrega a tu Squad
                      </button>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TWEAK 5: MODAL DE RESUMEN TU SQUAD */}
      <AnimatePresence>
          {showSquadModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90">
                  <div className="w-full max-w-5xl">
                      <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 p-5 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><X size={32}/></button>
                      
                      {/* TITULO EDITABLE */}
                      <input 
                        value={customProjectTitle} 
                        onChange={(e) => setCustomProjectTitle(e.target.value)}
                        className="bg-transparent text-7xl font-black uppercase tracking-tighter w-full border-b-4 border-white/10 focus:border-[#7D68F6] outline-none pb-4 mb-12 text-white italic"
                      />

                      <div className="grid grid-cols-12 gap-16">
                          <div className="col-span-4 space-y-8">
                              <div className="bg-white/5 p-8 rounded-[2rem] border-l-4 border-[#7D68F6]">
                                  <p className="text-[#7D68F6] text-[10px] font-black uppercase tracking-widest mb-4">Análisis del Chatbot</p>
                                  <p className="text-white/60 italic leading-relaxed">"Este equipo ha sido seleccionado basado en el match de skills y experiencia previa en proyectos similares de MRM Bogotá. Listo para el despliegue."</p>
                              </div>
                              <div className="flex flex-col gap-4">
                                  <button className="w-full py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white/10"><Mail size={16}/> Formulario Contacto</button>
                                  <button className="w-full py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-[#7D68F6] hover:text-white transition-all"><Calendar size={16}/> Reunión Teams</button>
                              </div>
                          </div>

                          <div className="col-span-8 flex flex-wrap gap-8 content-start">
                              {squad.map((person, idx) => (
                                  <div key={idx} className="flex flex-col items-center group">
                                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/5 group-hover:border-[#7D68F6] transition-all mb-4 shadow-2xl">
                                          <img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="avatar"/>
                                      </div>
                                      <p className="text-[12px] font-black uppercase mb-1">{person.Name}</p>
                                      <p className="text-[9px] text-[#7D68F6] font-black uppercase">{person.Role}</p>
                                  </div>
                              ))}
                              {squad.length === 0 && <p className="text-white/20 uppercase font-black italic tracking-widest text-2xl">No hay miembros en tu squad aún.</p>}
                          </div>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100] flex gap-4">
        <button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl"><LogOut size={22}/></button>
      </footer>

      <style>{`
        body, html { font-family: 'MW Sans', sans-serif !important; background-color: #0A0A0A !important; }
        .mrm-sub-header { letter-spacing: 0.4em !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 15%); }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate><MainContent /></AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center">
            <h1 className="text-[15vw] font-black text-white mb-2 tracking-tighter leading-none">MRM.</h1>
            <button onClick={() => msalInstance.loginRedirect({ scopes: ["User.Read"] })} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-110 transition-all mt-10">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}