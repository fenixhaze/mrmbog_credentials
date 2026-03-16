import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Mail, Calendar, UserPlus, Check, Link2 } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN DE POWER AUTOMATE Y AZURE ---
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
  const [squad, setSquad] = useState([]); 
  const [showSquadModal, setShowSquadModal] = useState(false); 
  const [customProjectTitle, setCustomProjectTitle] = useState("NUEVO PROYECTO MRM");
  const [filterRole, setFilterRole] = useState('All');

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const toggleSquad = (person) => {
      if (!person) return;
      setSquad(prev => prev.some(p => p.ID === person.ID) ? prev.filter(p => p.ID !== person.ID) : [...prev, person]);
  };

  const addEntireTeamToSquad = (teamIds) => {
    const peopleToAdd = talentData.filter(t => teamIds.includes(t.ID));
    setSquad(prev => {
        const newOnes = peopleToAdd.filter(p => !prev.some(s => s.ID === p.ID));
        return [...prev, ...newOnes];
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = window.location.hostname.includes('github.io') ? '/mrmbog_credentials' : '';
        const [tRes, pRes] = await Promise.all([
          fetch(`${baseUrl}/Talent_Database.csv`), 
          fetch(`${baseUrl}/Projects_Database.csv`) 
        ]);

        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        const processedTalent = rawTalent.map(p => ({
            ...p,
            ID: String(p.ID || p.Name), 
            skillsArray: (p.Tags || "").split(',').map(s => s.trim()).filter(Boolean)
        }));
        setTalentData(processedTalent);

        const projectsCSV = await pRes.text();
        const rawProjects = Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        setFlatProjects(rawProjects.map(p => ({
          ...p,
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/1200/800"],
          tagsArray: (p.Tags || "").split(',').map(t => t.trim()).filter(Boolean),
          teamArray: (p.TeamIDs || "").split(',').map(t => t.trim()).filter(Boolean) 
        })));

        setChatHistory([{ type: 'ai', text: `Bienvenido al sistema de credenciales MRM Bogotá. ¿Qué equipo y proyecto vamos a conformar hoy?` }]);
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
    
    try {
        const invLite = JSON.stringify(flatProjects.slice(0, 15).map(p => ({ id: p.ID, n: p.Title })));
        const talLite = JSON.stringify(talentData.slice(0, 15).map(t => ({ n: t.Name, r: t.Role, s: t.skillsArray?.slice(0,3).join(',') })));

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
    } catch (err) { 
        setChatHistory(prev => [...prev, { type: 'ai', text: "Error analizando solicitud en Power Automate." }]); 
    } finally { setIsTyping(false); }
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole)), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase tracking-widest animate-pulse">CARGANDO SISTEMA MRM...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col items-start cursor-pointer pointer-events-auto" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
            <div className="mrm-sub-header text-[10px] text-[#7D68F6] mt-1 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col leading-[1.1] tracking-[-0.02em] font-normal uppercase">
                <span>BOGOTÁ</span>
                <span>CREATIVE</span>
                <span>CREDENTIALS</span>
            </div>
        </div>

        <div className="flex gap-4 items-center pointer-events-auto">
            {activeTab !== 'landing' && (
                <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
                    {[ 
                      {id: 'chat', label: 'CONSULTORÍA IA', icon: <MessageSquare size={14}/>}, 
                      {id: 'projects', label: 'PROYECTOS', icon: <Briefcase size={14}/>}, 
                      {id: 'team', label: 'TALENTO', icon: <Users size={14}/>} 
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white' : 'hover:bg-white/10 text-white/40'}`}> {tab.icon} {tab.label} </button>
                    ))}
                </nav>
            )}
            <motion.div onClick={() => setShowSquadModal(true)} className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg shadow-[#7D68F6]/20" whileHover={{ scale: 1.05 }}>
                <span className="text-[10px] font-black uppercase tracking-widest">TU SQUAD ({squad.length})</span>
                <div className="flex -space-x-3">
                    {squad.slice(0, 4).map((p, idx) => (<img key={idx} src={p.ImageURL} className="w-8 h-8 rounded-full border-2 border-[#7D68F6] bg-black object-cover" alt="sq"/>))}
                </div>
            </motion.div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col pt-24">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-screen items-stretch overflow-hidden -mt-24">
                {[
                    { id: 'chat', title: 'CONSULTORÍA IA', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200', icon: <MessageSquare size={48}/> },
                    { id: 'projects', title: 'PROYECTOS', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200', icon: <Briefcase size={48}/> },
                    { id: 'team', title: 'TALENTO', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200', icon: <Users size={48}/> }
                ].map(card => (
                    <div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0">
                        <div className="absolute inset-0 z-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000" alt=""/></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-32">
                            <div className="mb-8 text-[#7D68F6]">{card.icon}</div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{card.title}</h2>
                        </div>
                    </div>
                ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-24 w-full px-6 flex flex-col h-[calc(100vh-100px)] pb-12 text-left">
                <div className="relative flex-1 mb-8 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-10 pb-4 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[95%] p-6 px-8 rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90 font-normal normal-case">{msg.text}</p>
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <h5 className="text-[14px] font-normal uppercase tracking-[0.1em] text-[#7D68F6] mb-5">CREDENCIALES SUGERIDAS</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                                {msg.results.map((project, idx) => (
                                                    <div key={idx} onClick={() => setSelectedProject(project)} className="min-w-[280px] bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-2xl">
                                                        <div className="h-32 bg-zinc-900"><img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/></div>
                                                        <div className="p-5 text-left">
                                                            <h4 className="text-sm font-black uppercase mb-1">{project.Title}</h4>
                                                            <p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">VER DETALLES</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="mt-6">
                                            <h5 className="text-[14px] font-normal uppercase tracking-[0.1em] text-[#7D68F6] mb-5">SQUAD RECOMENDADO</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                                {msg.recommendedTalent.map((t, idx) => (
                                                    <div key={idx} className="min-w-[170px] bg-black/40 p-5 rounded-[2rem] border border-white/5 text-center group">
                                                        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-white/10 group-hover:border-[#7D68F6]">
                                                            <img src={t.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt=""/>
                                                        </div>
                                                        <p className="text-[11px] font-black uppercase mb-2 truncate w-full">{t.Name}</p>
                                                        <div className="flex flex-wrap justify-center items-center gap-1.5 mb-4">
                                                            {t.skillsArray?.slice(0, 2).map((skill, sIdx) => (
                                                                <span key={sIdx} className="text-[7px] font-medium uppercase px-2 py-1 bg-white/10 text-white/70 rounded-full border border-white/10 whitespace-nowrap leading-none">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <button onClick={() => toggleSquad(t)} className={`w-full py-2 rounded-full text-[9px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(s => s.ID === t.ID) ? 'bg-[#7D68F6] text-white' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                                            {squad.some(s => s.ID === t.ID) ? 'EN SQUAD' : 'ADD SQUAD'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl p-4 px-6 rounded-full self-start">
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D68F6]">ANALIZANDO...</span>
                          </motion.div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[64px] backdrop-blur-md resize-none shadow-2xl font-normal normal-case" />
                    <button onClick={handleSend} disabled={isTyping} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20 disabled:opacity-50"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" className="pt-48 px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {flatProjects.map((p, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedProject(p)} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-xl">
                        <div className="h-64 bg-black overflow-hidden relative"><img src={p.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                        <div className="p-8 text-left"><h4 className="text-xl font-black uppercase text-white mb-2">{p.Title}</h4><p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest">VER DETALLES <ChevronRight size={10} className="inline ml-1"/></p></div>
                    </motion.div>
                ))}
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-16 items-start pt-48 px-12 max-w-7xl mx-auto pb-40 text-left">
                <aside className="w-64 sticky top-48 space-y-10">
                    <h3 className="text-[#7D68F6] text-[10px] font-black uppercase mrm-sub-header tracking-[0.4em]">FILTRAR ROL</h3>
                    <div className="flex flex-col gap-2">
                        {uniqueRoles.map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-md' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{role}</button>))}
                    </div>
                </aside>
                <div className="flex-1 text-left">
                    <h2 className="text-7xl font-black uppercase tracking-tighter leading-none mb-12">EQUIPO BOGOTÁ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalent.map((person, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group overflow-hidden flex flex-col shadow-lg">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-transparent group-hover:border-[#7D68F6] shadow-xl bg-black"><img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                                <h4 className="text-[18px] font-black text-white uppercase mb-1 truncate w-full">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4 tracking-widest">{person.Role}</p>
                                <div className="flex flex-wrap justify-center items-center gap-2 mb-6 min-h-[40px]">
                                    {person.skillsArray?.slice(0, 3).map((skill, sIdx) => (
                                        <span key={sIdx} className="text-[9px] font-medium uppercase px-3 py-1.5 bg-white/10 text-white/70 rounded-full border border-white/10 whitespace-nowrap leading-none shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button onClick={() => toggleSquad(person)} className={`w-full py-3 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] transition-all mt-auto ${squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                    {squad.some(p => p.ID === person.ID) ? 'EN SQUAD' : 'ADD TO SQUAD'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* AQUÍ ESTÁN TUS CAMBIOS: EL NUEVO DETALLE DE PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-start justify-center p-6 backdrop-blur-2xl bg-black/80 pointer-events-auto overflow-y-auto">
            
            {/* Botón de cerrar fijo arriba a la derecha */}
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 backdrop-blur-md rounded-full hover:bg-white text-white hover:text-black transition-all shadow-2xl">
                <X size={24}/>
            </button>

            <div className="w-full max-w-5xl my-12 space-y-8 pb-20 relative">
              
              {/* 1. TARJETA PRINCIPAL DEL PROYECTO */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative text-left">
                
                {/* Carrusel Superior */}
                <div className="relative h-[350px] md:h-[450px] w-full bg-zinc-950 overflow-hidden flex snap-x hide-scrollbar overflow-x-auto">
                  {selectedProject.images && selectedProject.images.length > 0 ? (
                      selectedProject.images.map((img, i) => (
                          <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-start opacity-80" alt="Slide" />
                      ))
                  ) : (
                      <div className="w-full h-full bg-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                </div>

                <div className="p-8 md:p-12 space-y-12">
                  
                  {/* Título, Descripción y Link */}
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                      {selectedProject.Title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 leading-relaxed font-normal normal-case max-w-3xl">
                      {selectedProject.Description || "Información detallada sobre la ejecución y resultados del proyecto."}
                    </p>
                    <a href="#" className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-white/30 group">
                      <Link2 size={16} className="text-[#7D68F6]" />
                      <span>Ver Material del Proyecto</span>
                    </a>
                  </div>

                  {/* Mosaico de Imágenes */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6]">GALERÍA VISUAL</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Generamos 4 espacios basados en las imágenes del proyecto */}
                      {[0, 1, 2, 3].map(i => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                              <img src={selectedProject.images[i] || selectedProject.images[0] || "https://picsum.photos/600"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" alt="Mosaico"/>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Columnas Verticales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                    {[
                      { title: "LO PEDIDO", text: "Integración estructurada de credenciales con requerimientos técnicos y diseño." },
                      { title: "LO HECHO", text: "Desarrollo de una interfaz modular dinámica utilizando React y Tailwind." },
                      { title: "LO LOGRADO", text: "Un ecosistema de consulta rápido, escalable y con experiencia inmersiva." }
                    ].map((col, i) => (
                      <div key={i} className="space-y-4">
                        <h4 className="text-[12px] font-black tracking-[0.3em] text-[#7D68F6] uppercase">{col.title}</h4>
                        <p className="text-sm text-white/50 leading-relaxed font-normal normal-case">{col.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chips Grises de Skills abajo */}
                  <div className="pt-6 flex flex-wrap gap-2">
                    {selectedProject.tagsArray?.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-zinc-800/80 text-zinc-400 text-[10px] font-black rounded-full border border-zinc-700/50 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. TARJETA SEPARADA: TALENTO INVOLUCRADO */}
              {talentData.filter(t => selectedProject.teamArray?.includes(t.ID)).length > 0 && (
                  <div className="bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#7D68F6]">TALENTO INVOLUCRADO</h4>
                      <button onClick={() => addEntireTeamToSquad(selectedProject.teamArray || [])} className="py-3 px-6 bg-[#7D68F6] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-[#7D68F6]/20">
                        <Users size={14}/> AGREGAR EQUIPO AL SQUAD
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {talentData.filter(t => selectedProject.teamArray?.includes(t.ID)).map(member => (
                        <div key={member.ID} className="flex items-center justify-between bg-black/40 p-5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={member.ImageURL} className="w-14 h-14 rounded-full border border-white/10 object-cover" alt=""/>
                            <div>
                                <p className="font-black text-sm uppercase text-white">{member.Name}</p>
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{member.Role}</p>
                            </div>
                          </div>
                          <button onClick={() => toggleSquad(member)} className={`p-3 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white' : 'border-white/10 text-white/30 hover:text-[#7D68F6] hover:border-[#7D68F6]'}`}>
                            {squad.some(s => s.ID === member.ID) ? <Check size={18}/> : <UserPlus size={18}/>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSquadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/95 pointer-events-auto">
            <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-transform hover:rotate-90"><X size={48}/></button>
            <div className="w-full max-w-5xl">
              <input value={customProjectTitle} onChange={(e) => setCustomProjectTitle(e.target.value)} className="bg-transparent text-7xl font-black uppercase border-b-2 border-white/10 focus:border-[#7D68F6] outline-none w-full pb-6 mb-16 tracking-tighter leading-none" placeholder="NOMBRE DEL PROYECTO..."/>
              <div className="grid grid-cols-12 gap-20">
                <div className="col-span-5 bg-zinc-900/50 p-10 rounded-[3rem] border-l-4 border-[#7D68F6] text-left">
                  <p className="text-[#7D68F6] font-black uppercase tracking-widest text-[10px] mb-4 font-bold">ANÁLISIS DE SISTEMA</p>
                  <p className="text-white/60 leading-relaxed text-left font-normal normal-case">"Squad optimizado para ejecución estratégica en MRM Bogotá."</p>
                </div>
                <div className="col-span-7">
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em]">PARTICIPANTES SELECCIONADOS ({squad.length})</h4>
                  <div className="flex flex-wrap gap-6 mb-16 overflow-y-auto max-h-[300px] hide-scrollbar p-2">
                    {squad.map(p => (
                        <div key={p.ID} className="text-center group">
                            <img src={p.ImageURL} className="w-20 h-20 rounded-full border-2 border-white/5 group-hover:border-[#7D68F6] transition-all mb-3 shadow-2xl object-cover" alt=""/>
                            <p className="text-[10px] font-black uppercase">{p.Name.split(' ')[0]}</p>
                            <p className="text-[6px] text-[#7D68F6] font-bold uppercase truncate max-w-[80px]">{p.skillsArray?.slice(0, 2).join(' • ')}</p>
                        </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 py-6 bg-zinc-900 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl font-bold"><Mail size={16}/> FORMULARIO CONTACTO</button>
                    <button onClick={() => { const emails = squad.map(s => s.Email || '').join(';'); window.location.href = `mailto:${emails}?subject=Reunión Squad: ${customProjectTitle}`; }} className="flex-1 py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#7D68F6] hover:text-white transition-all shadow-2xl font-bold"><Calendar size={16}/> REUNIÓN TEAMS</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100] flex gap-4 pointer-events-auto">
        <button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl hover:bg-red-500/10"><LogOut size={22}/></button>
      </footer>
    </div>
  );
}

function LoginScreen() {
  const { instance } = useMsal();
  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-[120px] font-black uppercase tracking-tighter leading-none mb-4">MRM</h1>
            <p className="text-[14px] text-[#7D68F6] font-bold uppercase tracking-[0.5em] mb-12">BOGOTÁ CREATIVE CREDENTIALS</p>
            <button onClick={() => instance.loginRedirect()} className="bg-[#7D68F6] hover:bg-white hover:text-black transition-all duration-300 px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(125,104,246,0.3)]">INICIAR SESIÓN CON MICROSOFT</button>
        </div>
        <style>{`body, html { font-family: 'MW Sans', sans-serif !important; background-color: #0A0A0A !important; } h1, h2, h3, h4, .font-black { font-weight: 900 !important; font-style: normal !important; } * { font-style: normal !important; }`}</style>
    </div>
  );
}

export default function App() { 
  return (
    <MsalProvider instance={msalInstance}>
        <AuthenticatedTemplate><MainContent /></AuthenticatedTemplate>
        <UnauthenticatedTemplate><LoginScreen /></UnauthenticatedTemplate>
    </MsalProvider>
  ); 
}