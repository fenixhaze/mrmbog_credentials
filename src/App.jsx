import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Mail, Calendar, UserPlus, UserMinus, Check, Link2, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN DE AZURE ---
const authConfig = {
    auth: {
        clientId: "23d1168d-113b-48c0-a4fe-6e6d743f77af",
        authority: "[https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364](https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364)",
        redirectUri: "[https://fenixhaze.github.io/mrmbog_credentials/](https://fenixhaze.github.io/mrmbog_credentials/)", 
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
  const [customProjectTitle, setCustomProjectTitle] = useState("NUEVO PROYECTO MRM");
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

  const activeProjectTeamIds = selectedProject?.teamArray || [];
  const activeTeamTalent = talentData.filter(t => activeProjectTeamIds.includes(t.ID));
  const isEntireTeamInSquad = activeProjectTeamIds.length > 0 && activeTeamTalent.length > 0 && activeTeamTalent.every(member => squad.some(s => s.ID === member.ID));

  const toggleEntireTeam = () => {
      if (isEntireTeamInSquad) {
          setSquad(prev => prev.filter(p => !activeProjectTeamIds.includes(p.ID)));
      } else {
          setSquad(prev => {
              const newOnes = activeTeamTalent.filter(p => !prev.some(s => s.ID === p.ID));
              return [...prev, ...newOnes];
          });
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // RUTA DINÁMICA APUNTANDO A LA CARPETA 'datacenter'
        const baseUrl = window.location.hostname.includes('github.io') ? '/mrmbog_credentials' : '';
        const [tRes, pRes] = await Promise.all([
          fetch(`${baseUrl}/datacenter/Talent_Database.csv`), 
          fetch(`${baseUrl}/datacenter/Projects_Database.csv`) 
        ]);

        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { 
            header: true, 
            skipEmptyLines: true, 
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;

        const processedTalent = rawTalent.map(p => ({
            ...p,
            ID: String(p.ID || p.id || p.Name || "").trim(), 
            Name: p.Name || p.name || "Talento MRM",
            Role: p.Role || p.role || "Especialista",
            skillsArray: String(p.Tags || p.Skills || p.tags || "").split(',').map(s => s.trim()).filter(Boolean)
        }));
        setTalentData(processedTalent);

        const projectsCSV = await pRes.text();
        const rawProjects = Papa.parse(projectsCSV, { 
            header: true, 
            skipEmptyLines: true, 
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;
        
        setFlatProjects(rawProjects.map(p => {
          const rawTags = p.tags || p.Tags || p.Capabilities || ""; 
          const rawTeam = String(p.TeamsIDs || p.TeamIDs || p.Team || "").replace(/;/g, ','); 
          
          return {
            ...p,
            ID: String(p.ID || p.id || "").trim(),
            Title: p.Title || p.title || "PROYECTO SIN TÍTULO",
            Description: p.Description || p.description || "Sin descripción disponible.",
            images: p.ImageURLs ? String(p.ImageURLs).split(',').map(i => i.trim()) : ["[https://picsum.photos/1200/800](https://picsum.photos/1200/800)"],
            tagsArray: rawTags.split(',').map(t => t.trim()).filter(Boolean),
            teamArray: rawTeam.split(',').map(t => t.trim()).filter(Boolean),
            Category: p.Category || p.category || "Proyecto Especial",
            LoPedido: p.LoPedido || p.lopedido || "Ejecución técnica e integración visual según requerimientos.",
            LoHecho: p.LoHecho || p.lohecho || "Desarrollo de ecosistema digital de alta performance.",
            LoLogrado: p.LoLogrado || p.lologrado || "Plataforma desplegada con excelente interactividad de usuario.",
            Link: p.Link || p.URL || p.ProjectURL || ""
          };
        }));

        setChatHistory([{ type: 'ai', text: `Bienvenido al sistema de credenciales MRM Bogotá. He conectado correctamente con Google Gemini. ¿Qué equipo y proyecto vamos a conformar hoy?` }]);
        setLoading(false);
      } catch (e) { console.error("Error cargando CSVs:", e); setLoading(false); }
    };
    fetchData();
  }, [instance, accounts]);

// --- CONEXIÓN DIRECTA Y ROBUSTA A GEMINI LEYENDO TODO EL CSV ---
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    try {
        const GEMINI_API_KEY = "AIzaSyAuU7YLuBYplG8S2ZBnxiz3xx8uvg81YNQ"; 
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        // OPTIMIZACIÓN EXTREMA: Comprimimos la info al máximo quitando textos largos (como descripciones completas)
        // Solo le enviamos IDs, Títulos y Categorías/Tags. Así nunca pesará demasiado.
        // Además, lo limitamos a los 50 más recientes para evitar bloqueos de red.
        const invLite = JSON.stringify(flatProjects.slice(0, 50).map(p => ({ 
            id: p.ID, 
            t: p.Title, 
            c: p.tagsArray.join(',') 
        })));
        
        const talLite = JSON.stringify(talentData.slice(0, 50).map(t => ({ 
            n: t.Name, 
            r: t.Role, 
            h: t.skillsArray.join(',') 
        })));

        const promptText = `
        Eres un experto en staffing para MRM Bogotá.
        Necesidad: "${userMsg}"
        
        Proyectos disponibles: ${invLite}
        Talento disponible: ${talLite}

        Devuelve SOLO un JSON válido (sin formato markdown) con esta estructura exacta:
        {"match_ids": ["ID1", "ID2"], "talent_names": ["Nombre1"], "reason": "Breve explicación."}
        `;

        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: promptText }] }]
                // Quité el parámetro estricto de JSON de Google porque a veces causa error 400 si el CSV tiene caracteres raros.
            })
        });

        // SI GOOGLE RECHAZA LA PETICIÓN, ESTO NOS DIRÁ EXACTAMENTE POR QUÉ
        if (!response.ok) {
            const errorText = await response.text(); // Capturamos el error crudo
            console.error("Error de Google:", errorText);
            throw new Error(`Google rechazó la conexión (Error ${response.status}). Detalles: ${errorText.substring(0, 150)}...`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("Gemini respondió, pero el mensaje venía vacío.");
        }

        let rawContent = data.candidates[0].content.parts[0].text;
        rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let pIds = [], tNames = [], cleanReason = "";
        
        try {
            const parsed = JSON.parse(rawContent);
            pIds = parsed.match_ids || [];
            tNames = parsed.talent_names || [];
            cleanReason = parsed.reason || "";
        } catch (parseError) { 
            console.error("Error decodificando el JSON:", rawContent);
            cleanReason = "Encontré recomendaciones, pero la IA devolvió un formato incorrecto."; 
        }

        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: cleanReason, 
            results: flatProjects.filter(p => pIds.includes(p.ID)), 
            recommendedTalent: talentData.filter(t => tNames.includes(t.Name)) 
        }]);
    } catch (err) { 
        console.error("Fallo general en handleSend:", err);
        // AHORA EL CHAT MOSTRARÁ EL ERROR REAL PARA PODER ARREGLARLO
        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: `⚠️ Error del sistema: ${err.message}` 
        }]); 
    } finally { setIsTyping(false); }
  };

  const filteredTalent = useMemo(() => talentData.filter(p => (filterRole === 'All' || p.Role === filterRole)), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(t => t.Role))], [talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase tracking-widest animate-pulse">CARGANDO SISTEMA MRM...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#7D68F6]/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col items-start cursor-pointer pointer-events-auto" onClick={() => setActiveTab('landing')}>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
            <div className="mrm-sub-header text-[10px] text-[#7D68F6] mt-1 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col leading-[1.1] tracking-[-0.02em] font-normal uppercase">
                <span>BOGOTÁ</span>
                <span>CREATIVE</span>
                <span>CREDENTIALS</span>
            </div>
        </div>

        <div className="flex gap-4 items-center pointer-events-auto">
            {activeTab !== 'landing' && (
                <nav className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
                    {[ 
                      {id: 'chat', label: 'CONSULTORÍA IA', icon: <MessageSquare size={14}/>}, 
                      {id: 'projects', label: 'PROYECTOS', icon: <Briefcase size={14}/>}, 
                      {id: 'team', label: 'TALENTO', icon: <Users size={14}/>} 
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white' : 'hover:bg-white/10 text-white/40'}`}> {tab.icon} {tab.label} </button>
                    ))}
                </nav>
            )}
            <motion.div onClick={() => setShowSquadModal(true)} className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg shadow-[#7D68F6]/20" whileHover={{ scale: 1.05 }}>
                <span className="text-[10px] font-black uppercase tracking-widest">TU SQUAD ({squad.length})</span>
                <div className="flex -space-x-3">
                    {squad.slice(0, 4).map((p, idx) => (<img key={idx} src={p.ImageURL} className="w-8 h-8 rounded-full border-2 border-[#7D68F6] bg-black object-cover" alt="sq"/>))}
                </div>
            </motion.div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col pt-24">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-screen items-stretch overflow-hidden -mt-24">
                {[
                    { id: 'chat', title: 'CONSULTORÍA IA', img: '[https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200)', icon: <MessageSquare size={48}/> },
                    { id: 'projects', title: 'PROYECTOS', img: '[https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200)', icon: <Briefcase size={48}/> },
                    { id: 'team', title: 'TALENTO', img: '[https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200)', icon: <Users size={48}/> }
                ].map(card => (
                    <div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0">
                        <div className="absolute inset-0 z-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000" alt=""/></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-32">
                            <div className="mb-8 text-[#7D68F6]">{card.icon}</div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{card.title}</h2>
                        </div>
                    </div>
                ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-24 w-full px-6 flex flex-col h-[calc(100vh-100px)] pb-12 text-left">
                <div className="relative flex-1 mb-8 overflow-hidden">
                    <div ref={chatContainerRef} className="h-full overflow-y-auto pt-10 pb-4 flex flex-col gap-8 hide-scrollbar mask-fade-top scroll-smooth">
                        {chatHistory.map((msg, i) => (
                            <motion.div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[95%] p-6 px-8 rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                    <p className="whitespace-pre-wrap leading-relaxed opacity-90 font-normal normal-case">{msg.text}</p>
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <h5 className="text-[14px] font-normal uppercase tracking-[0.1em] text-[#7D68F6] mb-5">CREDENCIALES SUGERIDAS</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                                {msg.results.map((project, idx) => (
                                                    <div key={idx} onClick={() => setSelectedProject(project)} className="min-w-[280px] bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-2xl">
                                                        <div className="h-32 bg-zinc-900"><img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/></div>
                                                        <div className="p-5 text-left">
                                                            <h4 className="text-sm font-black uppercase mb-1">{project.Title}</h4>
                                                            <p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">VER DETALLES</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                        <div className="mt-6">
                                            <h5 className="text-[14px] font-normal uppercase tracking-[0.1em] text-[#7D68F6] mb-5">SQUAD RECOMENDADO</h5>
                                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                                {msg.recommendedTalent.map((t, idx) => (
                                                    <div key={idx} className="min-w-[170px] bg-black/40 p-5 rounded-[2rem] border border-white/5 text-center group">
                                                        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border border-white/10 group-hover:border-[#7D68F6]">
                                                            <img src={t.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt=""/>
                                                        </div>
                                                        <p className="text-[11px] font-black uppercase mb-2 truncate w-full">{t.Name}</p>
                                                        <div className="flex flex-wrap justify-center items-center gap-1.5 mb-4">
                                                            {t.skillsArray?.slice(0, 2).map((skill, sIdx) => (
                                                                <span key={sIdx} className="text-[7px] font-medium uppercase px-2 py-1 bg-white/10 text-white/70 rounded-full border border-white/10 whitespace-nowrap leading-none">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <button onClick={() => toggleSquad(t)} className={`w-full py-2 rounded-full text-[9px] font-black uppercase border border-[#7D68F6] transition-all ${squad.some(s => s.ID === t.ID) ? 'bg-[#7D68F6] text-white' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                                            {squad.some(s => s.ID === t.ID) ? 'EN SQUAD' : 'ADD SQUAD'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl p-4 px-6 rounded-full self-start">
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="w-2 h-2 bg-[#7D68F6] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D68F6]">ANALIZANDO...</span>
                          </motion.div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe tu necesidad al Gemini AI..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] transition-all text-[15px] min-h-[64px] backdrop-blur-md resize-none shadow-2xl font-normal normal-case" />
                    <button onClick={handleSend} disabled={isTyping} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all shadow-lg shadow-[#7D68F6]/20 disabled:opacity-50"><Send size={22}/></button>
                </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section key="projects" className="pt-48 px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {flatProjects.map((p, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setSelectedProject(p)} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all shadow-xl">
                        <div className="h-64 bg-black overflow-hidden relative"><img src={p.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                        <div className="p-8 text-left"><h4 className="text-xl font-black uppercase text-white mb-2">{p.Title}</h4><p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest">VER DETALLES <ChevronRight size={10} className="inline ml-1"/></p></div>
                    </motion.div>
                ))}
            </motion.section>
          )}

          {activeTab === 'team' && (
            <motion.section key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-16 items-start pt-48 px-12 max-w-7xl mx-auto pb-40 text-left">
                <aside className="w-64 sticky top-48 space-y-10">
                    <h3 className="text-[#7D68F6] text-[10px] font-black uppercase mrm-sub-header tracking-[0.4em]">FILTRAR ROL</h3>
                    <div className="flex flex-col gap-2">
                        {uniqueRoles.map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-md' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{role}</button>))}
                    </div>
                </aside>
                <div className="flex-1 text-left">
                    <h2 className="text-7xl font-black uppercase tracking-tighter leading-none mb-12">EQUIPO BOGOTÁ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalent.map((person, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center hover:border-[#7D68F6] transition-all group overflow-hidden flex flex-col shadow-lg">
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-transparent group-hover:border-[#7D68F6] shadow-xl bg-black"><img src={person.ImageURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt=""/></div>
                                <h4 className="text-[18px] font-black text-white uppercase mb-1 truncate w-full">{person.Name}</h4>
                                <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4 tracking-widest">{person.Role}</p>
                                <div className="flex flex-wrap justify-center items-center gap-2 mb-6 min-h-[40px]">
                                    {person.skillsArray?.slice(0, 3).map((skill, sIdx) => (
                                        <span key={sIdx} className="text-[9px] font-medium uppercase px-3 py-1.5 bg-white/10 text-white/70 rounded-full border border-white/10 whitespace-nowrap leading-none shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button onClick={() => toggleSquad(person)} className={`w-full py-3 rounded-full text-[10px] font-black uppercase border border-[#7D68F6] transition-all mt-auto ${squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}>
                                    {squad.some(p => p.ID === person.ID) ? 'EN SQUAD' : 'ADD TO SQUAD'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* --- DETALLE DE PROYECTO (LADO A LADO 70/30) --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-start justify-center p-6 backdrop-blur-2xl bg-black/80 pointer-events-auto overflow-y-auto">
            
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 backdrop-blur-md rounded-full hover:bg-white text-white hover:text-black transition-all shadow-2xl border border-white/10">
                <X size={24}/>
            </button>

            <div className="w-full max-w-[1600px] mx-auto my-12 flex flex-col lg:flex-row gap-8 pb-20 relative">
              
              {/* 1. TARJETA DEL PROYECTO (IZQUIERDA - 70%) */}
              <div className="w-full lg:w-[70%] flex-shrink-0 bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative text-left h-fit">
                
                {/* Carrusel */}
                <div className="relative h-[250px] md:h-[350px] w-full bg-zinc-950 overflow-hidden flex snap-x hide-scrollbar overflow-x-auto">
                  {selectedProject.images && selectedProject.images.length > 0 ? (
                      selectedProject.images.map((img, i) => (
                          <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-start opacity-70" alt="Slide" />
                      ))
                  ) : (
                      <div className="w-full h-full bg-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                </div>

                <div className="p-8 md:p-12 space-y-12">
                  
                  <div className="space-y-6 -mt-8 relative z-10">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-4 py-1.5 bg-[#7D68F6]/20 text-[#7D68F6] border border-[#7D68F6]/30 rounded-full tracking-widest">
                          {selectedProject.Category}
                      </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                      {selectedProject.Title}
                    </h2>

                    <p className="text-lg md:text-xl text-white/60 leading-relaxed font-normal normal-case max-w-3xl">
                      {selectedProject.Description || "Información detallada sobre el proyecto no disponible."}
                    </p>

                    {/* CHIPS GRISES */}
                    {selectedProject.tagsArray && selectedProject.tagsArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedProject.tagsArray.map((tag, idx) => (
                            <span key={idx} className="px-4 py-2 bg-[#1A1A1A] text-zinc-400 text-[10px] font-black rounded-full border border-[#333333] uppercase tracking-widest shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                    )}

                    {selectedProject.Link && (
                      <a href={selectedProject.Link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-white/30 group mt-4">
                        <Link2 size={16} className="text-[#7D68F6]" />
                        <span>Ver Material del Proyecto</span>
                        <ExternalLink size={14} className="opacity-40" />
                      </a>
                    )}
                  </div>

                  {/* Mosaico */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7D68F6]">GALERÍA VISUAL DE ACTIVOS</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map(i => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                              <img src={selectedProject.images[i] || selectedProject.images[0] || "[https://picsum.photos/600](https://picsum.photos/600)"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" alt="Mosaico"/>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 COLUMNAS DINÁMICAS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                    {[
                      { title: "LO PEDIDO", text: selectedProject.LoPedido },
                      { title: "LO HECHO", text: selectedProject.LoHecho },
                      { title: "LO LOGRADO", text: selectedProject.LoLogrado }
                    ].map((col, i) => (
                      <div key={i} className="space-y-4">
                        <h4 className="text-[12px] font-black tracking-[0.3em] text-[#7D68F6] uppercase">{col.title}</h4>
                        <p className="text-sm text-white/50 leading-relaxed font-normal normal-case">{col.text}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* 2. TARJETA DE TALENTO (DERECHA - 30%) */}
              <div className="w-full lg:w-[30%] flex-shrink-0 bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl text-left h-fit lg:sticky top-12 flex flex-col">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-8">TALENTO INVOLUCRADO</h4>
                
                {activeTeamTalent.length === 0 ? (
                    <div className="text-white/40 text-sm italic mb-10 pb-6 border-b border-white/5">
                        No se encontró talento asociado a este proyecto en la base de datos.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mb-10 max-h-[50vh] overflow-y-auto hide-scrollbar pr-2">
                      {activeTeamTalent.map(member => (
                        <div key={member.ID} className="flex items-center justify-between bg-black/40 p-5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group">
                          <div className="flex items-center gap-4">
                            <img src={member.ImageURL} className="w-12 h-12 rounded-full border border-white/10 object-cover" alt=""/>
                            <div>
                                <p className="font-black text-[13px] uppercase text-white truncate max-w-[120px]">{member.Name}</p>
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">{member.Role}</p>
                            </div>
                          </div>
                          
                          <button onClick={() => toggleSquad(member)} className={`p-3 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'border-white/10 text-white/30 hover:text-[#7D68F6] hover:border-[#7D68F6]'}`}>
                            {squad.some(s => s.ID === member.ID) ? <UserMinus size={16}/> : <UserPlus size={16}/>}
                          </button>
                        </div>
                      ))}
                    </div>
                )}

                <button 
                    onClick={toggleEntireTeam} 
                    disabled={activeTeamTalent.length === 0}
                    className={`w-full py-5 font-black uppercase tracking-[0.15em] text-[10px] rounded-full transition-all flex items-center justify-center gap-3 shadow-lg ${
                        activeTeamTalent.length === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10' :
                        isEntireTeamInSquad 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                        : 'bg-[#7D68F6] text-white hover:scale-105 shadow-[#7D68F6]/20'
                    }`}
                >
                    {isEntireTeamInSquad ? <UserMinus size={18}/> : <Users size={18}/>}
                    {isEntireTeamInSquad ? 'RETIRAR SQUAD COMPLETO' : 'AGREGAR SQUAD COMPLETO'}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSquadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/95 pointer-events-auto">
            <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-transform hover:rotate-90"><X size={48}/></button>
            <div className="w-full max-w-5xl">
              <input value={customProjectTitle} onChange={(e) => setCustomProjectTitle(e.target.value)} className="bg-transparent text-7xl font-black uppercase border-b-2 border-white/10 focus:border-[#7D68F6] outline-none w-full pb-6 mb-16 tracking-tighter leading-none" placeholder="NOMBRE DEL PROYECTO..."/>
              <div className="grid grid-cols-12 gap-20">
                <div className="col-span-5 bg-zinc-900/50 p-10 rounded-[3rem] border-l-4 border-[#7D68F6] text-left">
                  <p className="text-[#7D68F6] font-black uppercase tracking-widest text-[10px] mb-4 font-bold">ANÁLISIS DE SISTEMA</p>
                  <p className="text-white/60 leading-relaxed text-left font-normal normal-case">"Squad optimizado para ejecución estratégica en MRM Bogotá."</p>
                </div>
                <div className="col-span-7">
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em]">PARTICIPANTES SELECCIONADOS ({squad.length})</h4>
                  <div className="flex flex-wrap gap-6 mb-16 overflow-y-auto max-h-[300px] hide-scrollbar p-2">
                    {squad.map(p => (
                        <div key={p.ID} className="text-center group">
                            <img src={p.ImageURL} className="w-20 h-20 rounded-full border-2 border-white/5 group-hover:border-[#7D68F6] transition-all mb-3 shadow-2xl object-cover" alt=""/>
                            <p className="text-[10px] font-black uppercase">{p.Name.split(' ')[0]}</p>
                            <p className="text-[6px] text-[#7D68F6] font-bold uppercase truncate max-w-[80px]">{p.skillsArray?.slice(0, 2).join(' • ')}</p>
                        </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 py-6 bg-zinc-900 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl font-bold"><Mail size={16}/> FORMULARIO CONTACTO</button>
                    <button onClick={() => { const emails = squad.map(s => s.Email || '').join(';'); window.location.href = `mailto:${emails}?subject=Reunión Squad: ${customProjectTitle}`; }} className="flex-1 py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#7D68F6] hover:text-white transition-all shadow-2xl font-bold"><Calendar size={16}/> REUNIÓN TEAMS</button>
                  </div>
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
        <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-[120px] font-black uppercase tracking-tighter leading-none mb-4">MRM</h1>
            <p className="text-[14px] text-[#7D68F6] font-bold uppercase tracking-[0.5em] mb-12">BOGOTÁ CREATIVE CREDENTIALS</p>
            <button onClick={() => instance.loginRedirect()} className="bg-[#7D68F6] hover:bg-white hover:text-black transition-all duration-300 px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(125,104,246,0.3)]">INICIAR SESIÓN CON MICROSOFT</button>
        </div>
        <style>{`body, html { font-family: 'MW Sans', sans-serif !important; background-color: #0A0A0A !important; } h1, h2, h3, h4, .font-black { font-weight: 900 !important; font-style: normal !important; } * { font-style: normal !important; }`}</style>
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