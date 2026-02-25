import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Search, Mail, Users, Briefcase, MessageSquare, X, Loader2, Plus } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN DE CONEXIÓN ---
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
  const chatContainerRef = useRef(null);

  // Auto-scroll del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // --- CARGA DE DATOS DESDE ONEDRIVE ---
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

        // PROCESAR TALENTO (CORRECCIÓN DE CHIPS)
        const rawTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        const parsedTalent = rawTalent.map(person => {
            // Buscamos "Tags" sin importar mayúsculas o espacios extra en el Excel
            const tagKey = Object.keys(person).find(k => k.trim().toLowerCase() === "tags") || "Tags";
            const tagValue = person[tagKey] || "";
            return {
                ...person,
                skillsArray: tagValue.split(/[,;]/).map(s => s.trim()).filter(s => s !== "")
            };
        });

        // PROCESAR PROYECTOS
        const parsedProjects = Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data.map((p, index) => ({
          ...p,
          internalID: `ID_${index}`, 
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/800/600"],
          tagsArray: p.Tags ? p.Tags.split(',').map(t => t.trim()) : [],
          teamNames: p.Team ? p.Team.split(',').map(name => name.trim()) : [] // Vincular personas
        }));

        setTalentData(parsedTalent);
        setFlatProjects(parsedProjects);
        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Cerebro MRM activo. Hola ${accounts[0]?.name.split(' ')[0]}, ¿qué credenciales revisamos hoy?` }]);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, [instance, accounts]);

  // --- LÓGICA DE IA ---
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
            body: JSON.stringify({ prompt: userMsg, context: JSON.stringify(flatProjects.slice(0, 15)) })
        });
        const data = await response.json();
        const aiContent = data.content || data.text || "No hay respuesta.";
        let parsed;
        try { parsed = JSON.parse(aiContent.replace(/```json|```/g, '')); } 
        catch { parsed = { match_ids: [], reason: aiContent }; }
        
        setIsTyping(false);
        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: parsed.reason,
            results: flatProjects.filter(p => parsed.match_ids?.includes(p.internalID)) 
        }]);
    } catch { setIsTyping(false); }
  };

  const filteredProjects = useMemo(() => flatProjects.filter(p => 
    p.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.Client?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, flatProjects]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest animate-pulse">MRM BOGOTÁ CREDENTIALS...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      {/* HEADER: LOGO IZQUIERDA Y NAV DERECHA */}
      <header className="fixed top-0 left-0 w-full p-8 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.9em] text-[#7D68F6] mt-2 ml-1">Bogota creative credentials</p>
        </div>
        
        <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full pointer-events-auto shadow-2xl">
            {[
                {id: 'chat', label: 'Cerebro', icon: <MessageSquare size={14}/>},
                {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>},
                {id: 'team', label: 'Equipo', icon: <Users size={14}/>},
                {id: 'contact', label: 'Contacto', icon: <Mail size={14}/>}
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white shadow-xl' : 'hover:bg-white/10 text-white/40'}`}>
                    {tab.icon} {tab.label}
                </button>
            ))}
        </nav>
      </header>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="relative z-10 pt-44 pb-32 px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB: CHAT (CEREBRO) */}
          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                <div className="relative h-[500px] mb-10 group overflow-hidden">
                    {/* Efecto de disolución suave superior */}
                    <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent z-30 pointer-events-none" />
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-24 pb-10 flex flex-col gap-8 hide-scrollbar mask-fade-top">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-7 px-9 rounded-[3rem] text-[15px] leading-relaxed shadow-2xl border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                                {msg.results && (
                                    <div className="flex gap-5 mt-8 overflow-x-auto w-full pb-4 hide-scrollbar">
                                        {msg.results.map((p, idx) => (
                                            <motion.div key={idx} whileHover={{ y: -12, scale: 1.05, zIndex: 100 }} onClick={() => setSelectedProject(p)} className="min-w-[280px] bg-[#121212] border border-white/10 rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl">
                                                <img src={p.images[0]} className="w-full h-40 object-cover" alt="p"/>
                                                <div className="p-7">
                                                    <p className="text-[10px] font-black uppercase text-[#7D68F6] mb-2">{p.Client}</p>
                                                    <p className="text-[14px] font-black uppercase leading-tight truncate">{p.Title}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative max-w-3xl mx-auto">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Pide un brief estratégico..." className="w-full bg-white/5 border border-white/20 rounded-[2.8rem] py-8 px-12 outline-none focus:border-[#7D68F6] focus:bg-white/10 transition-all text-[15px] min-h-[100px] backdrop-blur-md resize-none shadow-xl" />
                    <button onClick={handleSend} className="absolute right-6 bottom-6 bg-[#7D68F6] p-6 rounded-full hover:scale-110 shadow-2xl transition-all"><Send size={24}/></button>
                </div>
            </motion.section>
          )}

          {/* TAB: EQUIPO (CHIPS CORREGIDOS) */}
          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                <div className="text-center mb-10">
                    <h2 className="text-8xl font-black italic uppercase tracking-tighter">Nuestro Talento</h2>
                    <p className="text-[#7D68F6] font-bold text-[11px] tracking-[0.7em] mt-4 uppercase">The creative mindset behind MRM</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {talentData.map((person, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.08, zIndex: 200 }} className="bg-white/5 border border-white/10 p-12 rounded-[5rem] text-center hover:border-[#7D68F6] transition-all group relative">
                            <img src={person.ImageURL} className="w-32 h-32 rounded-full mx-auto mb-8 object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-transparent group-hover:border-[#7D68F6] shadow-xl" alt="avatar"/>
                            <h4 className="text-2xl font-black uppercase mb-1 tracking-tighter">{person.Name}</h4>
                            <p className="text-[11px] text-[#7D68F6] font-bold uppercase mb-8 tracking-widest">{person.Role}</p>
                            
                            {/* --- CHIPS DE SKILLS (TAGS) --- */}
                            <div className="flex flex-wrap gap-2 justify-center mt-6 min-h-[40px]">
                                {person.skillsArray?.map((skill, idx) => (
                                    <span key={idx} className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white/50 group-hover:text-white group-hover:bg-[#7D68F6]/30 transition-all">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
          )}

          {/* TAB: PROYECTOS (FILTRO Y GRID COMPLETO) */}
          {activeTab === 'projects' && (
            <motion.section key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                <div className="flex justify-between items-end border-b border-white/10 pb-12">
                    <div>
                        <h2 className="text-7xl font-black italic uppercase tracking-tighter">Proyectos</h2>
                        <p className="text-[#7D68F6] font-bold text-[11px] tracking-[0.7em] mt-4 uppercase">Creative Credentials</p>
                    </div>
                    <div className="relative w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                        <input type="text" placeholder="Buscar cliente o proyecto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:border-[#7D68F6] transition-all" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {filteredProjects.map((p, i) => (
                        <motion.div key={i} whileHover={{ y: -15, zIndex: 150 }} onClick={() => setSelectedProject(p)} className="bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all relative">
                            <div className="h-64 overflow-hidden"><img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="p"/></div>
                            <div className="p-12">
                                <p className="text-[#7D68F6] text-[11px] font-black uppercase mb-3 tracking-widest">{p.Client}</p>
                                <h4 className="text-3xl font-black uppercase leading-none mb-8 tracking-tighter">{p.Title}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {p.tagsArray.slice(0,3).map((t, idx) => <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full font-bold uppercase">{t}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
          )}

          {/* TAB: CONTACTO */}
          {activeTab === 'contact' && (
            <motion.section key="contact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-20 rounded-[5rem] backdrop-blur-3xl mt-12 text-center">
                <h2 className="text-6xl font-black uppercase italic mb-4">Hablemos</h2>
                <p className="text-white/40 mb-12">Envía tu brief y armamos el equipo ideal.</p>
                <div className="space-y-6">
                    <input className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 outline-none focus:border-[#7D68F6]" placeholder="Nombre completo" />
                    <input className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 outline-none focus:border-[#7D68F6]" placeholder="Email corporativo" />
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-10 outline-none focus:border-[#7D68F6] min-h-[180px]" placeholder="Tu reto creativo..."></textarea>
                    <button className="w-full bg-[#7D68F6] py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-xl">Enviar Brief</button>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL GLOBAL (CON PERSONAS VINCULADAS) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-xl flex items-center justify-center p-8" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0A0A0A] border border-white/10 max-w-7xl w-full rounded-[5rem] overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center p-12 overflow-hidden">
                  <img src={selectedProject.images[0]} className="max-h-full max-w-full object-contain rounded-[2rem] shadow-2xl" alt="main" />
               </div>
               <div className="w-full md:w-[500px] p-20 overflow-y-auto bg-[#0F0F0F] border-l border-white/10 flex flex-col">
                  <p className="text-[#7D68F6] font-black text-[10px] mb-4 uppercase tracking-[0.5em]">{selectedProject.Client}</p>
                  <h3 className="text-6xl font-black uppercase italic mb-10 leading-none tracking-tighter">{selectedProject.Title}</h3>
                  
                  <div className="space-y-12 flex-1">
                    <div>
                        <h5 className="text-[10px] font-black uppercase text-white/20 mb-5">Descripción</h5>
                        <p className="text-[17px] text-white/70 leading-relaxed font-light">{selectedProject.Description}</p>
                    </div>

                    {/* VINCULACIÓN DE TALENTO AL PROYECTO */}
                    {selectedProject.teamNames.length > 0 && (
                        <div>
                            <h5 className="text-[10px] font-black uppercase text-white/20 mb-5">Talento Asignado</h5>
                            <div className="flex -space-x-4">
                                {talentData.filter(t => selectedProject.teamNames.includes(t.Name)).map((m, i) => (
                                    <img key={i} src={m.ImageURL} className="w-14 h-14 rounded-full border-4 border-[#0F0F0F] object-cover hover:scale-125 hover:z-50 transition-all cursor-pointer" title={m.Name} alt="team"/>
                                ))}
                                <button className="w-14 h-14 rounded-full bg-[#7D68F6]/20 border border-[#7D68F6]/30 flex items-center justify-center text-[#7D68F6] hover:bg-[#7D68F6] hover:text-white transition-all"><Plus size={18}/></button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {selectedProject.tagsArray?.map((t, i) => <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-5 py-2.5 rounded-full font-bold uppercase">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="mt-16 w-full p-6 bg-white/5 border border-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase text-[11px] font-black tracking-widest">Cerrar</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100]"><button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl"><LogOut size={22}/></button></footer>

      <style>{`
        .mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 20%); }
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
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-[14vw] font-black italic text-white mb-2 tracking-tighter leading-none">MRM.</h1>
            <p className="text-[#7D68F6] font-bold tracking-[1.6em] uppercase text-[14px] mb-20 ml-8">Bogota creative credentials</p>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-110 transition-all">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}