import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, X, Loader2, LogOut, LogIn, Search, Mail, Users, Briefcase, MessageSquare } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN (MANTENIDA) ---
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

        const parsedTalent = Papa.parse(talentCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data;
        const parsedProjects = Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data.map((p, index) => ({
          ...p,
          internalID: `ID_${index}`, 
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/800/600"],
          tagsArray: p.Tags ? p.Tags.split(',').map(t => t.trim()) : []
        }));

        setTalentData(parsedTalent);
        setFlatProjects(parsedProjects);
        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Hola ${accounts[0]?.name.split(' ')[0]}, soy el Cerebro MRM. ¿En qué brief trabajamos hoy?` }]);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
        const projectsContext = flatProjects.slice(0, 15).map(p => ({
            id: p.internalID, title: p.Title, client: p.Client, description: p.Description
        }));

        const response = await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userMsg, context: JSON.stringify(projectsContext) })
        });

        const data = await response.json();
        const aiContent = data.content || data.text || (typeof data === 'string' ? data : "Error");

        let parsedResponse;
        try {
            const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResponse = JSON.parse(cleanJson);
        } catch (e) {
            parsedResponse = { match_ids: [], reason: aiContent };
        }

        const foundProjects = flatProjects.filter(p => parsedResponse.match_ids?.includes(p.internalID));

        setIsTyping(false);
        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: parsedResponse.reason,
            results: foundProjects 
        }]);
    } catch (error) {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { type: 'ai', text: "Error de conexión." }]);
    }
  };

  const filteredProjects = useMemo(() => {
    return flatProjects.filter(p => 
      p.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.Client?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, flatProjects]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest animate-pulse uppercase">MRM BOGOTÁ LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      {/* HEADER DINÁMICO */}
      <header className="fixed top-0 left-0 w-full p-8 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.8em] text-[#7D68F6] mt-1 ml-1">Bogota creative credentials</p>
        </div>
        
        <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full pointer-events-auto shadow-2xl">
            {[
                {id: 'chat', label: 'Cerebro', icon: <MessageSquare size={14}/>},
                {id: 'projects', label: 'Proyectos', icon: <Briefcase size={14}/>},
                {id: 'team', label: 'Equipo', icon: <Users size={14}/>},
                {id: 'contact', label: 'Contacto', icon: <Mail size={14}/>}
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white' : 'hover:bg-white/10 text-white/50'}`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </nav>
      </header>

      <main className="relative z-10 pt-40 pb-20 px-12 max-w-7xl mx-auto">
        
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                <div className="relative h-[550px] mb-8 group">
                    <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent z-30 pointer-events-none" />
                    
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-20 pb-10 flex flex-col gap-8 hide-scrollbar mask-fade-top">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-6 px-8 rounded-[2.5rem] text-[14px] leading-relaxed shadow-2xl border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                                {msg.results && (
                                    <div className="flex gap-4 mt-6 overflow-x-auto w-full pb-4 hide-scrollbar">
                                        {msg.results.map((p, idx) => (
                                            <motion.div 
                                                key={idx} 
                                                whileHover={{ y: -10, scale: 1.02, zIndex: 50 }} 
                                                onClick={() => setSelectedProject(p)}
                                                className="min-w-[240px] bg-[#151515] border border-white/10 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl"
                                            >
                                                <img src={p.images[0]} className="w-full h-32 object-cover" alt="p"/>
                                                <div className="p-5">
                                                    <p className="text-[10px] font-black uppercase text-[#7D68F6] mb-1">{p.Client}</p>
                                                    <p className="text-[12px] font-black uppercase truncate">{p.Title}</p>
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
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Describe el reto creativo..." 
                        className="w-full bg-white/5 border border-white/20 rounded-[2.5rem] py-6 px-10 outline-none focus:border-[#7D68F6] focus:bg-white/10 transition-all text-[14px] min-h-[90px] backdrop-blur-md resize-none" 
                    />
                    <button onClick={handleSend} className="absolute right-4 bottom-4 bg-[#7D68F6] p-5 rounded-full shadow-lg">
                        <Send size={22}/>
                    </button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="flex justify-between items-end border-b border-white/10 pb-10">
                    <div>
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Proyectos</h2>
                        <p className="text-[#7D68F6] font-bold text-[10px] tracking-[0.5em] mt-2 uppercase">Credenciales Estratégicas</p>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente o proyecto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm outline-none focus:border-[#7D68F6] transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredProjects.map((p, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ y: -10, zIndex: 50 }} 
                            onClick={() => setSelectedProject(p)}
                            className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all relative"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="p"/>
                            </div>
                            <div className="p-8">
                                <p className="text-[#7D68F6] text-[10px] font-black uppercase mb-2">{p.Client}</p>
                                <h4 className="text-xl font-black uppercase leading-tight mb-4">{p.Title}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {p.tagsArray.slice(0,3).map((t, idx) => (
                                        <span key={idx} className="text-[8px] bg-white/10 border border-white/10 px-3 py-1.5 rounded-full font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="text-center mb-20">
                    <h2 className="text-7xl font-black italic uppercase tracking-tighter">Nuestro Talento</h2>
                    <p className="text-[#7D68F6] font-bold text-[10px] tracking-[0.5em] mt-2 uppercase">Creative Mindset</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {talentData.map((person, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ scale: 1.05, zIndex: 50 }} 
                            className="bg-white/5 border border-white/10 p-10 rounded-[4rem] text-center hover:border-[#7D68F6] transition-all group relative"
                        >
                            <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-transparent group-hover:border-[#7D68F6]" alt="avatar"/>
                            <h4 className="text-lg font-black uppercase mb-1">{person.Name}</h4>
                            <p className="text-[10px] text-[#7D68F6] font-bold uppercase mb-6 tracking-widest">{person.Role}</p>
                            
                            {/* --- CHIPS DE SKILLS (CORREGIDOS) --- */}
                            <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                                {person.Skills?.split(',').map((s, idx) => (
                                    <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[7px] font-black uppercase text-white/40 group-hover:text-white group-hover:border-[#7D68F6]/50 transition-all">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
          )}

          {activeTab === 'contact' && (
            <motion.section key="contact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-16 rounded-[4rem] backdrop-blur-xl mt-10">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Hablemos</h2>
                    <p className="text-white/40 text-sm">¿Listos para transformar tu marca?</p>
                </div>
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-6">
                        <input type="text" className="bg-white/5 border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#7D68F6]" placeholder="Nombre" />
                        <input type="email" className="bg-white/5 border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#7D68F6]" placeholder="Email" />
                    </div>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 outline-none focus:border-[#7D68F6] min-h-[150px]" placeholder="Mensaje..."></textarea>
                    <button className="w-full bg-[#7D68F6] py-5 rounded-full font-black uppercase text-xs tracking-[0.2em]">Enviar</button>
                </form>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* MODAL (GLOBAL) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0A0A0A] border border-white/10 max-w-6xl w-full rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-[85vh]" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
                  <img src={selectedProject.images[0]} className="max-h-full max-w-full object-contain rounded-[2rem]" alt="main" />
               </div>
               <div className="w-full md:w-[450px] p-16 overflow-y-auto bg-[#0F0F0F] border-l border-white/10 flex flex-col">
                  <p className="text-[#7D68F6] font-black text-xs mb-4 uppercase tracking-widest">{selectedProject.Client}</p>
                  <h3 className="text-5xl font-black uppercase italic mb-8 leading-none tracking-tighter">{selectedProject.Title}</h3>
                  <div className="space-y-10">
                    <p className="text-[16px] text-white/80 leading-relaxed">{selectedProject.Description}</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedProject.tagsArray?.map((t, i) => <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-4 py-2 rounded-full font-bold uppercase">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="mt-auto p-4 bg-white/5 border border-white/10 rounded-full hover:bg-red-500 transition-all uppercase text-[10px] font-black">Cerrar</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-8 right-8 z-[100]">
          <button onClick={() => instance.logoutRedirect()} className="p-4 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all"><LogOut size={18}/></button>
      </footer>

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
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-[12vw] font-black italic text-white mb-2 tracking-tighter leading-none">MRM.</h1>
            <p className="text-[#7D68F6] font-bold tracking-[1.5em] uppercase text-[12px] mb-16 ml-6">Bogota creative credentials</p>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-16 py-7 rounded-full font-black text-xs uppercase tracking-widest">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}