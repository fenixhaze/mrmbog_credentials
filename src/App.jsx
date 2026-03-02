import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, Filter, ChevronRight, Loader2, X, Star, Plus, Check } from 'lucide-react';
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
  const [filterRole, setFilterRole] = useState('All');

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
          // NUEVOS PERMISOS PARA LEER LA NUBE COMPARTIDA
          scopes: ["Files.Read.All", "Sites.Read.All", "User.Read"],
          account: accounts[0]
        });
        const headers = { 'Authorization': `Bearer ${tokenRes.accessToken}` };

        // --- TUS NUEVOS IDs DE SHAREPOINT / TEAMS ---
        const DRIVE_ID = "PEGA_AQUI_EL_DRIVE_ID_QUE_EMPIEZA_CON_b!"; // Reemplaza esto con el ID larguísimo
        const TALENTOS_ID = "01MJ36C7LCZVLM5BKCGBC3QCUTUPSDIIAN";
        const PROYECTOS_ID = "01MJ36C7JL7X73A7TRORC35MCFKBUBI5HI";

        const [tRes, pRes] = await Promise.all([
          fetch(`https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${TALENTOS_ID}/content`, { headers }),
          fetch(`https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${PROYECTOS_ID}/content`, { headers })
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
          tagsArray: (p.Tags || p.tags || "").split(',').map(t => t.trim()).filter(Boolean),
          teamArray: (p.TeamIDs || p.Team || p.team || "").split(',').map(t => t.trim()).filter(Boolean)
        })));

        setLoading(false);
        setChatHistory([{ type: 'ai', text: `Consultoría Estratégica MRM. ¿Qué equipo de élite vamos a conformar hoy?` }]);
      } catch (e) { 
        console.error("Error al cargar datos desde SharePoint:", e); 
        setLoading(false); 
      }
    };
    fetchData();
  }, [instance, accounts]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    // LECTURA DE COLUMNAS (Title, Category)
    const invLite = JSON.stringify(flatProjects.slice(0, 12).map(p => ({ id: p.ID || p.internalID, n: p.Title || p.ProjectName })));
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

        const matchedP = flatProjects.filter(p => pIds.includes(p.internalID) || pIds.includes(p.ID));
        const matchedT = talentData.filter(t => tNames.includes(t.Name)).slice(0, 4);

        setChatHistory(prev => [...prev, { type: 'ai', text: cleanReason, results: matchedP, recommendedTalent: matchedT }]);
    } catch (err) { setChatHistory(prev => [...prev, { type: 'ai', text: "Hubo un error analizando la solicitud." }]); } 
    finally { setIsTyping(false); }
  };

  const toggleSquad = (person) => {
      setSquad(prev => prev.some(p => p.Name === person.Name) ? prev.filter(p => p.Name !== person.Name) : [...prev, person]);
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole)), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase mrm-sub-header animate-pulse">MRM BOGOTÁ</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-start cursor-pointer" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
            <div className="mrm-sub-header text-[10px] text-[#7D68F6] mt-2 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col leading-[1.1]">
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
                  <div className="absolute inset-0 z-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000 ease-out" alt="bg"/><div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" /></div>
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
                                    
                                    {/* PROYECTOS EN CHAT */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mrm-sub-header mb-4">Credenciales Sugeridas</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                                                {msg.results.map((project, idx) => {
                                                    const displayTitle = project.Title || project.ProjectName || 'Proyecto Destacado';
                                                    const displayCategory = project.Category || project.Client || 'MRM Work';

                                                    return (
                                                    <div key={idx} onClick={() => setSelectedProject(project)} className="min-w-[280px] w-[280px] bg-[#141414] border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all flex flex-col">
                                                        <div className="h-40 bg-black overflow-hidden relative">
                                                            <img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="img"/>
                                                        </div>
                                                        <div className="p-5 flex-1 flex flex-col">
                                                            <h4 className="text-[15px] font-black uppercase text-white leading-tight mb-1">{displayTitle}</h4>
                                                            <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4">{displayCategory}</p>
                                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                                {project.tagsArray?.slice(0, 3).map((tag, tIdx) => (
                                                                    <span key={tIdx} className="text-[9px] font-black uppercase px-3 py-1.5 bg-white/10 rounded-full text-white/60">{tag}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )})}
                                            </div>
                                        </div>
                                    )}

                                    {/* TALENTO EN CHAT */}
                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mrm-sub-header mb-4">Squad Recomendado</h5>
                                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                                {msg.recommendedTalent.map((t, idx) => (
                                                    <div key={idx} className="flex flex-col items-center min-w-[170px] bg-[#141414] p-5 rounded-[2rem] border border-white/5 group relative">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-black border border-white/10 group-hover:border-[#7D68F6] transition-all">
                                                            <img src={t.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="avatar"/>
                                                        </div>
                                                        <span className="text-[12px] font-black uppercase truncate w-full text-center mb-1 text-white">{t.Name}</span>
                                                        <p className="text-[9px] text-[#7D68F6] font-black uppercase mb-4">{t.Role}</p>
                                                        
                                                        <div className="flex flex-wrap justify-center gap-1.5 mb-5 h-12 min-h-[48px] content-start overflow-hidden">
                                                            {t.skillsArray?.slice(0, 4).map((skill, sIdx) => (
                                                                <span key={sIdx} className="text-[8px] font-black uppercase px-2 py-1 bg-white/10 text-white/60 rounded-full">{skill}</span>
                                                            ))}
                                                        </div>
                                                        
                                                        <button onClick={() => toggleSquad(t)} className={`w-full py-2.5 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(p => p.Name === t.Name) ? 'bg-[#7D68F6] text-white' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                                            {squad.some(p => p.Name === t.Name) ? 'En Squad' : 'Add Squad'}
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
                <div className="flex items-center gap-4 w-full mb-12">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[64px] backdrop-blur-md resize-none shadow-2xl" />
                    <button onClick={handleSend} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 px-12 max-w-7xl mx-auto pb-40">
                <div className="mb-12"><h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Proyectos</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {flatProjects.map((project, i) => {
                        const displayTitle = project.Title || project.ProjectName || 'Proyecto Destacado';
                        const displayCategory = project.Category || project.Client || 'MRM Work';

                        return (
                        <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedProject(project)} className="bg-[#141414] border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-xl flex flex-col">
                            <div className="h-64 overflow-hidden relative bg-black">
                                <img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="img"/>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h4 className="text-[20px] font-black uppercase text-white tracking-tighter mb-2 group-hover:text-[#7D68F6] transition-colors">{displayTitle}</h4>
                                <p className="text-[12px] text-[#7D68F6] font-black uppercase tracking-widest mb-6">{displayCategory}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                    {project.tagsArray?.slice(0, 4).map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[9px] font-black uppercase px-3 py-1.5 bg-white/10 rounded-full text-white/60">{tag}</span>
                                    ))}
                                </div>
                                
                                <div className="text-[11px] font-black uppercase text-white/40 group-hover:text-white transition-colors flex items-center gap-2 pt-4 border-t border-white/5">
                                    Ver detalles <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" className="flex gap-16 items-start pt-48 px-12 max-w-7xl mx-auto pb-40">
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
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-[#141414] border border-white/5 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group overflow-hidden flex flex-col">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-transparent group-hover:border-[#7D68F6] shadow-xl bg-black"><img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="avatar"/></div>
                                <h4 className="text-[18px] font-black text-white uppercase mb-1">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-6">{person.Role}</p>
                                
                                <div className="flex flex-wrap justify-center gap-1.5 mb-6 h-12 min-h-[48px] content-start overflow-hidden mt-auto">
                                    {person.skillsArray?.slice(0, 4).map((skill, sIdx) => (
                                        <span key={sIdx} className="text-[8px] font-black uppercase px-2.5 py-1 bg-white/10 text-white/60 rounded-full">{skill}</span>
                                    ))}
                                </div>
                                <button onClick={() => toggleSquad(person)} className={`w-full py-3 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(p => p.Name === person.Name) ? 'bg-[#7D68F6] text-white shadow-lg shadow-[#7D68F6]/20' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                    {squad.some(p => p.Name === person.Name) ? 'En Squad' : 'Add to Squad'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0f0f0f] border border-white/10 w-full max-w-5xl h-[90vh] rounded-[3rem] overflow-hidden relative flex flex-col shadow-2xl">
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 z-10 p-4 bg-black/50 rounded-full hover:bg-[#7D68F6] transition-all text-white"><X size={24}/></button>
              <div className="h-[45%] bg-black relative flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                  {selectedProject.images.map((img, i) => (<img key={i} src={img} className="w-full h-full flex-shrink-0 snap-start object-cover" alt="gallery"/>))}
              </div>
              <div className="p-12 flex-1 overflow-y-auto hide-scrollbar">
                  <p className="text-[#7D68F6] font-black uppercase tracking-[0.4em] text-xs mb-2 mrm-sub-header">
                      {selectedProject.Category || selectedProject.Client || 'Category'}
                  </p>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 text-white">
                      {selectedProject.Title || selectedProject.ProjectName || 'Proyecto Sin Nombre'}
                  </h2>
                  <div className="text-white/80 leading-relaxed text-lg">{selectedProject.Description || 'Sin descripción disponible.'}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 right-12 z-[100]"><button onClick={() => instance.logoutRedirect()} className="p-5 bg-white/5 rounded-full border border-white/10 text-white/20 hover:text-red-500 transition-all shadow-xl"><LogOut size={22}/></button></footer>

      <style>{`
        @font-face { font-family: 'MW Sans'; src: url('./fonts/MWSans-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; }
        @font-face { font-family: 'MW Sans'; src: url('./fonts/MWSans-Black.woff2') format('woff2'); font-weight: 900; font-style: normal; }
        :root { --font-mrm: 'MW Sans', sans-serif; }
        body, html { font-family: var(--font-mrm) !important; background-color: #0A0A0A !important; color: white; margin: 0; -webkit-font-smoothing: antialiased; }
        * { font-style: normal !important; box-sizing: border-box; }
        h1, h2, h3, .text-5xl, .text-6xl, .text-7xl { font-weight: 900 !important; letter-spacing: -0.06em !important; text-transform: uppercase; line-height: 0.9; }
        .mrm-sub-header { font-weight: 700 !important; letter-spacing: 0.4em !important; text-transform: uppercase; }
        .mask-fade-top { mask-image: linear-gradient(to bottom, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        h4 { color: #FFFFFF !important; display: block !important; opacity: 1 !important; position: relative !important; z-index: 50 !important; }
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
            <h1 className="text-[14vw] font-black text-white mb-2 tracking-tighter leading-none">MRM.</h1>
            <div className="mrm-sub-header flex flex-col text-[14px] text-[#7D68F6] mb-20 border-l-4 border-[#7D68F6] pl-6 text-left">
                <span>Bogota</span><span>Creative</span><span>Credentials</span>
            </div>
            <button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] text-white px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-110 transition-all">Acceso Corporativo</button>
        </div>
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}