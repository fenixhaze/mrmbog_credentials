import React, { useState, useRef, useEffect } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, X, Tag, Users, Briefcase, Plus, Loader2, LogOut, LogIn } from 'lucide-react';
import Papa from 'papaparse';

// CONFIGURACIÓN DE AUTH (Corregida según tu captura de Azure)
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
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [myTeam, setMyTeam] = useState([]);
  
  const chatContainerRef = useRef(null);

  // Solución al problema de visibilidad: Auto-scroll corregido
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenRes = await instance.acquireTokenSilent({
          scopes: ["Files.Read", "User.Read"],
          account: accounts[0]
        });
        const headers = { 'Authorization': `Bearer ${tokenRes.accessToken}` };
        
        // IDs de tus archivos (Asegúrate que sean correctos)
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
        setChatHistory([{ type: 'ai', text: `Conexión establecida. Hola ${accounts[0].name.split(' ')[0]}, ¿qué perfil buscas?` }]);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setHasSearched(true);

    // Lógica de respuesta directa (Sin fuzzy, busca coincidencia en base de datos)
    setTimeout(() => {
      const found = skillsData.flatMap(c => c.projects).filter(p => 
        p.Title.toLowerCase().includes(userMsg.toLowerCase()) || 
        p.Tags?.toLowerCase().includes(userMsg.toLowerCase())
      ).slice(0, 3);

      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: found.length > 0 ? "He encontrado estos proyectos para ti:" : "No encontré coincidencias, pero puedes explorar las categorías.",
        results: found 
      }]);
    }, 600);
  };

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black tracking-widest uppercase">Cargando Credenciales...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center relative font-sans overflow-x-hidden">
      {/* FONDO CORREGIDO (Sin barra negra) */}
      <div className="fixed inset-0 bg-[#0A0A0A] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,#1a0b3d_0%,transparent_60%)] z-0" />

      <header className="w-full pt-16 z-10 text-center relative">
        <h1 className="text-[100px] font-black uppercase italic tracking-tighter leading-none m-0">MRM</h1>
        <p className="text-[11px] font-bold uppercase tracking-[1.1em] text-[#7D68F6] mt-2 opacity-80">Bogota creative credentials</p>
      </header>

      {/* CHAT BOX CORREGIDO */}
      <section className="w-full max-w-2xl z-20 mt-12 px-6 relative">
        <div className="h-[250px] overflow-hidden relative mb-6">
          {/* Disolución superior funcional */}
          <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-[#0A0A0A] to-transparent z-30 pointer-events-none" />
          
          <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col gap-4 p-4 hide-scrollbar relative z-20">
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 px-6 rounded-[2rem] text-sm border shadow-xl ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-xl rounded-tl-none text-white'}`}>
                  {msg.text}
                </div>
                {msg.results && (
                  <div className="flex gap-3 mt-4 overflow-x-auto w-full pb-2 hide-scrollbar">
                    {msg.results.map((p, idx) => (
                      <div key={idx} onClick={() => setSelectedProject(p)} className="min-w-[140px] bg-white/5 border border-white/10 p-2 rounded-2xl hover:border-[#7D68F6] transition-all cursor-pointer">
                        <img src={p.images[0]} className="w-full h-20 object-cover rounded-xl mb-2" alt="p"/>
                        <p className="text-[9px] font-bold uppercase truncate px-1">{p.Title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="BUSCAR PROYECTO O HABILIDAD..." 
            className="w-full bg-white/5 border border-white/20 rounded-full py-5 px-10 outline-none focus:border-[#7D68F6] transition-all text-[11px] tracking-widest uppercase backdrop-blur-md" 
          />
          <button onClick={handleSend} className="absolute right-3 top-2.5 bg-[#7D68F6] p-3 rounded-full hover:scale-110 transition-all">
            <Send size={18}/>
          </button>
        </div>
      </section>

      {/* RESULTADOS (Solo se activan al buscar) */}
      {hasSearched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mt-24 z-10 px-6 pb-40">
           <div className="flex items-center justify-between mb-16">
              <button onClick={() => setCurrentIndex(p => (p - 1 + skillsData.length) % skillsData.length)} className="p-4 border border-white/10 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronLeft/></button>
              <h2 className="text-7xl font-black italic uppercase tracking-tighter text-center">{skillsData[currentIndex]?.name}</h2>
              <button onClick={() => setCurrentIndex(p => (p + 1) % skillsData.length)} className="p-4 border border-white/10 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronRight/></button>
           </div>

           {/* Grilla de talento con Hovers de Skills */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
              {talentData.map((person, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }} 
                  onClick={() => setSelectedPerson(person)}
                  className="group relative bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center cursor-pointer hover:border-[#7D68F6] transition-all overflow-visible"
                >
                  <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-transparent group-hover:border-[#7D68F6] transition-all" />
                  <h4 className="text-sm font-black uppercase mb-1">{person.Name}</h4>
                  <p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-tighter">{person.Role}</p>
                  
                  {/* Skill Chips on Hover */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0A0A0A]/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] p-4">
                     <p className="text-[9px] font-black mb-2 text-[#7D68F6]">SKILLS</p>
                     <div className="flex flex-wrap gap-1 justify-center">
                        {person.Skills?.split(',').slice(0,3).map((s, idx) => (
                          <span key={idx} className="bg-white/10 px-2 py-1 rounded-full text-[7px] font-bold uppercase">{s.trim()}</span>
                        ))}
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </motion.div>
      )}

      {/* SQUAD WIDGET */}
      <AnimatePresence>
        {myTeam.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 left-10 z-[500] bg-[#111] border border-white/10 p-4 rounded-full flex items-center gap-4 shadow-2xl">
            <div className="flex -space-x-3">
              {myTeam.map((m, i) => <img key={i} src={m.ImageURL} className="w-10 h-10 rounded-full border-2 border-black object-cover" />)}
            </div>
            <button className="bg-[#7D68F6] text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">My Squad ({myTeam.length})</button>
            <X size={16} onClick={() => setMyTeam([])} className="cursor-pointer text-white/30 hover:text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALES CORREGIDOS (Clic fuera para cerrar) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0F0F0F] border border-white/10 max-w-5xl w-full rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-[80vh]" onClick={e => e.stopPropagation()}>
               <div className="flex-1 bg-black flex items-center justify-center p-4">
                  <img src={selectedProject.images[0]} className="max-h-full object-contain rounded-2xl" />
               </div>
               <div className="w-full md:w-96 p-12 overflow-y-auto bg-[#0F0F0F] border-l border-white/10">
                  <h3 className="text-4xl font-black uppercase italic mb-4">{selectedProject.Title}</h3>
                  <p className="text-[#7D68F6] font-bold text-xs mb-8 uppercase">{selectedProject.Category}</p>
                  <p className="text-sm text-white/60 leading-relaxed mb-8">{selectedProject.Description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tagsArray.map((t, i) => <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-bold uppercase">{t}</span>)}
                  </div>
               </div>
            </motion.div>
          </div>
        )}

        {selectedPerson && (
          <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedPerson(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#111] border border-white/10 max-w-xl w-full rounded-[4rem] p-16 text-center relative" onClick={e => e.stopPropagation()}>
              <img src={selectedPerson.ImageURL} className="w-40 h-40 rounded-full mx-auto mb-8 object-cover border-4 border-[#7D68F6]" />
              <h3 className="text-4xl font-black uppercase italic mb-2">{selectedPerson.Name}</h3>
              <p className="text-[#7D68F6] font-bold tracking-widest uppercase text-xs mb-8">{selectedPerson.Role}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-12">
                {selectedPerson.Skills?.split(',').map((s, i) => <span key={i} className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-bold uppercase">{s.trim()}</span>)}
              </div>
              <button 
                onClick={() => { if(!myTeam.find(p => p.ID === selectedPerson.ID)) setMyTeam([...myTeam, selectedPerson]); setSelectedPerson(null); }}
                className="w-full bg-[#7D68F6] py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#6a56e0] transition-all"
              >
                Añadir al Brief Squad
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
            <h1 className="text-8xl font-black italic text-white mb-2">MRM.</h1>
            <p className="text-[#7D68F6] font-bold tracking-[1em] uppercase text-[10px] mb-12">Bogota creative credentials</p>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-10 py-5 rounded-full font-black text-xs hover:scale-110 transition-all flex items-center gap-3"><LogIn size={18}/> ACCESO CORPORATIVO</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}