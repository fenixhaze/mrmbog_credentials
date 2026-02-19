import React, { useState, useRef, useEffect } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, X, Tag, Users, Briefcase, Plus, Loader2, LogOut, LogIn } from 'lucide-react';
import Papa from 'papaparse';

// CONFIGURACIÓN DE AUTH
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
  const [skillsData, setSkillsData] = useState([]);
  const [talentData, setTalentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  
  const chatContainerRef = useRef(null);

  // Auto-scroll solo cuando llega un mensaje nuevo, pero permite scroll manual
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
        const parsedProjects = Papa.parse(projectsCSV, { header: true, skipEmptyLines: true, delimiter: ";" }).data.map(p => ({
          ...p,
          images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/800/600"],
          tagsArray: p.Tags ? p.Tags.split(',').map(t => t.trim()) : []
        }));

        const cats = ["UX/UI", "MOTION GRAPHICS", "VIDEO PRODUCTION", "BANNER ADS", "SOCIAL MEDIA & DOOH", "CREATIVE DATA", "CRM & EMAIL DESIGN", "PRESENTATION DESIGN", "AI PRODUCTION"];
        const structured = cats.map(name => ({
          name,
          projects: parsedProjects.filter(p => p.Category?.toUpperCase() === name)
        }));

        setTalentData(parsedTalent);
        setSkillsData(structured);
        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Analizador de Briefs activo. Hola ${accounts[0].name.split(' ')[0]}, pega aquí el requerimiento y buscaré los perfiles y proyectos ideales.` }]);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setHasSearched(true);

    setTimeout(() => {
      // LÓGICA DE BÚSQUEDA POR PALABRAS CLAVE (PARA BRIEFS LARGOS)
      const keywords = userMsg.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const allProjects = skillsData.flatMap(c => c.projects);
      
      const found = allProjects.filter(p => {
        const textToSearch = `${p.Title} ${p.Tags} ${p.Description} ${p.Category}`.toLowerCase();
        return keywords.some(word => textToSearch.includes(word));
      }).sort((a, b) => {
        // Ordenar por relevancia (cuántas palabras clave coinciden)
        const aMatches = keywords.filter(w => `${a.Title} ${a.Tags}`.toLowerCase().includes(w)).length;
        const bMatches = keywords.filter(w => `${b.Title} ${b.Tags}`.toLowerCase().includes(w)).length;
        return bMatches - aMatches;
      }).slice(0, 5);

      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: found.length > 0 ? "He analizado el brief. Estos son los casos de éxito y perfiles que mejor se alinean a la necesidad:" : "He analizado el texto pero no encontré coincidencias exactas. Prueba con otras palabras clave o explora las capacidades abajo.",
        results: found 
      }]);
    }, 1200);
  };

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest">SINCRONIZANDO CON GRAPH...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center relative font-sans overflow-x-hidden">
      <div className="fixed inset-0 bg-[#0A0A0A] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,#1a0b3d_0%,transparent_70%)] z-0" />

      <header className="w-full pt-16 z-10 text-center relative">
        <h1 className="text-[100px] font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
        <p className="text-[11px] font-bold uppercase tracking-[1.1em] text-[#7D68F6] mt-2">Bogota creative credentials</p>
      </header>

      {/* CHAT INTERFACE */}
      <section className="w-full max-w-3xl z-20 mt-12 px-6 relative">
        <div className="h-[350px] relative mb-6">
          {/* Disolución sutil - Solo arriba */}
          <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-[#0A0A0A] to-transparent z-30 pointer-events-none" />
          
          <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col gap-6 p-4 hide-scrollbar relative z-20 scroll-smooth">
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-5 px-7 rounded-[2.5rem] text-[13px] border leading-relaxed shadow-2xl ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none'}`}>
                  {msg.text}
                </div>
                {msg.results && (
                  <div className="flex gap-4 mt-4 overflow-x-auto w-full pb-4 hide-scrollbar">
                    {msg.results.map((p, idx) => (
                      <motion.div whileHover={{ y: -5 }} key={idx} onClick={() => setSelectedProject(p)} className="min-w-[180px] bg-white/5 border border-white/10 p-3 rounded-[2rem] hover:border-[#7D68F6] transition-all cursor-pointer shadow-lg">
                        <img src={p.images[0]} className="w-full h-24 object-cover rounded-[1.5rem] mb-3" alt="project"/>
                        <p className="text-[10px] font-black uppercase truncate px-2">{p.Title}</p>
                        <p className="text-[8px] text-[#7D68F6] font-bold uppercase px-2 mt-1">{p.Category}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && (
                <div className="flex items-center gap-2 text-[#7D68F6] text-[10px] font-bold uppercase tracking-widest ml-6 animate-pulse">
                    <Loader2 size={14} className="animate-spin" /> Procesando Brief...
                </div>
            )}
          </div>
        </div>

        {/* INPUT DE TEXTO / BRIEF */}
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="PEGA AQUÍ EL BRIEF O BUSCA POR CAPABILITY..." 
            className="w-full bg-white/5 border border-white/20 rounded-[2rem] py-5 px-10 outline-none focus:border-[#7D68F6] transition-all text-[12px] tracking-wide min-h-[80px] max-h-[200px] backdrop-blur-md resize-none" 
          />
          <button onClick={handleSend} className="absolute right-4 bottom-4 bg-[#7D68F6] p-4 rounded-full hover:scale-110 transition-all shadow-lg">
            <Send size={20}/>
          </button>
        </div>
      </section>

      {/* EXPLORER SECTION */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mt-24 z-10 px-6 pb-40">
            <div className="flex items-center justify-between mb-16 px-10">
              <button onClick={() => setCurrentIndex(p => (p - 1 + skillsData.length) % skillsData.length)} className="p-5 border border-white/10 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronLeft/></button>
              <div className="text-center">
                <h2 className="text-7xl font-black italic uppercase tracking-tighter">{skillsData[currentIndex]?.name}</h2>
                <p className="text-[#7D68F6] font-bold text-[10px] tracking-[0.5em] mt-2 uppercase">Capabilities Hub</p>
              </div>
              <button onClick={() => setCurrentIndex(p => (p + 1) % skillsData.length)} className="p-5 border border-white/10 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronRight/></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 px-4">
              {talentData.map((person, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }} 
                  onClick={() => setSelectedPerson(person)}
                  className="group relative bg-white/5 border border-white/10 p-10 rounded-[3.5rem] text-center cursor-pointer hover:border-[#7D68F6] transition-all"
                >
                  <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-transparent group-hover:border-[#7D68F6] grayscale group-hover:grayscale-0 transition-all" alt="avatar"/>
                  <h4 className="text-[15px] font-black uppercase mb-1">{person.Name}</h4>
                  <p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-tighter mb-4">{person.Role}</p>
                  
                  {/* Skill Badges en Hover */}
                  <div className="flex flex-wrap gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {person.Skills?.split(',').slice(0,3).map((s, idx) => (
                      <span key={idx} className="bg-white/10 px-2 py-1 rounded-full text-[7px] font-bold uppercase border border-white/5">{s.trim()}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SQUAD WIDGET */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="fixed bottom-10 left-10 z-[500] bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-[3rem] flex items-center gap-5 shadow-2xl">
            <div className="flex -space-x-4">
              {myTeam.map((m, i) => <img key={i} src={m.ImageURL} className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] object-cover" alt="team"/>)}
            </div>
            <button className="bg-[#7D68F6] text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-widest hover:scale-105 transition-all">My Brief Squad ({myTeam.length})</button>
            <X size={20} onClick={() => setMyTeam([])} className="cursor-pointer text-white/20 hover:text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0A0A0A] border border-white/10 max-w-6xl w-full rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center p-8">
                  <img src={selectedProject.images[0]} className="max-h-full max-w-full object-contain rounded-[2rem]" alt="main" />
               </div>
               <div className="w-full md:w-[450px] p-16 overflow-y-auto bg-[#0F0F0F] border-l border-white/10">
                  <h3 className="text-5xl font-black uppercase italic mb-6 leading-none tracking-tighter">{selectedProject.Title}</h3>
                  <p className="text-[#7D68F6] font-black text-xs mb-10 uppercase tracking-widest border-b border-[#7D68F6]/30 pb-4">{selectedProject.Category}</p>
                  <div className="space-y-10">
                    <div>
                      <h5 className="text-[10px] font-black uppercase text-white/30 mb-4 tracking-[0.2em]">Contexto</h5>
                      <p className="text-[15px] text-white/80 leading-relaxed font-light">{selectedProject.Description}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black uppercase text-white/30 mb-4 tracking-[0.2em]">Tags Aplicados</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tagsArray?.map((t, i) => <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-4 py-2 rounded-full font-bold uppercase">{t}</span>)}
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}

        {selectedPerson && (
          <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedPerson(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0F0F0F] border border-white/10 max-w-2xl w-full rounded-[5rem] p-20 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <img src={selectedPerson.ImageURL} className="w-48 h-48 rounded-full mx-auto mb-10 object-cover border-4 border-[#7D68F6] shadow-[0_0_50px_rgba(125,104,246,0.3)]" alt="talent"/>
              <h3 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">{selectedPerson.Name}</h3>
              <p className="text-[#7D68F6] font-bold tracking-[0.5em] uppercase text-xs mb-12">{selectedPerson.Role}</p>
              
              <div className="grid grid-cols-2 gap-10 text-left mb-16 border-y border-white/10 py-10">
                <div>
                  <h5 className="text-[9px] font-black text-white/30 uppercase mb-6 tracking-widest">Capacidades</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.Skills?.split(',').map((s, i) => <span key={i} className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-bold uppercase">{s.trim()}</span>)}
                  </div>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-white/30 uppercase mb-6 tracking-widest">Software</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.Software?.split(',').map((s, i) => <span key={i} className="bg-[#7D68F6]/10 text-[#7D68F6] px-4 py-2 rounded-full text-[10px] font-bold uppercase border border-[#7D68F6]/20">{s.trim()}</span>)}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { if(!myTeam.find(p => p.ID === selectedPerson.ID)) setMyTeam([...myTeam, selectedPerson]); setSelectedPerson(null); }}
                className="w-full bg-[#7D68F6] py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Plus size={18}/> Armar Equipo de Trabajo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => instance.logoutRedirect()} className="fixed top-8 right-8 z-[50] p-4 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all"><LogOut size={20}/></button>
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate><MainContent /></AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center">
            <h1 className="text-9xl font-black italic text-white mb-2 tracking-tighter">MRM.</h1>
            <p className="text-[#7D68F6] font-bold tracking-[1.2em] uppercase text-[11px] mb-12 ml-4">Bogota creative credentials</p>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-12 py-6 rounded-full font-black text-xs hover:scale-110 transition-all shadow-2xl flex items-center gap-4 border border-white/10"><LogIn size={20}/> ACCESO CORPORATIVO</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}