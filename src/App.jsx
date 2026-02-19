import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, X, Users, Plus, Search } from 'lucide-react';
import Papa from 'papaparse';

// RUTAS CORREGIDAS PARA VITE/REACT
// Aunque en VS Code veas la carpeta "Public", para el navegador los archivos están en la raíz "/"
const URL_DATA_TALENT = "/Talent_Database.csv";
const URL_DATA_PROJECTS = "/Projects_Database.csv";

export default function App() {
  const [skillsData, setSkillsData] = useState([]);
  const [talentData, setTalentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'ai', text: "Terminal MRM Bogotá activa. Sincronizando credenciales locales..." }
  ]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [myTeam, setMyTeam] = useState([]);
  const chatContainerRef = useRef(null);

  // Auto-scroll para el chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // CARGA DE DATOS LOCALES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          fetch(URL_DATA_TALENT).then(r => {
            if(!r.ok) throw new Error("No se encontró Talent_Database.csv");
            return r.text();
          }),
          fetch(URL_DATA_PROJECTS).then(r => {
            if(!r.ok) throw new Error("No se encontró Projects_Database.csv");
            return r.text();
          })
        ]);

        const parsedTalent = Papa.parse(tRes, { header: true, skipEmptyLines: true }).data;
        const parsedProjects = Papa.parse(pRes, { header: true, skipEmptyLines: true }).data;

        const categories = ["UX/UI", "MOTION GRAPHICS", "VIDEO PRODUCTION", "BANNER ADS", "SOCIAL MEDIA & DOOH", "CREATIVE DATA", "CRM & EMAIL DESIGN", "PRESENTATION DESIGN", "AI PRODUCTION"];
        
        const structuredSkills = categories.map((cat, idx) => ({
          id: idx + 1,
          name: cat,
          projects: parsedProjects
            .filter(p => p.Category && p.Category.trim().toUpperCase() === cat.toUpperCase())
            .map(p => ({
              ...p,
              images: p.ImageURLs ? p.ImageURLs.split(',').map(i => i.trim()) : ["https://picsum.photos/seed/mrm/800/500"],
              tags: p.Tags ? p.Tags.split(',').map(t => t.trim()) : ["Creative", "MRM"],
              team: p.TeamIDs ? p.TeamIDs.split(',').map(id => parsedTalent.find(t => t.ID === id.trim())).filter(Boolean) : []
            }))
        }));

        setTalentData(parsedTalent);
        setSkillsData(structuredSkills);
        setLoading(false);
        setChatHistory([{ type: 'ai', text: "Sincronización exitosa. ¿Qué capacidad creativa de MRM necesitas hoy?" }]);
      } catch (e) {
        console.error("Error crítico:", e);
        setLoading(false);
        setChatHistory([{ type: 'ai', text: "Error de enlace: Asegúrate de que los archivos .csv estén directamente dentro de la carpeta Public (sin subcarpetas) y que se llamen exactamente como en el código." }]);
      }
    };
    fetchData();
  }, []);

  // Manejador de mensajes con protección contra "Pantalla Negra"
  const handleSendMessage = () => {
    if (!input.trim()) return;
    setHasSearched(true);
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    
    // Si la data no cargó, respondemos error en el chat en lugar de romper la app
    if (!skillsData || skillsData.length === 0) {
        setTimeout(() => {
            setChatHistory(prev => [...prev, { 
              type: 'ai', 
              text: "Error de base de datos: Los archivos CSV no han sido cargados correctamente. No puedo mostrar proyectos." 
            }]);
          }, 600);
          setInput('');
          return;
    }

    const currentResults = skillsData[currentIndex]?.projects.slice(0, 3) || [];
    setInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: `He filtrado los mejores casos de ${skillsData[currentIndex].name} para ti:`, 
        responseProjects: currentResults 
      }]);
    }, 600);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
      <div className="mrm-bold text-[#7D68F6] tracking-[1em] animate-pulse uppercase text-[10px]">Iniciando Protocolo MRM...</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col items-center pb-40 relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,#1a0b3d_0%,#0A0A0A_75%)] z-0" />
      
      {/* Header - Subtítulo Bogotá Creative Credentials */}
      <header className="w-full pt-12 z-10 text-center relative">
        <h1 className="text-[90px] font-black uppercase mrm-bold italic tracking-tighter leading-none">MRM</h1>
        <p className="text-[11px] mrm-bold uppercase tracking-[1em] text-[#7D68F6] mt-4 ml-4">Bogota creative credentials</p>
      </header>

      {/* Chatbot - Disolución hacia arriba */}
      <section className="w-full max-w-2xl z-20 mt-8 px-6 relative">
        <div className="h-[300px] overflow-hidden relative">
            <div ref={chatContainerRef} className="h-full overflow-y-auto mb-6 flex flex-col gap-6 hide-scrollbar p-2 pb-10" 
                 style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 100%)' }}>
                {chatHistory.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-4 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 px-6 rounded-[2rem] text-[13px] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] rounded-tr-none' : 'bg-white/5 border-white/10 backdrop-blur-md rounded-tl-none'}`}>{msg.text}</div>
                        {msg.responseProjects && (
                          <div className="flex gap-3 overflow-x-auto pb-4 max-w-full hide-scrollbar">
                            {msg.responseProjects.map((p, idx) => (
                              <div key={idx} onClick={() => {setSelectedProject(p); setActiveImg(0);}} className="min-w-[180px] bg-white/5 border border-white/10 p-4 rounded-[1.8rem] cursor-pointer hover:border-[#7D68F6] transition-all group">
                                <img src={p.images[0]} className="w-full h-24 object-cover rounded-[1.2rem] mb-3 group-hover:scale-105 transition-transform" />
                                <h4 className="text-[10px] mrm-bold uppercase truncate text-white/80">{p.Title}</h4>
                              </div>
                            ))}
                          </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
        <div className="w-full flex items-center bg-white/5 border border-white/10 rounded-full px-7 py-4 backdrop-blur-xl">
          <Search size={18} className="text-white/20 mr-4" />
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="BUSCAR CAPACIDADES..." className="bg-transparent flex-1 outline-none text-[13px] uppercase tracking-widest font-light" />
          <button onClick={handleSendMessage} className="ml-3 w-11 h-11 rounded-full bg-[#7D68F6] flex items-center justify-center hover:scale-110 transition-all"><Send size={18}/></button>
        </div>
      </section>

      {/* Widget Team Selection - Permanente abajo izquierda */}
      <div className="fixed bottom-8 left-8 z-[200]">
        <AnimatePresence>
          {myTeam.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-white/5 border border-white/20 backdrop-blur-2xl p-5 rounded-[2.8rem] flex items-center gap-4 cursor-pointer shadow-2xl hover:bg-white/10 transition-all">
              <div className="flex -space-x-3">
                {myTeam.slice(0, 4).map((m, idx) => <img key={idx} src={m.ImageURL} className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] object-cover" />)}
              </div>
              <div className="pr-4 border-l border-white/10 pl-4">
                <p className="text-[10px] mrm-bold uppercase">Team selection</p>
                <p className="text-[9px] text-[#7D68F6] uppercase font-black">{myTeam.length} Miembros</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div animate={{ opacity: hasSearched ? 1 : 0, y: hasSearched ? 0 : 40 }} className="w-full">
        {/* Capability Slider */}
        <section className="w-full max-w-5xl mt-24 mx-auto px-6 relative z-50 text-center">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentIndex(p => (p - 1 + skillsData.length) % skillsData.length)} className="p-4 border border-white/10 rounded-full hover:bg-white/5"><ChevronLeft/></button>
            <div className="px-10">
              <h2 className="text-6xl mrm-bold uppercase tracking-tighter italic">{skillsData[currentIndex]?.name}</h2>
              <p className="text-[10px] text-[#7D68F6] mrm-bold mt-4 tracking-[0.6em] uppercase">Capability Node</p>
            </div>
            <button onClick={() => setCurrentIndex(p => (p + 1) % skillsData.length)} className="p-4 border border-white/10 rounded-full hover:bg-white/5"><ChevronRight/></button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {skillsData[currentIndex]?.projects.map((p, idx) => (
              <div key={idx} className="px-10 py-5 rounded-full border border-white/10 bg-white/5 cursor-pointer hover:border-[#7D68F6] transition-all" onClick={() => setSelectedProject(p)}>
                <span className="text-sm mrm-bold uppercase tracking-widest">{p.Title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Talent Grid - Animaciones y Hovers */}
        <section className="w-full max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-40 z-10">
          {talentData.map((t, idx) => (
            <motion.div key={idx} whileHover={{ y: -12 }} onClick={() => setSelectedTalent(t)} className="flex flex-col items-center bg-white/[0.02] p-8 rounded-[3rem] border border-white/5 hover:border-[#7D68F6] cursor-pointer text-center group transition-all">
              <img src={t.ImageURL} className="w-20 h-20 rounded-full grayscale group-hover:grayscale-0 mb-4 border border-white/10 object-cover transition-all duration-500" />
              <h4 className="text-[11px] mrm-bold uppercase mb-1">{t.Name}</h4>
              <p className="text-[9px] text-white/40 uppercase tracking-tighter">{t.Role}</p>
            </motion.div>
          ))}
        </section>
      </motion.div>

      {/* MODAL PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl" onClick={() => setSelectedProject(null)}>
            <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-6xl rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row h-[750px] relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="md:w-1/2 relative bg-black flex items-center">
                <img src={selectedProject.images[activeImg]} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <button onClick={() => setActiveImg(i => (i - 1 + selectedProject.images.length) % selectedProject.images.length)} className="p-4 bg-black/60 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronLeft/></button>
                  <button onClick={() => setActiveImg(i => (i + 1) % selectedProject.images.length)} className="p-4 bg-black/60 rounded-full hover:bg-[#7D68F6] transition-all"><ChevronRight/></button>
                </div>
              </div>
              <div className="md:w-1/2 p-16 flex flex-col justify-between overflow-y-auto">
                <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X/></button>
                <div>
                  <h2 className="text-5xl mrm-bold uppercase mb-4 italic leading-none">{selectedProject.Title}</h2>
                  <div className="flex gap-2 mb-8">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 border border-[#7D68F6]/30 bg-[#7D68F6]/10 rounded-full text-[9px] text-[#7D68F6] mrm-bold uppercase">{tag}</span>
                    ))}
                  </div>
                  <p className="text-xl text-white/50 font-light mb-12">{selectedProject.Description}</p>
                </div>
                <div className="border-t border-white/10 pt-10">
                  <h4 className="text-[10px] mrm-bold text-[#7D68F6] uppercase mb-8 flex items-center gap-3"><Users size={18}/> TEAM ASIGNADO</h4>
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {selectedProject.team.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.8rem] border border-white/5">
                        <img src={m.ImageURL} className="w-12 h-12 rounded-full grayscale" />
                        <div><h5 className="text-[11px] mrm-bold uppercase">{m.Name}</h5><p className="text-[9px] text-white/40 uppercase">{m.Role}</p></div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {setMyTeam(prev => [...prev, ...selectedProject.team]); setSelectedProject(null);}} className="w-full py-6 bg-[#7D68F6] rounded-[2rem] text-[11px] mrm-bold uppercase flex items-center justify-center gap-4 hover:scale-[1.02] shadow-xl transition-all"><Plus size={20} /> AGREGAR AL BRIEF</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL TALENTO */}
      <AnimatePresence>
        {selectedTalent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl" onClick={() => setSelectedTalent(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[3rem] p-12 text-center relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedTalent(null)} className="absolute top-8 right-8 text-white/20"><X/></button>
              <img src={selectedTalent.ImageURL} className="w-32 h-32 rounded-full mx-auto mb-6 border-2 border-[#7D68F6] object-cover" />
              <h2 className="text-3xl mrm-bold uppercase mb-2">{selectedTalent.Name}</h2>
              <p className="text-[#7D68F6] mrm-bold uppercase text-[10px] tracking-widest mb-8">{selectedTalent.Role}</p>
              <button onClick={() => {setMyTeam([...myTeam, selectedTalent]); setSelectedTalent(null);}} className="w-full py-5 bg-[#7D68F6] rounded-[2rem] text-[10px] mrm-bold uppercase flex items-center justify-center gap-3"><Plus size={18}/> AGREGAR AL TEAM</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}