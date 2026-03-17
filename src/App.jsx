import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Calendar, UserPlus, UserMinus } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN AZURE MSAL ---
const authConfig = {
    auth: {
        clientId: "23d1168d-113b-48c0-a4fe-6e6d743f77af",
        authority: "https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364",
        redirectUri: "https://zealous-sky-0305e650f.2.azurestaticapps.net", 
    },
    cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
};

const msalInstance = new PublicClientApplication(authConfig);

function MainContent() {
  const { instance } = useMsal();
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
  const dataFetchedRef = useRef(false);

  // Scroll automático del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // --- CARGA DE DATOS (CSV) Y VINCULACIÓN POR ID ---
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          fetch('/datacenter/Talent_Database.csv'), 
          fetch('/datacenter/Projects_Database.csv') 
        ]);
        if (!tRes.ok || !pRes.ok) throw new Error("CSV no encontrados en /datacenter/");

        // Carga de Talento
        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { 
            header: true, skipEmptyLines: true, delimiter: ";",
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;
        
        const processedTalent = rawTalent.map(p => ({
            ...p,
            ID: String(p.ID || "").trim(), 
            Name: p.Name || "Sin Nombre",
            Role: p.Role || "Staff",
            ImageURL: p.ImageURL || `https://ui-avatars.com/api/?name=${p.Name}&background=7D68F6&color=fff`,
            skillsArray: String(p.Tags || p.Skills || "").split(',').map(s => s.trim()).filter(Boolean)
        }));
        setTalentData(processedTalent);

        // Carga de Proyectos
        const projectsCSV = await pRes.text();
        const rawProjects = Papa.parse(projectsCSV, { 
            header: true, skipEmptyLines: true, delimiter: ";",
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;
        
        setFlatProjects(rawProjects.map(p => ({
            ...p,
            ID: String(p.ID || "").trim(),
            Title: p.Title || "Proyecto MRM",
            images: p.ImageURLs ? String(p.ImageURLs).split(',').map(i => i.trim()) : ["https://picsum.photos/1200/800"],
            tagsArray: String(p.tags || p.Tags || "").split(',').map(t => t.trim()).filter(Boolean),
            // Vinculación: Limpiamos los IDs de equipo del CSV
            teamArray: String(p.TeamsIDs || "").replace(/;/g, ',').split(',').map(id => id.trim()).filter(Boolean),
            Category: p.Category || "Campaign",
            Description: p.Description || "Sin descripción.",
            LoPedido: p.LoPedido || "N/A",
            LoHecho: p.LoHecho || "N/A",
            LoLogrado: p.LoLogrado || "N/A"
        })));

        setChatHistory([{ type: 'ai', text: `Sistema MRM Bogotá Activo. Credenciales y Talento sincronizados.` }]);
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  // --- LÓGICA IA: GEMINI 2.5 FLASH ---
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    try {
        const KEY = import.meta.env.VITE_GEMINI_API_KEY;
        const MODEL = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

        // Enviamos data a la IA
        const pBrief = flatProjects.slice(0, 20).map(p => `${p.Title} [ID:${p.ID}]`).join(", ");
        const tBrief = talentData.slice(0, 20).map(t => `${t.Name} [ID:${t.ID}]`).join(", ");

        const systemPrompt = `Eres experto en Staffing de MRM Bogotá. 
        PROYECTOS: ${pBrief}. 
        TALENTO: ${tBrief}. 
        Usuario pregunta: "${userMsg}". 
        Responde SOLO JSON plano: {"match_ids":[], "talent_names":[], "reason":""}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });

        const data = await response.json();
        const rawRes = data.candidates[0].content.parts[0].text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawRes);

        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: parsed.reason, 
            results: flatProjects.filter(p => parsed.match_ids?.includes(p.ID)), 
            recommendedTalent: talentData.filter(t => parsed.talent_names?.includes(t.Name)) 
        }]);

    } catch (err) { setChatHistory(prev => [...prev, { type: 'ai', text: `⚠️ Error de comunicación con Gemini 2.5.` }]); } 
    finally { setIsTyping(false); }
  };

  // --- LÓGICA DE VINCULACIÓN DINÁMICA ---
  const toggleSquad = (p) => setSquad(prev => prev.some(x => x.ID === p.ID) ? prev.filter(x => x.ID !== p.ID) : [...prev, p]);
  
  // Mapeo automático de Talento por ID para el Modal
  const activeTeamTalent = useMemo(() => {
    if (!selectedProject) return [];
    return talentData.filter(t => selectedProject.teamArray.includes(t.ID));
  }, [selectedProject, talentData]);

  const isEntireTeamInSquad = useMemo(() => {
    if (activeTeamTalent.length === 0) return false;
    return activeTeamTalent.every(member => squad.some(s => s.ID === member.ID));
  }, [activeTeamTalent, squad]);

  const toggleEntireTeam = () => {
    if (isEntireTeamInSquad) {
      setSquad(prev => prev.filter(p => !activeTeamTalent.some(m => m.ID === p.ID)));
    } else {
      setSquad(prev => [...prev, ...activeTeamTalent.filter(m => !prev.some(s => s.ID === m.ID))]);
    }
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole)), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase animate-pulse">Sincronizando Datacenter MRM...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden selection:bg-[#7D68F6]/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col items-start cursor-pointer pointer-events-auto" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
            <div className="text-[10px] text-[#7D68F6] mt-1 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col uppercase font-bold tracking-widest">
                <span>BOGOTÁ</span><span>CREATIVE</span><span>CREDENTIALS</span>
            </div>
        </div>
        <div className="flex gap-4 items-center pointer-events-auto">
            {activeTab !== 'landing' && (
                <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
                    {[{id: 'chat', label: 'IA', icon: <MessageSquare size={14}/>}, {id: 'projects', label: 'PROYECTOS', icon: <Briefcase size={14}/>}, {id: 'team', label: 'TALENTO', icon: <Users size={14}/>}].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-white/40'}`}> {tab.icon} {tab.label} </button>
                    ))}
                </nav>
            )}
            <div onClick={() => setShowSquadModal(true)} className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg uppercase text-[10px] font-black hover:scale-105 transition-all">SQUAD ({squad.length})</div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen pt-24 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen items-stretch -mt-24">
                {[{ id: 'chat', title: 'CONSULTORÍA IA', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' }, { id: 'projects', title: 'PROYECTOS', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' }, { id: 'team', title: 'TALENTO', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200' }].map(card => (
                    <div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0">
                        <div className="absolute inset-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-1000" alt=""/></div>
                        <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-32 text-left"><h2 className="text-5xl font-black uppercase tracking-tighter leading-none group-hover:text-[#7D68F6] transition-colors">{card.title}</h2></div>
                    </div>
                ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-24 w-full px-6 flex flex-col h-[calc(100vh-100px)] pb-12 text-left">
                <div className="relative flex-1 mb-8 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col gap-8 hide-scrollbar scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[95%] p-6 px-8 rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90 normal-case mb-6 font-medium">{msg.text}</p>
                                    
                                    {/* RESPUESTA INTERACTIVA: PROYECTOS */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mb-6 flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                            {msg.results.map((p, idx) => (
                                                <div key={idx} onClick={() => setSelectedProject(p)} className="min-w-[240px] bg-black/40 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all">
                                                    <img src={p.images[0]} className="h-28 w-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/>
                                                    <div className="p-4 text-left"><h4 className="text-[11px] font-black uppercase mb-1 truncate text-white">{p.Title}</h4><p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">VER CREDENCIAL</p></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* RESPUESTA INTERACTIVA: PERSONAS */}
                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-2 pt-5 border-t border-white/10">
                                            {msg.recommendedTalent.map((t, idx) => (
                                                <div key={idx} className="bg-black/40 p-3 pr-5 rounded-full border border-white/5 flex items-center gap-4 group">
                                                    <img src={t.ImageURL} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/>
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-black uppercase text-white leading-none mb-1">{t.Name}</p>
                                                        <p className="text-[8px] text-[#7D68F6] font-bold uppercase leading-none">{t.Role}</p>
                                                    </div>
                                                    <button onClick={() => toggleSquad(t)} className={`ml-2 p-2 rounded-full border transition-all ${squad.some(s => s.ID === t.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white shadow-lg' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                                        {squad.some(s => s.ID === t.ID) ? <UserMinus size={12}/> : <UserPlus size={12}/>}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-[10px] font-black uppercase text-[#7D68F6] animate-pulse">Gemini 2.5 analizando...</div>}
                    </div>
                </div>
                <div className="flex gap-4">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad de staffing..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] text-[15px] min-h-[64px] backdrop-blur-md resize-none" />
                    <button onClick={handleSend} disabled={isTyping} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-lg hover:scale-105 shadow-[#7D68F6]/20 disabled:opacity-50"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" className="pt-48 px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {flatProjects.map((p, i) => (
                    <div key={i} onClick={() => setSelectedProject(p)} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] text-left transition-all shadow-xl">
                        <div className="h-64 bg-black overflow-hidden relative"><img src={p.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                        <div className="p-8"><h4 className="text-xl font-black uppercase text-white mb-2">{p.Title}</h4><p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest tracking-widest">VER DETALLES <ChevronRight size={10} className="inline ml-1"/></p></div>
                    </div>
                ))}
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" className="flex gap-16 pt-48 px-12 max-w-7xl mx-auto pb-40 text-left">
                <aside className="w-64 sticky top-48 flex flex-col gap-2">
                    <h3 className="text-[#7D68F6] text-[10px] font-black uppercase mb-8 tracking-widest tracking-widest font-black">FILTRAR ROL</h3>
                    {uniqueRoles.map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-md' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{role}</button>))}
                </aside>
                <div className="flex-1">
                    <h2 className="text-7xl font-black uppercase tracking-tighter mb-12">EQUIPO BOGOTÁ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalent.map((person, i) => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] flex flex-col group transition-all">
                                <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale transition-all border-4 border-transparent group-hover:border-[#7D68F6] bg-black shadow-lg" alt=""/>
                                <h4 className="text-[18px] font-black uppercase truncate w-full text-white">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4 tracking-widest">{person.Role}</p>
                                <button onClick={() => toggleSquad(person)} className={`w-full py-3 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] mt-auto transition-all ${squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>{squad.some(p => p.ID === person.ID) ? 'EN SQUAD' : 'ADD TO SQUAD'}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL DETALLE PROYECTO (DISEÑO 70/30 RECUPERADO) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-start justify-center p-6 backdrop-blur-2xl bg-black/95 overflow-y-auto">
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 rounded-full hover:bg-white text-white hover:text-black transition-all border border-white/10 shadow-2xl"><X size={24}/></button>
            <div className="w-full max-w-[1600px] mx-auto my-12 flex flex-col lg:flex-row gap-8 pb-20 text-left">
              
              {/* 70%: CREDENCIAL DETALLADA */}
              <div className="w-full lg:w-[70%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="relative h-[500px] w-full bg-zinc-950 flex overflow-x-auto snap-x hide-scrollbar">
                  {selectedProject.images.map((img, i) => (<img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-start opacity-70" alt="Slide" />))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                </div>
                <div className="p-16 space-y-12">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase px-4 py-1.5 bg-[#7D68F6]/20 text-[#7D68F6] border border-[#7D68F6]/30 rounded-full tracking-widest">{selectedProject.Category}</span>
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white leading-none">{selectedProject.Title}</h2>
                    <p className="text-xl text-white/60 normal-case leading-relaxed font-normal">{selectedProject.Description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {selectedProject.tagsArray.map((tag, idx) => (<span key={idx} className="px-5 py-2.5 bg-zinc-900 border border-white/5 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">{tag}</span>))}
                    </div>
                  </div>
                  
                  {/* TRES COLUMNAS RECUPERADAS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    {[{t: "LO PEDIDO", d: selectedProject.LoPedido}, {t: "LO HECHO", d: selectedProject.LoHecho}, {t: "LO LOGRADO", d: selectedProject.LoLogrado}].map((col, i) => (
                      <div key={i} className="space-y-4">
                        <h4 className="text-[12px] font-black tracking-[0.4em] text-[#7D68F6] uppercase">{col.t}</h4>
                        <p className="text-sm text-white/50 normal-case font-normal leading-relaxed">{col.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 30%: BARRA LATERAL TALENTO (LEÍDO DEL CSV POR ID) */}
              <div className="w-full lg:w-[30%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-10 shadow-2xl h-fit lg:sticky top-12 flex flex-col">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-8">EQUIPO DEL PROYECTO</h4>
                <div className="flex flex-col gap-4 mb-10 max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {activeTeamTalent.length === 0 ? (
                    <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-relaxed">Sin talento vinculado en base de datos.</p>
                    </div>
                  ) : activeTeamTalent.map(member => (
                    <div key={member.ID} className="flex items-center justify-between bg-black/40 p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <img src={member.ImageURL} className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt=""/>
                        <div className="flex flex-col">
                            <p className="font-black text-[13px] uppercase text-white truncate max-w-[120px] leading-tight">{member.Name}</p>
                            <p className="text-[9px] text-[#7D68F6] font-black uppercase tracking-tighter">{member.Role}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleSquad(member)} className={`p-3 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'text-white/30 border-white/10 hover:text-white hover:border-[#7D68F6]'}`}>
                        {squad.some(s => s.ID === member.ID) ? <UserMinus size={16}/> : <UserPlus size={16}/>}
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={toggleEntireTeam} disabled={activeTeamTalent.length === 0} className={`w-full py-6 font-black uppercase text-[10px] rounded-full transition-all tracking-widest ${isEntireTeamInSquad ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' : 'bg-[#7D68F6] text-white hover:scale-105 shadow-xl shadow-[#7D68F6]/20'}`}>
                    {isEntireTeamInSquad ? 'RETIRAR SQUAD COMPLETO' : 'AGREGAR SQUAD COMPLETO'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SQUAD (Final) */}
      <AnimatePresence>
        {showSquadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/95">
            <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-transform hover:rotate-90"><X size={48}/></button>
            <div className="w-full max-w-5xl text-left">
              <input value={customProjectTitle} onChange={(e) => setCustomProjectTitle(e.target.value)} className="bg-transparent text-7xl font-black uppercase border-b-2 border-white/10 focus:border-[#7D68F6] outline-none w-full pb-6 mb-16 tracking-tighter" placeholder="NOMBRE..."/>
              <div className="grid grid-cols-12 gap-20">
                <div className="col-span-5 bg-zinc-900/50 p-10 rounded-[3rem] border-l-4 border-[#7D68F6] shadow-xl"><p className="text-[#7D68F6] font-black uppercase tracking-widest text-[10px] mb-4 text-left">SQUAD ENGINE</p><p className="text-white/60 italic leading-relaxed text-left">"Equipo táctico optimizado según las credenciales históricas de MRM Bogotá."</p></div>
                <div className="col-span-7">
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em] text-left">SQUAD SELECCIONADO ({squad.length})</h4>
                  <div className="flex flex-wrap gap-6 mb-16 overflow-y-auto max-h-[300px] hide-scrollbar p-2">
                    {squad.map(p => (<div key={p.ID} className="text-center group"><img src={p.ImageURL} className="w-20 h-20 rounded-full border-2 border-white/5 transition-all mb-3 object-cover shadow-2xl" alt=""/><p className="text-[10px] font-black uppercase text-white">{p.Name.split(' ')[0]}</p></div>))}
                  </div>
                  <button onClick={() => { const emails = squad.map(s => s.Email || '').join(';'); window.location.href = `mailto:${emails}?subject=Squad MRM: ${customProjectTitle}`; }} className="w-full py-7 bg-white text-black rounded-full font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#7D68F6] hover:text-white transition-all shadow-2xl shadow-white/10"><Calendar size={18}/> COORDINAR REUNIÓN TEAMS</button>
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
        <div className="relative z-10 text-center">
            <h1 className="text-[140px] font-black uppercase tracking-tighter leading-none mb-4 text-white">MRM</h1>
            <p className="text-[16px] text-[#7D68F6] font-black uppercase tracking-[0.6em] mb-12 font-black">BOGOTÁ CREATIVE CREDENTIALS</p>
            <button onClick={() => instance.loginRedirect()} className="bg-[#7D68F6] hover:bg-white hover:text-black transition-all duration-300 px-14 py-6 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_0_60px_rgba(125,104,246,0.3)]">INICIAR SESIÓN CON MICROSOFT</button>
        </div>
        <style>{`body, html { font-family: 'Inter', sans-serif !important; background-color: #0A0A0A !important; overflow-x: hidden; } h1, h2, h3, h4, .font-black { font-weight: 900 !important; }`}</style>
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