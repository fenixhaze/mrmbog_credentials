import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, Filter, ChevronRight, Loader2, X, Star } from 'lucide-react';
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
  
  const [filterRole, setFilterRole] = useState('All');
  const [filterSkill, setFilterSkill] = useState('All');

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenRes = await instance.acquireTokenSilent({
          scopes: ["Files.Read", "User.Read"],
          account: accounts[0]
        });
        const headers = { 'Authorization': `Bearer ${tokenRes.accessToken}` };
        const [tRes, pRes] = await Promise.all([
          fetch(`https://graph.microsoft.com/v1.0/me/drive/items/01M53CARQG2KHMRUDB7NHK4ARNCRUIXTNX/content`, { headers }),
          fetch(`https://graph.microsoft.com/v1.0/me/drive/items/01M53CARURZZPIO6GCCBG3SJUDAKN5OX7T/content`, { headers })
        ]);
        
        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        setTalentData(rawTalent.map(p => ({
            ...p,
            skillsArray: (p.Tags || p.tags || "").split(/[,;]/).map(s => s.trim()).filter(s => s !== "")
        })));

        const projectsCSV = await pRes.text();
        setFlatProjects(Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data.map((p, index) => ({
          ...p,
          internalID: `ID_${index}`, 
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/1200/800"],
          tagsArray: p.Tags ? p.Tags.split(',').map(t => t.trim()) : []
        })));

        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Consultoría Estratégica MRM. ¿Qué equipo de élite vamos a conformar hoy?` }]);
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
    
    // Mantenemos la estructura ligera para que Power Automate no se rompa
    const invLite = JSON.stringify(flatProjects.slice(0, 12).map(p => ({ id: p.ID || p.internalID, n: p.ProjectName })));
    const talLite = JSON.stringify(talentData.slice(0, 15).map(t => ({ n: t.Name, r: t.Role, s: t.skillsArray?.slice(0,3).join(',') })));

    try {
        const response = await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                PreguntaUsuario: userMsg, 
                Inventario: invLite,
                Talento: talLite
            })
        });
        
        const data = await response.json();
        const rawContent = data.content || data.text || "";
        
        let pIds = [];
        let tNames = [];
        let cleanReason = "";

        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                pIds = parsed.match_ids || [];
                tNames = parsed.talent_names || [];
                cleanReason = parsed.reason || "";
            } catch { cleanReason = rawContent; }
        } else { cleanReason = rawContent; }

        const matchedP = flatProjects.filter(p => pIds.includes(p.internalID) || pIds.includes(p.ID));
        const matchedT = talentData.filter(t => tNames.includes(t.Name)).slice(0, 4);

        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: cleanReason, 
            results: matchedP,
            recommendedTalent: matchedT
        }]);

    } catch (err) { 
        setChatHistory(prev => [...prev, { type: 'ai', text: "Hubo un error analizando la solicitud. Verifica el flujo." }]); 
    } finally { setIsTyping(false); }
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole) && (filterSkill === 'All' || p.skillsArray.includes(filterSkill))), [talentData, filterRole, filterSkill]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);
  const uniqueSkills = useMemo(() => ['All', ...new Set(talentData.flatMap(t => t.skillsArray))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest animate-pulse uppercase">MRM BOGOTÁ</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-start cursor-pointer" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
            <div className="flex flex-col text-[10px] font-black uppercase tracking-[0.3em] text-[#7D68F6] mt-2 ml-1 leading-[1.1] border-l-2 border-[#7D68F6] pl-3">
                <span>Bogota</span><span>Creative</span><span>Credentials</span>
            </div>
        </div>
        {activeTab !== 'landing' && (
          <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full pointer-events-auto shadow-2xl">
              {[ {id: 'chat', label: 'IA Copilot', icon: <MessageSquare size={14}/>}, {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>}, {id: 'team', label: 'Talento', icon: <Users size={14}/>} ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white shadow-xl' : 'hover:bg-white/10 text-white/40'}`}> {tab.icon} {tab.label} </button>
              ))}
          </nav>
        )}
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
                <motion.div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/10 last:border-r-0">
                  <div className="absolute inset-0 z-0"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000 ease-out" alt="bg"/><div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" /></div>
                  <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-24"><div className="mb-8 text-[#7D68F6] group-hover:translate-y-[-10px] transition-transform duration-500">{card.icon}</div><h3 className="text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">{card.title}</h3><p className="text-white/60 text-lg leading-relaxed max-w-xs mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{card.desc}</p><div className="flex items-center gap-3 text-[#7D68F6] font-black text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">Explorar <ChevronRight size={18}/></div></div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-48 w-full px-6">
                <div className="relative h-[650px] mb-10 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-10 pb-40 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                {/* AJUSTE VISUAL: Padding reducido y esquinas suavizadas en las burbujas */}
                                <div className={`max-w-[85%] p-6 px-8 rounded-[2rem] text-[15px] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none shadow-[#7D68F6]/20' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none shadow-2xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90">{msg.text}</p>
                                    
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-8 flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory border-t border-white/5 pt-6">
                                            {msg.results.map((project, idx) => (
                                                <motion.div key={idx} whileHover={{ y: -5 }} onClick={() => setSelectedProject(project)} className="min-w-[240px] w-[240px] flex-shrink-0 snap-start bg-black/40 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all">
                                                    <div className="h-32 overflow-hidden relative"><img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="img"/></div>
                                                    <div className="p-4"><h4 className="text-xs font-black uppercase tracking-tighter mb-1 truncate">{project.ProjectName}</h4><p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest truncate">{project.Client}</p><div className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors flex items-center gap-1">Detalles <ChevronRight size={12}/></div></div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="mt-4 pt-6 border-t border-white/5">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-6 flex items-center gap-2"><Star size={14}/> Top 4 Equipo Sugerido</h5>
                                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                                {msg.recommendedTalent.map((t, idx) => (
                                                    <div key={idx} className="flex flex-col items-center min-w-[140px] group text-center">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#7D68F6] transition-all mb-3 shadow-xl">
                                                            <img src={t.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="avatar"/>
                                                        </div>
                                                        {/* AJUSTE VISUAL: Nombres y roles más grandes y legibles */}
                                                        <span className="text-xs font-black uppercase tracking-tight truncate w-full">{t.Name}</span>
                                                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-3">{t.Role}</span>
                                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                                            {/* AJUSTE VISUAL: Chips más grandes en el chat */}
                                                            {t.skillsArray?.slice(0, 2).map((s, i) => <span key={i} className="text-[8px] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{s}</span>)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start"><div className="p-5 px-7 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl rounded-tl-none"><Loader2 className="animate-spin text-[#7D68F6]" size={20} /></div></motion.div>}
                    </div>
                </div>
                <div className="relative max-w-3xl mx-auto mb-32">
                    {/* AJUSTE VISUAL: Más padding derecho (pr-20) para que el texto no se monte en el botón */}
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad creativa..." className="w-full bg-white/5 border border-white/20 rounded-[2.5rem] py-6 pl-8 pr-20 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[80px] backdrop-blur-md resize-none shadow-xl" />
                    {/* AJUSTE VISUAL: Botón más pequeño y centrado */}
                    <button onClick={handleSend} className="absolute right-4 bottom-4 bg-[#7D68F6] p-4 rounded-full hover:scale-110 shadow-xl transition-all"><Send size={20}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-16 items-start pt-48 px-12 max-w-7xl mx-auto pb-40">
                <aside className="w-64 sticky top-48 space-y-10">
                    <div>
                        <h3 className="text-[#7D68F6] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Filter size={14}/> Filtrar Rol</h3>
                        <div className="flex flex-col gap-2">
                            {uniqueRoles.map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`text-left px-5 py-2.5 rounded-full text-[11px] font-bold uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-md' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{role}</button>))}
                        </div>
                    </div>
                </aside>
                <div className="flex-1">
                    <div className="mb-12"><h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Equipo Bogotá</h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalent.map((person, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group overflow-hidden">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-transparent group-hover:border-[#7D68F6] transition-all duration-500 shadow-xl">
                                    <img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="avatar"/>
                                </div>
                                <h4 className="text-xl font-black uppercase mb-1 tracking-tighter leading-none">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-bold uppercase mb-6 tracking-widest">{person.Role}</p>
                                <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                                    {/* AJUSTE VISUAL: Chips más grandes en la pestaña principal de equipo */}
                                    {person.skillsArray?.map((skill, idx) => (
                                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase text-white/40 group-hover:text-white transition-colors">{skill}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>{selectedProject && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80"><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#111] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[4rem] overflow-hidden relative flex flex-col shadow-2xl"><button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 z-10 p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={24}/></button><div className="h-2/3 overflow-hidden"><img src={selectedProject.images[0]} className="w-full h-full object-cover" alt="hero"/></div><div className="p-16 flex-1 overflow-y-auto"><p className="text-[#7D68F6] font-black uppercase tracking-[0.4em] text-xs mb-4">{selectedProject.Client}</p><h2 className="text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">{selectedProject.ProjectName}</h2><div className="text-white/60 leading-relaxed text-lg">{selectedProject.Description || 'Sin descripción disponible.'}</div></div></motion.div></motion.div>
      )}</AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100]"><button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl"><LogOut size={22}/></button></footer>
      <style>{`.mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%); } .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate><MainContent /></AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6 relative">
            <h1 className="text-[14vw] font-black italic text-white mb-2 tracking-tighter leading-none">MRM.</h1>
            <div className="flex flex-col text-[14px] font-black uppercase tracking-[1.6em] text-[#7D68F6] mt-2 ml-10 leading-[1.2] border-l-4 border-[#7D68F6] pl-6 mb-20 text-left"><span>Bogota</span><span>Creative</span><span>Credentials</span></div>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-110 transition-all">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}