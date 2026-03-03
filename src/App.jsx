import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Plus, Mail, Calendar, UserPlus, Check } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN ---
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
  const [customProjectTitle, setCustomProjectTitle] = useState("MI PROYECTO DE ÉLITE");
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

        <div className="flex gap-4 items-center">
            {activeTab !== 'landing' && (
                <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
                    {[ {id: 'chat', label: 'IA Copilot', icon: <MessageSquare size={14}/>}, {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>}, {id: 'team', label: 'Talento', icon: <Users size={14}/>} ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white' : 'hover:bg-white/10 text-white/40'}`}> {tab.icon} {tab.label} </button>
                    ))}
                </nav>
            )}
            <motion.div onClick={() => setShowSquadModal(true)} className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg shadow-[#7D68F6]/20" whileHover={{ scale: 1.05 }}>
                <span className="text-[10px] font-black uppercase tracking-widest">Tu Squad ({squad.length})</span>
                <div className="flex -space-x-3">
                    {squad.slice(0, 4).map((p, idx) => (<img key={idx} src={p.ImageURL} className="w-8 h-8 rounded-full border-2 border-[#7D68F6] bg-black object-cover" alt="sq"/>))}
                </div>
            </motion.div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-screen items-stretch overflow-hidden">
                {[
                    { id: 'chat', title: 'Consultoría IA', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200', icon: <MessageSquare size={48}/> },
                    { id: 'projects', title: 'Proyectos', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200', icon: <Briefcase size={48}/> },
                    { id: 'team', title: 'Talento', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200', icon: <Users size={48}/> }
                ].map(card => (
                    <div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0">
                        <div className="absolute inset-0 z-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000" alt=""/></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-24">
                            <div className="mb-8 text-[#7D68F6]">{card.icon}</div>
                            <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">{card.title}</h2>
                        </div>
                    </div>
                ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-48 w-full px-6 flex flex-col h-screen pb-12">
                <div className="relative flex-1 mb-8 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-10 pb-4 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[95%] p-6 px-8 rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90">{msg.text}</p>
                                    
                                    {/* CARDS DE RESULTADOS IA */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-5">Credenciales Sugeridas</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                                {msg.results.map((project, idx) => (
                                                    <div key={idx} onClick={() => setSelectedProject(project)} className="min-w-[280px] bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all">
                                                        <div className="h-32 bg-zinc-900"><img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt=""/></div>
                                                        <div className="p-5">
                                                            <h4 className="text-sm font-black uppercase mb-1">{project.Title}</h4>
                                                            <p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest tracking-widest">Ver Detalles</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="mt-6">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-5">Squad Recomendado</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                                {msg.recommendedTalent.map((t, idx) => (
                                                    <div key={idx} className="min-w-[160px] bg-black/40 p-5 rounded-[2rem] border border-white/5 text-center group">
                                                        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-white/10 group-hover:border-[#7D68F6]">
                                                            <img src={t.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt=""/>
                                                        </div>
                                                        <p className="text-[11px] font-black uppercase mb-1 truncate w-full">{t.Name}</p>
                                                        <button onClick={() => toggleSquad(t)} className={`w-full py-2 rounded-full text-[9px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(s => s.ID === t.ID) ? 'bg-[#7D68F6] text-white' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                                            {squad.some(s => s.ID === t.ID) ? 'En Squad' : 'Add Squad'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[64px] backdrop-blur-md resize-none shadow-2xl" />
                    <button onClick={handleSend} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" className="pt-48 px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {flatProjects.map((p, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedProject(p)} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-xl">
                        <div className="h-64 bg-black overflow-hidden relative"><img src={p.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                        <div className="p-8"><h4 className="text-xl font-black uppercase text-white mb-2">{p.Title}</h4><p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest">Ver Detalles <ChevronRight size={10} className="inline ml-1"/></p></div>
                    </motion.div>
                ))}
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-16 items-start pt-48 px-12 max-w-7xl mx-auto pb-40">
                <aside className="w-64 sticky top-48 space-y-10">
                    <h3 className="text-[#7D68F6] text-[10px] font-black uppercase mrm-sub-header">Filtrar Rol</h3>
                    <div className="flex flex-col gap-2">
                        {uniqueRoles.map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-md' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{role}</button>))}
                    </div>
                </aside>
                <div className="flex-1">
                    <h2 className="text-7xl font-black uppercase tracking-tighter leading-none mb-12">Equipo Bogotá</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalent.map((person, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group overflow-hidden flex flex-col">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-transparent group-hover:border-[#7D68F6] shadow-xl bg-black"><img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                                <h4 className="text-[18px] font-black text-white uppercase mb-1">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-6">{person.Role}</p>
                                <button onClick={() => toggleSquad(person)} className={`w-full py-3 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                    {squad.some(p => p.ID === person.ID) ? 'En Squad' : 'Add to Squad'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL DE PROYECTOS (TWEAK 2 & 4) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden relative flex flex-col shadow-2xl">
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 z-20 p-4 bg-black/50 rounded-full hover:bg-white text-black transition-all shadow-2xl"><X size={24}/></button>
              <div className="h-[40%] bg-zinc-950 overflow-hidden relative flex overflow-x-auto snap-x hide-scrollbar">
                {selectedProject.images.map((img, i) => (<img key={i} src={img} className="w-full h-full object-cover opacity-60 flex-shrink-0 snap-start" alt=""/>))}
              </div>
              <div className="p-16 flex-1 overflow-y-auto grid grid-cols-12 gap-16 hide-scrollbar">
                <div className="col-span-7">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tagsArray?.map(tag => (<span key={tag} className="text-[9px] font-black uppercase px-4 py-1.5 bg-[#7D68F6]/10 text-[#7D68F6] border border-[#7D68F6]/20 rounded-full">{tag}</span>))}
                  </div>
                  <h2 className="text-6xl font-black italic uppercase mb-8 tracking-tighter leading-none">{selectedProject.Title}</h2>
                  <p className="text-xl text-white/60 leading-relaxed italic">{selectedProject.Description}</p>
                </div>
                <div className="col-span-5 bg-white/5 p-10 rounded-[2.5rem] border border-white/5 flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-8">Talento involucrado</h4>
                  <div className="space-y-4 mb-10 overflow-y-auto max-h-[300px] hide-scrollbar">
                    {talentData.filter(t => selectedProject.teamArray?.includes(t.ID)).map(member => (
                      <div key={member.ID} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <img src={member.ImageURL} className="w-12 h-12 rounded-full border border-white/10 group-hover:border-[#7D68F6] transition-all object-cover" alt=""/>
                          <div className="text-left"><p className="font-black text-sm uppercase">{member.Name}</p><p className="text-[10px] text-white/40 font-bold uppercase">{member.Role}</p></div>
                        </div>
                        <button onClick={() => toggleSquad(member)} className={`p-2 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white' : 'border-white/20 text-white/20 hover:text-[#7D68F6]'}`}>
                          {squad.some(s => s.ID === member.ID) ? <Check size={16}/> : <UserPlus size={16}/>}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addEntireTeamToSquad(selectedProject.teamArray || [])} className="mt-auto py-5 bg-[#7D68F6] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:scale-105 transition-all flex items-center justify-center gap-3"><Users size={18}/> Agrega a todo el equipo</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TWEAK 5: MODAL OVERVIEW TU SQUAD */}
      <AnimatePresence>
        {showSquadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/95">
            <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-transform hover:rotate-90"><X size={48}/></button>
            <div className="w-full max-w-5xl">
              <input value={customProjectTitle} onChange={(e) => setCustomProjectTitle(e.target.value)} className="bg-transparent text-7xl font-black italic uppercase border-b-2 border-white/10 focus:border-[#7D68F6] outline-none w-full pb-6 mb-16 tracking-tighter leading-none" placeholder="Título del Proyecto..."/>
              <div className="grid grid-cols-12 gap-20">
                <div className="col-span-5 bg-zinc-900/50 p-10 rounded-[3rem] border-l-4 border-[#7D68F6]">
                  <p className="text-[#7D68F6] font-black uppercase tracking-widest text-[10px] mb-4">Chatbot Analysis</p>
                  <p className="text-white/60 italic text-xl leading-relaxed">"Squad optimizado para ejecución estratégica en MRM Bogotá."</p>
                </div>
                <div className="col-span-7">
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em]">Participantes Seleccionados ({squad.length})</h4>
                  <div className="flex flex-wrap gap-6 mb-16 overflow-y-auto max-h-[300px] hide-scrollbar p-2">
                    {squad.map(p => (<div key={p.ID} className="text-center group"><img src={p.ImageURL} className="w-20 h-20 rounded-full border-2 border-white/5 group-hover:border-[#7D68F6] transition-all mb-3 shadow-2xl object-cover" alt=""/><p className="text-[10px] font-black uppercase">{p.Name.split(' ')[0]}</p></div>))}
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 py-6 bg-zinc-900 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"><Mail size={16}/> Formulario Contacto</button>
                    <button onClick={() => { const emails = squad.map(s => s.Email || '').join(';'); window.location.href = `mailto:${emails}?subject=Reunión Squad: ${customProjectTitle}`; }} className="flex-1 py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#7D68F6] hover:text-white transition-all shadow-2xl"><Calendar size={16}/> Reunión Teams</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100] flex gap-4">
        <button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl hover:bg-red-500/10"><LogOut size={22}/></button>
      </footer>

      <style>{`
        body, html { font-family: 'MW Sans', sans-serif !important; background-color: #0A0A0A !important; scroll-behavior: smooth; }
        h1, h2, h3, h4, .font-black { font-weight: 900 !important; line-height: 0.9 !important; }
        .mrm-sub-header { letter-spacing: 0.4em !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%); }
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
            <div className="mrm-sub-header flex flex-col text-[14px] text-[#7D68F6] mb-20 border-l-4 border-[#7D68F6] pl-6 text-left uppercase">
                <span>Bogota</span><span>Creative</span><span>Credentials</span>
            </div>
            <button onClick={() => msalInstance.loginRedirect({ scopes: ["User.Read"] })} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-110 transition-all">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}