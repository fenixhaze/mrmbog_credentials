import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Search, Mail, Users, Briefcase, MessageSquare, X, Loader2, Plus, Filter } from 'lucide-react';
import Papa from 'papaparse';

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
  const [activeTab, setActiveTab] = useState('chat'); 
  const [talentData, setTalentData] = useState([]); 
  const [flatProjects, setFlatProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Estados de Filtro para Talento
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
        const projectsCSV = await pRes.text();

        const rawTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        const parsedTalent = rawTalent.map(person => ({
            ...person,
            skillsArray: (person.Tags || person.tags || "").split(/[,;]/).map(s => s.trim()).filter(s => s !== "")
        }));

        setTalentData(parsedTalent);
        setFlatProjects(Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data.map((p, index) => ({
          ...p,
          internalID: `ID_${index}`, 
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/800/600"],
          tagsArray: p.Tags ? p.Tags.split(',').map(t => t.trim()) : [],
          teamNames: p.Team ? p.Team.split(',').map(name => name.trim()) : []
        })));
        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Cerebro MRM activo. Hola ${accounts[0]?.name.split(' ')[0]}, ¿qué brief revisamos hoy?` }]);
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
        const response = await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userMsg, context: JSON.stringify(flatProjects.slice(0, 12)) })
        });
        const data = await response.json();
        const aiContent = data.content || data.text || "No hay respuesta.";
        let parsed;
        try { parsed = JSON.parse(aiContent.replace(/```json|```/g, '')); } 
        catch { parsed = { match_ids: [], reason: aiContent }; }
        setChatHistory(prev => [...prev, { type: 'ai', text: parsed.reason, results: flatProjects.filter(p => parsed.match_ids?.includes(p.internalID)) }]);
    } catch { setChatHistory(prev => [...prev, { type: 'ai', text: "Error de conexión." }]); }
    finally { setIsTyping(false); }
  };

  // --- LÓGICA DE FILTRADO ---
  const filteredProjects = useMemo(() => flatProjects.filter(p => p.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.Client?.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, flatProjects]);

  const filteredTalent = useMemo(() => {
    return talentData.filter(p => {
        const matchesRole = filterRole === 'All' || p.Role === filterRole;
        const matchesSkill = filterSkill === 'All' || p.skillsArray.includes(filterSkill);
        return matchesRole && matchesSkill;
    });
  }, [talentData, filterRole, filterSkill]);

  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);
  const uniqueSkills = useMemo(() => ['All', ...new Set(talentData.flatMap(t => t.skillsArray))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest animate-pulse">MRM BOGOTÁ</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      {/* HEADER: LOGO VERTICAL Y NAV */}
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-start">
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
            <div className="flex flex-col text-[9px] font-black uppercase tracking-[0.3em] text-[#7D68F6] mt-2 ml-1 leading-tight border-l border-[#7D68F6]/30 pl-3">
                <span>Bogota</span>
                <span>Creative</span>
                <span>Credentials</span>
            </div>
        </div>
        
        <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full pointer-events-auto shadow-2xl">
            {[
                {id: 'chat', label: 'Cerebro', icon: <MessageSquare size={14}/>},
                {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>},
                {id: 'team', label: 'Talento', icon: <Users size={14}/>},
                {id: 'contact', label: 'Contacto', icon: <Mail size={14}/>}
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white shadow-xl' : 'hover:bg-white/10 text-white/40'}`}>
                    {tab.icon} {tab.label}
                </button>
            ))}
        </nav>
      </header>

      <main className="relative z-10 pt-48 pb-32 px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                <div className="relative h-[500px] mb-10 overflow-hidden rounded-[3rem]">
                    {/* El difuso ahora es puramente visual mediante máscara, sin barra negra */}
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-24 pb-12 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-7 px-9 rounded-[3rem] text-[15px] leading-relaxed shadow-2xl border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none shadow-[#7D68F6]/20' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none'}`}>{msg.text}</div>
                                {msg.results && (
                                    <div className="flex gap-4 mt-8 overflow-x-auto w-full pb-4 hide-scrollbar">
                                        {msg.results.map((p, idx) => (
                                            <motion.div key={idx} whileHover={{ y: -10, scale: 1.05, zIndex: 100 }} onClick={() => setSelectedProject(p)} className="min-w-[260px] bg-[#121212] border border-white/10 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl">
                                                <img src={p.images[0]} className="w-full h-36 object-cover" alt="p"/>
                                                <div className="p-6"><p className="text-[10px] font-black uppercase text-[#7D68F6] mb-1">{p.Client}</p><p className="text-[13px] font-black uppercase truncate">{p.Title}</p></div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative max-w-3xl mx-auto">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Pide unas credenciales..." className="w-full bg-white/5 border border-white/20 rounded-[2.5rem] py-7 px-10 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[100px] backdrop-blur-md resize-none shadow-xl" />
                    <button onClick={handleSend} className="absolute right-5 bottom-5 bg-[#7D68F6] p-5 rounded-full hover:scale-110 transition-all shadow-xl"><Send size={24}/></button>
                </div>
            </motion.section>
          )}

          {/* TALENTO TAB CON SIDEBAR */}
          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-16 items-start">
                {/* SIDEBAR FILTERS */}
                <aside className="w-64 sticky top-48 space-y-12">
                    <div>
                        <h3 className="text-[#7D68F6] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Filter size={14}/> Filtrar Rol</h3>
                        <div className="flex flex-col gap-2">
                            {uniqueRoles.map(role => (
                                <button key={role} onClick={() => setFilterRole(role)} className={`text-left px-4 py-2 rounded-full text-[11px] font-bold uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[#7D68F6] text-[10px] font-black uppercase tracking-[0.3em] mb-6">Filtrar Skill</h3>
                        <div className="flex flex-wrap gap-2">
                            {uniqueSkills.slice(0, 15).map(skill => (
                                <button key={skill} onClick={() => setFilterSkill(skill)} className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase border transition-all ${filterSkill === skill ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* GRID DE TALENTO REDUCIDO */}
                <div className="flex-1">
                    <div className="mb-12">
                        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Equipo Bogotá</h2>
                        <p className="text-[#7D68F6] font-bold text-[11px] tracking-[0.6em] mt-3 uppercase">Creative Mindset ({filteredTalent.length})</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTalent.map((person, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.05, zIndex: 150 }} className="bg-white/5 border border-white/10 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group relative overflow-hidden">
                                <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-transparent group-hover:border-[#7D68F6]" alt="avatar"/>
                                <h4 className="text-xl font-black uppercase mb-1 tracking-tighter leading-none">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-bold uppercase mb-6 tracking-widest">{person.Role}</p>
                                <div className="flex flex-wrap gap-1.5 justify-center min-h-[30px]">
                                    {person.skillsArray?.map((skill, idx) => (
                                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[7px] font-black uppercase text-white/40 group-hover:text-white transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}

          {/* PROYECTOS TAB */}
          {activeTab === 'projects' && (
             <motion.section key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                <div className="flex justify-between items-end border-b border-white/10 pb-12">
                    <div><h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Proyectos</h2><p className="text-[#7D68F6] font-bold text-[11px] tracking-[0.6em] mt-3 uppercase">Full Creative Portfolio</p></div>
                    <div className="relative w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                        <input type="text" placeholder="Buscar por cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:border-[#7D68F6] transition-all shadow-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {filteredProjects.map((p, i) => (
                        <motion.div key={i} whileHover={{ y: -15, zIndex: 50 }} onClick={() => setSelectedProject(p)} className="bg-white/5 border border-white/10 rounded-[3.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all">
                            <div className="h-56 overflow-hidden"><img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="p"/></div>
                            <div className="p-10"><p className="text-[#7D68F6] text-[11px] font-black uppercase mb-3">{p.Client}</p><h4 className="text-2xl font-black uppercase leading-tight mb-6">{p.Title}</h4><div className="flex flex-wrap gap-2">{p.tagsArray.slice(0,3).map((t, idx) => <span key={idx} className="text-[9px] bg-white/5 border border-white/10 px-4 py-2 rounded-full font-bold uppercase">{t}</span>)}</div></div>
                        </motion.div>
                    ))}
                </div>
             </motion.section>
          )}

          {/* CONTACTO TAB */}
          {activeTab === 'contact' && (
            <motion.section key="contact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-20 rounded-[5rem] backdrop-blur-2xl mt-12 text-center shadow-2xl">
                <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Hablemos</h2>
                <p className="text-white/40 mb-12 uppercase tracking-widest text-[10px] font-bold">New Business & Strategy</p>
                <div className="space-y-6"><input className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 outline-none focus:border-[#7D68F6] transition-all" placeholder="Nombre"/><input className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 outline-none focus:border-[#7D68F6] transition-all" placeholder="Email"/><textarea className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-10 outline-none focus:border-[#7D68F6] transition-all min-h-[180px]" placeholder="Breve descripción del reto"></textarea><button className="w-full bg-[#7D68F6] py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all">Enviar a MRM</button></div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL GLOBAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-lg flex items-center justify-center p-8" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0A0A0A] border border-white/10 max-w-7xl w-full rounded-[4.5rem] overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center p-12 overflow-hidden"><img src={selectedProject.images[0]} className="max-h-full max-w-full object-contain rounded-[2rem] shadow-2xl" alt="main" /></div>
               <div className="w-full md:w-[500px] p-20 overflow-y-auto bg-[#0F0F0F] border-l border-white/10 flex flex-col shadow-inner">
                  <p className="text-[#7D68F6] font-black text-xs mb-4 uppercase tracking-[0.4em]">{selectedProject.Client}</p>
                  <h3 className="text-6xl font-black uppercase italic mb-10 leading-none tracking-tighter">{selectedProject.Title}</h3>
                  <div className="space-y-12 flex-1">
                    <p className="text-[17px] text-white/70 leading-relaxed font-light">{selectedProject.Description}</p>
                    {selectedProject.teamNames?.length > 0 && (
                        <div className="flex -space-x-3">
                            {talentData.filter(t => selectedProject.teamNames.includes(t.Name)).map((m, i) => (
                                <img key={i} src={m.ImageURL} className="w-12 h-12 rounded-full border-4 border-[#0F0F0F] object-cover" title={m.Name} alt="team"/>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">{selectedProject.tagsArray?.map((t, i) => <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-5 py-2.5 rounded-full font-bold uppercase">{t}</span>)}</div>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="mt-16 w-full p-5 bg-white/5 border border-white/10 rounded-full hover:bg-red-500 transition-all uppercase text-[11px] font-black">Cerrar</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100]"><button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl backdrop-blur-md"><LogOut size={20}/></button></footer>

      <style>{`
        .mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 15%); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate><MainContent /></AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6 text-white">
            <h1 className="text-[14vw] font-black italic mb-2 tracking-tighter leading-none">MRM.</h1>
            <p className="text-[#7D68F6] font-bold tracking-[1.6em] uppercase text-[14px] mb-20 ml-8">Bogota creative credentials</p>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_60px_rgba(125,104,246,0.3)] hover:scale-110 transition-all">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}