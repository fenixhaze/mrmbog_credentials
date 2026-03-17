import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, Users, Briefcase, MessageSquare, ChevronRight, X, Calendar, UserPlus, UserMinus } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN AZURE ---
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // --- CARGA DE DATOS Y LIMPIEZA DE IDs ---
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          fetch('/datacenter/Talent_Database.csv'), 
          fetch('/datacenter/Projects_Database.csv') 
        ]);
        if (!tRes.ok || !pRes.ok) throw new Error("Archivos no encontrados");

        const talentCSV = await tRes.text();
        const rawTalent = Papa.parse(talentCSV, { 
            header: true, skipEmptyLines: true, delimiter: ";",
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;
        
        setTalentData(rawTalent.map(p => ({
            ...p,
            ID: String(p.ID || "").trim(), 
            Name: p.Name || "Staff",
            Role: p.Role || "Creativo",
            ImageURL: p.ImageURL || `https://ui-avatars.com/api/?name=${p.Name}&background=7D68F6&color=fff`
        })));

        const projectsCSV = await pRes.text();
        const rawProjects = Papa.parse(projectsCSV, { 
            header: true, skipEmptyLines: true, delimiter: ";",
            transformHeader: h => h.trim().replace(/^[\u200B\uFEFF]/, '') 
        }).data;
        
        setFlatProjects(rawProjects.map(p => ({
            ...p,
            ID: String(p.ID || "").trim(),
            Title: p.Title || "Proyecto",
            images: p.ImageURLs ? String(p.ImageURLs).split(',').map(i => i.trim()) : ["https://picsum.photos/1200/800"],
            // Vinculación por ID: separamos y limpiamos
            teamArray: String(p.TeamsIDs || "").split(/[;,]+/).map(id => id.trim()).filter(Boolean),
            Category: p.Category || "Campaign",
            Description: p.Description || "", LoPedido: p.LoPedido || "", LoHecho: p.LoHecho || "", LoLogrado: p.LoLogrado || ""
        })));

        setChatHistory([{ type: 'ai', text: `Sistema MRM Bogotá activo. Datacenter de Credenciales y Talento sincronizado.` }]);
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  // --- LÓGICA IA: SEPARACIÓN DE CONCEPTOS ---
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

        // Contexto separado para que la IA no se confunda
        const proyectosContext = flatProjects.slice(0, 15).map(p => `PROYECTO: ${p.Title} (ID:${p.ID}) - Tags: ${p.tags}`).join("\n");
        const talentoContext = talentData.slice(0, 15).map(t => `PERSONA: ${t.Name} (Rol:${t.Role}) - Skills: ${t.Tags}`).join("\n");

        const prompt = `Eres el Staffing Manager de MRM Bogotá.
        [BASE DE DATOS: PROYECTOS HISTÓRICOS]
        ${proyectosContext}

        [BASE DE DATOS: TALENTO DISPONIBLE]
        ${talentoContext}

        REGLAS:
        1. Analiza qué proyectos coinciden con la búsqueda.
        2. Selecciona a las personas que mejor encajan (MÁXIMO 4).
        3. Responde SOLO en este formato JSON: {"match_ids":["ID_PROYECTO"], "talent_names":["NOMBRE_PERSONA"], "reason":"Tu explicación breve"}
        
        PREGUNTA: "${userMsg}"`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const rawRes = data.candidates[0].content.parts[0].text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawRes);

        setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: parsed.reason, 
            results: flatProjects.filter(p => parsed.match_ids?.includes(p.ID)), 
            recommendedTalent: talentData.filter(t => parsed.talent_names?.includes(t.Name)).slice(0, 4) // Límite de 4
        }]);

    } catch (err) { setChatHistory(prev => [...prev, { type: 'ai', text: `⚠️ Error: La IA no pudo procesar los datos.` }]); } 
    finally { setIsTyping(false); }
  };

  const toggleSquad = (p) => setSquad(prev => prev.some(x => x.ID === p.ID) ? prev.filter(x => x.ID !== p.ID) : [...prev, p]);
  
  // MATCHING DE TALENTO PARA EL MODAL (Solución al 30%)
  const activeTeamTalent = useMemo(() => {
    if (!selectedProject) return [];
    // Comparamos los IDs del proyecto con los del talento, asegurando limpieza de strings
    return talentData.filter(t => selectedProject.teamArray.includes(String(t.ID).trim()));
  }, [selectedProject, talentData]);

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase animate-pulse">Sincronizando MRM...</div>;

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
        <div onClick={() => setShowSquadModal(true)} className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg pointer-events-auto uppercase text-[10px] font-black hover:scale-105 transition-all">SQUAD ({squad.length})</div>
      </header>

      <main className="relative z-10 min-h-screen pt-24 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' || activeTab === 'landing' ? (
            <section className="max-w-4xl mx-auto pt-24 w-full px-6 flex flex-col h-[calc(100vh-100px)] text-left">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-8 hide-scrollbar pb-8">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[95%] p-6 px-8 rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6]' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
                                <p className="whitespace-pre-wrap leading-relaxed opacity-90 normal-case mb-6">{msg.text}</p>
                                
                                {/* PROYECTOS EN EL CHAT */}
                                {msg.results && msg.results.length > 0 && (
                                    <div className="mb-6 flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                        {msg.results.map((p, idx) => (
                                            <div key={idx} onClick={() => setSelectedProject(p)} className="min-w-[240px] bg-black/40 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-[#7D68F6] transition-all">
                                                <img src={p.images[0]} className="h-28 w-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/>
                                                <div className="p-4 text-left"><h4 className="text-[11px] font-black uppercase mb-1 truncate text-white">{p.Title}</h4><p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">VER DETALLES</p></div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* PERSONAS EN EL CHAT (ORDENADAS MAX 4) */}
                                {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-5 border-t border-white/10">
                                        {msg.recommendedTalent.map((t, idx) => (
                                            <div key={idx} className="bg-black/40 p-3 pr-5 rounded-full border border-white/5 flex items-center justify-between group transition-all">
                                                <div className="flex items-center gap-4 text-left">
                                                    <img src={t.ImageURL} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt=""/>
                                                    <div><p className="text-[10px] font-black uppercase text-white leading-none mb-1">{t.Name}</p><p className="text-[8px] text-[#7D68F6] font-bold uppercase">{t.Role}</p></div>
                                                </div>
                                                <button onClick={() => toggleSquad(t)} className={`p-2 rounded-full border transition-all ${squad.some(s => s.ID === t.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white shadow-lg' : 'border-white/10 text-white/40 hover:text-white hover:border-white'}`}>
                                                    {squad.some(s => s.ID === t.ID) ? <UserMinus size={12}/> : <UserPlus size={12}/>}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Pídele a la IA armar un squad..." className="flex-1 bg-white/5 border border-white/20 rounded-[2.5rem] py-5 px-8 outline-none focus:border-[#7D68F6] text-[15px] min-h-[64px] backdrop-blur-md resize-none" />
                    <button onClick={handleSend} disabled={isTyping} className="bg-[#7D68F6] w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-lg hover:scale-105 disabled:opacity-50"><Send size={22}/></button>
                </div>
            </section>
          ) : null}
        </AnimatePresence>
      </main>

      {/* MODAL 70/30: PROYECTO + TALENTO INVOLUCRADO */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-start justify-center p-6 backdrop-blur-2xl bg-black/95 overflow-y-auto">
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 rounded-full hover:bg-white text-white hover:text-black transition-all border border-white/10 shadow-2xl"><X size={24}/></button>
            <div className="w-full max-w-[1600px] mx-auto my-12 flex flex-col lg:flex-row gap-8 pb-20 text-left">
              
              {/* 70%: INFO DEL PROYECTO */}
              <div className="w-full lg:w-[70%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="relative h-[450px] w-full bg-zinc-950 flex overflow-x-auto snap-x hide-scrollbar">
                  {selectedProject.images.map((img, i) => (<img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-start opacity-70" alt="Slide" />))}
                </div>
                <div className="p-16 space-y-12">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase px-4 py-1.5 bg-[#7D68F6]/20 text-[#7D68F6] border border-[#7D68F6]/30 rounded-full tracking-widest">{selectedProject.Category}</span>
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white leading-none">{selectedProject.Title}</h2>
                    <p className="text-xl text-white/60 normal-case leading-relaxed font-normal">{selectedProject.Description}</p>
                  </div>
                  
                  {/* COLUMNAS DE EJECUCIÓN RECUPERADAS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    {[{t: "LO PEDIDO", d: selectedProject.LoPedido}, {t: "LO HECHO", d: selectedProject.LoHecho}, {t: "LO LOGRADO", d: selectedProject.LoLogrado}].map((col, i) => (
                      <div key={i} className="space-y-4">
                        <h4 className="text-[12px] font-black tracking-[0.4em] text-[#7D68F6] uppercase">{col.t}</h4>
                        <p className="text-sm text-white/50 leading-relaxed font-normal">{col.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 30%: TALENTO VINCULADO POR ID */}
              <div className="w-full lg:w-[30%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-10 shadow-2xl h-fit lg:sticky top-12 flex flex-col">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-8 text-left">TALENTO DEL PROYECTO</h4>
                <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {activeTeamTalent.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                        <p className="text-white/20 text-xs italic">IDs de talento no vinculados en este proyecto.</p>
                    </div>
                  ) : activeTeamTalent.map(member => (
                    <div key={member.ID} className="flex items-center justify-between bg-black/40 p-5 rounded-3xl border border-white/5 group transition-all hover:border-[#7D68F6]">
                      <div className="flex items-center gap-4 text-left">
                        <img src={member.ImageURL} className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt=""/>
                        <div><p className="font-black text-[13px] uppercase text-white truncate max-w-[120px] leading-tight">{member.Name}</p><p className="text-[9px] text-[#7D68F6] font-black uppercase tracking-tighter">{member.Role}</p></div>
                      </div>
                      <button onClick={() => toggleSquad(member)} className={`p-3 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'text-white/30 border-white/10 hover:text-white hover:border-[#7D68F6]'}`}>
                        {squad.some(s => s.ID === member.ID) ? <UserMinus size={16}/> : <UserPlus size={16}/>}
                      </button>
                    </div>
                  ))}
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

export default function App() { return (<MsalProvider instance={msalInstance}><AuthenticatedTemplate><MainContent /></AuthenticatedTemplate><UnauthenticatedTemplate><div className="h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white"><h1 className="text-[120px] font-black uppercase tracking-tighter leading-none mb-12">MRM</h1><button onClick={() => msalInstance.loginRedirect()} className="bg-[#7D68F6] px-14 py-6 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_0_60px_rgba(125,104,246,0.3)] tracking-widest">INICIAR SESIÓN CON MICROSOFT</button></div></UnauthenticatedTemplate></MsalProvider>); }