import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Briefcase, MessageSquare, ChevronRight, X, Calendar, UserPlus, UserMinus } from 'lucide-react';
import Papa from 'papaparse';

// --- CONFIGURACIÓN AZURE MSAL ---
const authConfig = {
  auth: {
    clientId: "23d1168d-113b-48c0-a4fe-6e6d743f77af",
    authority: "https://login.microsoftonline.com/d026e4c1-5892-497a-b9da-ee493c9f0364",
    redirectUri: "https://fenixhaze.github.io/mrmbog_credentials/",
  },
  cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
};

const msalInstance = new PublicClientApplication(authConfig);

const translations = {
  es: {
    loading: "Cargando Staffing Engine...",
    subtitle: "CREDENCIALES CREATIVAS BOGOTÁ",
    loginBtn: "INICIAR SESIÓN CON MICROSOFT",
    nav: { chat: "BÚSQUEDA AVANZADA", projects: "PROYECTOS", team: "TALENTO" },
    squad: "SQUAD",
    landing: { chat: "BÚSQUEDA AVANZADA", projects: "PROYECTOS", team: "TALENTO" },
    chat: {
      welcome: "Sistema MRM Bogotá activo. Búsqueda avanzada lista para ayudarte a encontrar el talento correcto.",
      placeholder: "Describe tu necesidad de staffing...",
      analyzing: "analizando datacenter...",
      viewCredential: "VER CREDENCIAL",
      error: "⚠️ Error de análisis en Gemini 2.5."
    },
    team: {
      filter: "FILTRAR ROL",
      title: "EQUIPO BOGOTÁ",
      inSquad: "EN SQUAD",
      addSquad: "AGREGAR AL SQUAD",
      all: "Todos"
    },
    projectModal: {
      category: "Categoría",
      loPedido: "LO PEDIDO",
      loHecho: "LO HECHO",
      loLogrado: "LO LOGRADO",
      talentInvolved: "TALENTO INVOLUCRADO",
      noTalent: "No se encontró talento asociado.",
      removeSquad: "RETIRAR SQUAD COMPLETO",
      addSquad: "AGREGAR SQUAD COMPLETO",
      viewCredential: "VER CREDENCIAL"
    },
    talentModal: {
      skills: "HABILIDADES Y EXPERIENCIA",
      remove: "RETIRAR DEL SQUAD",
      add: "AÑADIR AL SQUAD"
    },
    squadModal: {
      defaultTitle: "NUEVO PROYECTO MRM",
      titlePlaceholder: "NOMBRE DEL PROYECTO...",
      analysis: "ANÁLISIS DE SISTEMA",
      analysisQuote: '"Squad optimizado para ejecución estratégica en MRM Bogotá."',
      selected: "PARTICIPANTES SELECCIONADOS",
      teamsBtn: "COORDINAR REUNIÓN TEAMS"
    }
  },
  en: {
    loading: "Loading Staffing Engine...",
    subtitle: "BOGOTÁ CREATIVE CREDENTIALS",
    loginBtn: "SIGN IN WITH MICROSOFT",
    nav: { chat: "ADVANCED SEARCH", projects: "PROJECTS", team: "TALENT" },
    squad: "SQUAD",
    landing: { chat: "ADVANCED SEARCH", projects: "PROJECTS", team: "TALENT" },
    chat: {
      welcome: "MRM Bogotá system active. Advanced search is ready to help you find the right talent.",
      placeholder: "Describe your staffing need...",
      analyzing: "analyzing datacenter...",
      viewCredential: "VIEW CREDENTIAL",
      error: "⚠️ Gemini 2.5 analysis error."
    },
    team: { filter: "FILTER ROLE", title: "BOGOTÁ TEAM", inSquad: "IN SQUAD", addSquad: "ADD TO SQUAD", all: "All" },
    projectModal: { category: "Category", loPedido: "THE ASK", loHecho: "THE WORK", loLogrado: "THE RESULT", talentInvolved: "INVOLVED TALENT", noTalent: "No associated talent found.", removeSquad: "REMOVE FULL SQUAD", addSquad: "ADD FULL SQUAD", viewCredential: "VIEW CREDENTIAL" },
    talentModal: { skills: "SKILLS AND EXPERIENCE", remove: "REMOVE FROM SQUAD", add: "ADD TO SQUAD" },
    squadModal: { defaultTitle: "NEW MRM PROJECT", titlePlaceholder: "PROJECT NAME...", analysis: "SYSTEM ANALYSIS", analysisQuote: '"Squad optimized for strategic execution at MRM Bogotá."', selected: "SELECTED PARTICIPANTS", teamsBtn: "COORDINATE TEAMS MEETING" }
  }
};

const contentTranslations = {
  projects: {
    P01: {
      en: {
        Title: "Nike Refresh 2024",
        Description: "Complete redesign of the user experience for the e-commerce platform across Latam."
      }
    },
    P02: {
      en: {
        Title: "Coca-Cola Summer",
        Description: "Animated content campaign for giant screens and social media during the summer."
      }
    },
    P03: {
      en: {
        Title: "Mastercard Security",
        Description: "Case study-style video production showcasing new biometric security layers."
      }
    },
    P04: {
      en: {
        Title: "Lego Builder Ads",
        Description: "Interactive rich media banner set for the Technic line launch."
      }
    },
    P05: {
      en: {
        Title: "Spotify Wrapped Local",
        Description: "Adaptation of the Wrapped campaign for digital billboards in Bogotá and Medellín."
      }
    },
    P06: {
      en: {
        Title: "Nestlé Smart Data",
        Description: "Interactive dashboard and consumer data visualization for decision making."
      }
    },
    P07: {
      en: {
        Title: "IKEA Welcome Home",
        Description: "Automated loyalty strategy with dynamic email design."
      }
    },
    P08: {
      en: {
        Title: "P&G Global Pitch",
        Description: "Visual narrative design and decks for the global pitch of personal care accounts."
      }
    },
    P09: {
      en: {
        Title: "AI Workflow 1.0",
        Description: "Implementation of generative AI tools for campaign asset creation."
      }
    }
  }
};
const DEFAULT_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&auto=format&fit=crop&q=80'
];

function MainContent({ language, setLanguage, t }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [rawTalentData, setRawTalentData] = useState([]);
  const [rawFlatProjects, setRawFlatProjects] = useState([]);
  const [talentData, setTalentData] = useState([]);
  const [flatProjects, setFlatProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [squad, setSquad] = useState([]);
  const [filterRole, setFilterRole] = useState('All');

  const chatContainerRef = useRef(null);

  const shuffleArray = (arr) => {
    if (!Array.isArray(arr)) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  useEffect(() => {
    const loadRawData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const [tRes, pRes] = await Promise.all([
          fetch(`${baseUrl}datacenter/Talent_Database.csv`),
          fetch(`${baseUrl}datacenter/Projects_Database.csv`)
        ]);

        if (!tRes.ok || !pRes.ok) throw new Error('Archivos CSV no encontrados');

        const talentCSV = await tRes.text();
        const parsedTalent = Papa.parse(talentCSV, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
          transformHeader: (h) => h.trim().replace(/^[\u200B\uFEFF]/, '')
        }).data;
        setRawTalentData(parsedTalent);

        const projectsCSV = await pRes.text();
        const parsedProjects = Papa.parse(projectsCSV, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
          transformHeader: (h) => h.trim().replace(/^[\u200B\uFEFF]/, '')
        }).data;
        setRawFlatProjects(parsedProjects);
      } catch (e) {
        console.error('Error loading raw CSV data:', e);
        setLoading(false);
      }
    };

    loadRawData();
  }, []);

  useEffect(() => {
    if (rawTalentData.length === 0 || rawFlatProjects.length === 0) return;

    const normalizedTalent = rawTalentData.map(item => ({
      ...item,
      skillsArray: item.Tags ? item.Tags.split(/[;,]+/).map(skill => skill.trim()).filter(Boolean) : []
    }));

    const normalizedProjects = rawFlatProjects.map(item => {
      const projectTranslation = contentTranslations.projects[item.ID]?.[language] || {};
      const rawImgs = item.ImageURLs ? item.ImageURLs.split(',').map(src => src.trim()).filter(Boolean) : [];
      let imgs = rawImgs.slice();
      if (!imgs || imgs.length === 0) {
        imgs = DEFAULT_PROJECT_IMAGES.slice(0, 3).map((u, idx) => `${u}&sig=${encodeURIComponent(item.ID)}&idx=${idx}`);
      } else if (imgs.length === 1) {
        imgs = imgs.concat(DEFAULT_PROJECT_IMAGES.slice(0, 2).map((u, idx) => `${u}&sig=${encodeURIComponent(item.ID)}&idx=${idx}`));
      }
      shuffleArray(imgs);
      return {
        ...item,
        Title: language === 'en' ? projectTranslation.Title || item.Title : item.Title,
        Description: language === 'en' ? projectTranslation.Description || item.Description : item.Description,
        images: imgs,
        tagsArray: item.Tags ? item.Tags.split(/[;,]+/).map(tag => tag.trim()).filter(Boolean) : [],
        teamArray: item.TeamIDs ? item.TeamIDs.split(/[;,]+/).map(id => id.trim()).filter(Boolean) : [] // Correct TeamIDs bridge
      };
    });

    setTalentData(normalizedTalent);
    setFlatProjects(normalizedProjects);
    setLoading(false);
    setChatHistory([{ type: 'ai', text: t.chat.welcome }]);
  }, [rawTalentData, rawFlatProjects, t, language]);

  useEffect(() => {
    if (selectedProject) {
      const refreshedProject = flatProjects.find(p => p.ID === selectedProject.ID);
      if (refreshedProject && refreshedProject !== selectedProject) {
        setSelectedProject(refreshedProject);
      }
    }

    if (selectedTalent) {
      const refreshedTalent = talentData.find(talent => talent.ID === selectedTalent.ID);
      if (refreshedTalent && refreshedTalent !== selectedTalent) {
        setSelectedTalent(refreshedTalent);
      }
    }
  }, [flatProjects, talentData, selectedProject, selectedTalent]);

  useEffect(() => {
    if (!selectedProject) return;
    if (!Array.isArray(selectedProject.tagsArray) || selectedProject.tagsArray.length === 0) {
      setSelectedProject(normalizeProjectTags(selectedProject));
    }
  }, [selectedProject]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const MODEL = 'gemini-2.5-flash';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

      const pBrief = flatProjects.slice(0, 15).map(p => `ID_PROYECTO: ${p.ID} | Título: ${p.Title} | Tags: ${p.tagsArray.join(', ')}`).join('\n');
      const tBrief = talentData.slice(0, 15).map(tItem => `Nombre: ${tItem.Name} | Rol: ${tItem.Role} | Skills: ${tItem.skillsArray.join(', ')}`).join('\n');

      const systemPrompt = language === 'es'
        ? `Eres el Asistente de Staffing de MRM Bogotá.\nDistingue estrictamente entre P-IDs (Proyectos) y T-IDs (Talento).\nREGLAS ESTRICTAS:\n1. Devuelve MÁXIMO 4 talent_names en un grid de 2 columnas.\n2. En "match_ids", debes devolver SOLO los códigos exactos de ID_PROYECTO (ej. "P001").\n3. Responde SOLO en este formato JSON: {"match_ids":["P###"], "talent_names":["NOMBRE"], "reason":"explicación en ESPAÑOL"}`
        : `You are the Staffing Assistant for MRM Bogotá.\nStrictly distinguish between P-IDs (Projects) and T-IDs (Talent).\nSTRICT RULES:\n1. Return MAXIMUM 4 talent_names in a 2-column grid.\n2. In "match_ids", you must return ONLY the exact PROJECT_IDs (e.g., "P001").\n3. Respond ONLY in this JSON format: {"match_ids":["P###"], "talent_names":["NAME"], "reason":"explanation in ENGLISH"}`;

      const prompt = `${systemPrompt}\n\n[PROYECTOS DISPONIBLES]\n${pBrief}\n\n[TALENTO DISPONIBLE]\n${tBrief}\n\nUSUARIO: "${userMsg}"`;

      // If API key missing, skip remote call and use a local fallback matcher
      const localFallback = (query) => {
        const q = (query || '').toLowerCase();
        const tokens = q.split(/\W+/).filter(Boolean);

        const talentScores = talentData.map(t => {
          const hay = ((t.Name || '') + ' ' + (t.Role || '') + ' ' + (t.skillsArray || []).join(' ')).toLowerCase();
          let score = 0;
          tokens.forEach(tok => { if (hay.includes(tok)) score += 2; });
          return { talent: t, score };
        }).filter(s => s.score > 0).sort((a,b) => b.score - a.score).map(s => s.talent).slice(0,4);

        const projectScores = flatProjects.map(p => {
          const hay = ((p.Title || '') + ' ' + (p.tagsArray || []).join(' ') + ' ' + (p.Description || '')).toLowerCase();
          let score = 0;
          tokens.forEach(tok => { if (hay.includes(tok)) score += 1; });
          return { project: p, score };
        }).filter(s => s.score > 0).sort((a,b) => b.score - a.score).map(s => s.project).slice(0,3);

        return {
          match_ids: projectScores.map(p => p.ID),
          recommendedTalent: talentScores,
          results: projectScores,
          reason: language === 'es' ? 'Motor local: coincidencias por palabras clave en habilidades/roles/tags.' : 'Local fallback: matched by keywords in skills/roles/tags.'
        };
      };

      if (!KEY || typeof KEY !== 'string' || KEY.trim() === '') {
        console.warn('Gemini API key missing. Using local fallback.');
        const fallback = localFallback(userMsg);
        setChatHistory(prev => [...prev, { type: 'ai', text: fallback.reason, results: fallback.results, recommendedTalent: fallback.recommendedTalent }]);
        setIsTyping(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        // capture response body for better diagnostics
        let respText = null;
        try { respText = await response.text(); } catch (e) { respText = null; }

        // On 403/401/429 use local fallback so UX remains functional
        if ([401, 403, 429].includes(response.status)) {
          console.warn('Gemini API returned status', response.status, 'body:', respText, '— falling back to local matcher');
          const fallback = localFallback(userMsg);
          const detail = respText ? ` Detalle: ${respText}` : '';
          const reason = `${language === 'es' ? 'Gemini 2.5: error' : 'Gemini 2.5 error'} ${response.status}.${detail} ${language === 'es' ? 'Usando motor local de respaldo.' : 'Using local fallback.'}`;
          setChatHistory(prev => [...prev, { type: 'ai', text: reason, results: fallback.results, recommendedTalent: fallback.recommendedTalent }]);
          setIsTyping(false);
          return;
        }
        throw new Error(`API request failed with status ${response.status} ${respText || ''}`);
      }

      const data = await response.json();

      // Helper: recursively search the response for a JSON-like string
      const findJSONString = (obj) => {
        const seen = new Set();
        const stack = [obj];
        while (stack.length) {
          const cur = stack.pop();
          if (!cur || seen.has(cur)) continue;
          seen.add(cur);

          if (typeof cur === 'string') {
            const candidate = cur.replace(/```json/gi, '').replace(/```/g, '').trim();
            if (candidate.startsWith('{') && candidate.includes('match_ids')) return candidate;
          } else if (Array.isArray(cur)) {
            for (const item of cur) stack.push(item);
          } else if (typeof cur === 'object') {
            for (const k of Object.keys(cur)) stack.push(cur[k]);
          }
        }
        return null;
      };

      // Common path used by the API
      let rawRes = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawRes) rawRes = findJSONString(data);
      if (!rawRes) {
        throw new Error('Invalid API response structure');
      }

      rawRes = rawRes.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(rawRes);

      setChatHistory(prev => [...prev, {
        type: 'ai',
        text: parsed.reason,
        results: flatProjects.filter(p => parsed.match_ids?.includes(p.ID)),
        recommendedTalent: talentData.filter(tItem => parsed.talent_names?.includes(tItem.Name)).slice(0, 4)
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { type: 'ai', text: t.chat.error + (err.message || '') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const normalizeProjectTags = (project) => ({
    ...project,
    tagsArray: Array.isArray(project.tagsArray)
      ? project.tagsArray
      : project.Tags
        ? project.Tags.split(/[;,]+/).map(tag => tag.trim()).filter(Boolean)
        : []
  });

  const toggleSquad = (item) => setSquad(prev => prev.some(x => x.ID === item.ID) ? prev.filter(x => x.ID !== item.ID) : [...prev, item]);

  const activeTeamTalent = useMemo(() => {
    if (!selectedProject) return [];
    return talentData.filter(member => selectedProject.teamArray.includes(member.ID));
  }, [selectedProject, talentData]);

  const filteredTalent = useMemo(() => talentData.filter(person => filterRole === 'All' || person.Role === filterRole), [talentData, filterRole]);
  const uniqueRoles = useMemo(() => ['All', ...new Set(talentData.map(person => person.Role))], [talentData]);

  const projectModalTags = selectedProject
    ? (Array.isArray(selectedProject.tagsArray)
      ? selectedProject.tagsArray
      : (selectedProject.Tags ? selectedProject.Tags.split(/[;,]+/).map(tag => tag.trim()).filter(Boolean) : []))
    : [];

  if (loading) return <div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase animate-pulse">{t.loading}</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden selection:bg-[#7D68F6]/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />

      <header className="fixed top-0 left-0 w-full p-10 px-12 z-[100] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col items-start cursor-pointer pointer-events-auto" onClick={() => setActiveTab('landing')}>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
          <div className="text-[10px] text-[#7D68F6] mt-1 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col uppercase font-bold tracking-widest">
            <span>BOGOTÁ</span><span>CREATIVE</span><span>CREDENTIALS</span>
          </div>
        </div>
        <div className="flex gap-4 items-center pointer-events-auto">
          <div className="flex items-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full p-1">
            {['es', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${language === lang ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          {activeTab !== 'landing' && (
            <nav className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl mr-4">
              {[{ id: 'chat', label: t.nav.chat, icon: <MessageSquare size={14} /> }, { id: 'projects', label: t.nav.projects, icon: <Briefcase size={14} /> }, { id: 'team', label: t.nav.team, icon: <Users size={14} /> }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
          <div className="bg-[#7D68F6] px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg uppercase text-[10px] font-black hover:scale-105 transition-all" onClick={() => setSelectedProject(null)}>
            {t.squad} ({squad.length})
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen pt-24 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen items-stretch -mt-24">
              {[{ id: 'chat', title: t.landing.chat, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' }, { id: 'projects', title: t.landing.projects, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' }, { id: 'team', title: t.landing.team, img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200' }].map(card => (
                <div key={card.id} onClick={() => setActiveTab(card.id)} className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0">
                  <div className="absolute inset-0 bg-black"><img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all" alt="" /></div>
                  <div className="relative z-10 h-full flex flex-col justify-end p-16 pb-32 text-left">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none group-hover:text-[#7D68F6] transition-colors">{card.title}</h2>
                  </div>
                </div>
              ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <section className="max-w-4xl mx-auto pt-4 w-full px-6 flex flex-col h-[calc(100vh-120px)] text-left">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-4 hide-scrollbar pb-4 px-2 -mx-2">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[95%] rounded-[2rem] border ${msg.type === 'user' ? 'bg-[#7D68F6] border-[#7D68F6] px-6' : 'bg-white/5 border-white/10 backdrop-blur-xl px-6'}`}>
                      <div className="min-h-[64px] flex items-center">
                        <p className={`whitespace-pre-wrap leading-normal opacity-90 normal-case m-0 text-[15px]`}>{msg.text}</p>
                      </div>

                      {msg.results && msg.results.length > 0 && (
                        <div className="mb-6 flex gap-4 overflow-x-auto hide-scrollbar pb-4 pt-2 px-4 -mx-4">
                          {msg.results.map((p, idx) => (
                            <div key={idx} onClick={() => setSelectedProject(normalizeProjectTags(p))} className="min-w-[280px] bg-black/40 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[#7D68F6] transition-all">
                              <img src={p.images[0]} className="h-28 w-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                              <div className="p-5 text-left">
                                <h4 className="text-[12px] font-black uppercase mb-2 truncate text-white">{p.Title}</h4>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {p.tagsArray.slice(0, 2).map((tag, tIdx) => (
                                    <span key={tIdx} className="inline-flex items-center px-2 py-1 bg-white/10 rounded text-[8px] font-black uppercase tracking-widest text-zinc-300">{tag}</span>
                                  ))}
                                </div>
                                <p className="text-[10px] text-white/50 line-clamp-2 mb-6 normal-case font-normal leading-relaxed">{p.Description}</p>
                                <p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">{t.chat.viewCredential}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-5 border-t border-white/10 p-2 -mx-2">
                          {msg.recommendedTalent.map((talent, idx) => (
                            <div key={idx} onClick={() => setSelectedTalent(talent)} className="bg-black/40 p-3 pr-5 rounded-full border border-white/5 flex items-center justify-between group cursor-pointer transition-all hover:ring-2 hover:ring-[#7D68F6]">
                              <div className="flex items-center gap-4 text-left">
                                <img src={talent.ImageURL} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-white leading-none mb-1">{talent.Name}</p>
                                  <p className="text-[8px] text-[#7D68F6] font-bold uppercase">{talent.Role}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSquad(talent); }}
                                title={squad.some(s => s.ID === talent.ID) ? t.talentModal.remove : t.talentModal.add}
                                className={`p-2 rounded-full border transition-all ${squad.some(s => s.ID === talent.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white shadow-lg' : 'border-white/10 text-white/40 hover:text-white'}`}
                              >
                                {squad.some(s => s.ID === talent.ID) ? <UserMinus size={12} /> : <UserPlus size={12} />}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 items-center pt-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={t.chat.placeholder}
                  className="flex-1 bg-white/5 border border-white/20 rounded-[2rem] py-3 px-6 outline-none focus:border-[#7D68F6] text-[15px] min-h-[56px] leading-relaxed backdrop-blur-md resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className="bg-[#7D68F6] w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg hover:scale-105 disabled:opacity-50 transition-all flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section className="pt-48 px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-2 -mx-2">
              {flatProjects.map((project, i) => (
                <div key={i} onClick={() => setSelectedProject(normalizeProjectTags(project))} className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[#7D68F6] text-left transition-all shadow-xl flex flex-col">
                  <div className="h-64 bg-black overflow-hidden relative"><img src={project.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" /></div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-xl font-black uppercase text-white mb-4">{project.Title}</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tagsArray.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-zinc-400">{tag}</span>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/50 line-clamp-2 mb-8 normal-case font-normal leading-relaxed">{project.Description}</p>
                    <p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest mt-auto">{t.projectModal.viewCredential} <ChevronRight size={10} className="inline ml-1" /></p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'team' && (
            <section className="flex gap-16 pt-48 px-12 max-w-7xl mx-auto pb-40 text-left">
              <aside className="w-64 sticky top-48 flex flex-col gap-2">
                <h3 className="text-[#7D68F6] text-[10px] font-black uppercase mb-8 tracking-widest">{t.team.filter}</h3>
                {uniqueRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`flex items-center text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                    {role === 'All' ? t.team.all : role}
                  </button>
                ))}
              </aside>
              <div className="flex-1">
                <h2 className="text-7xl font-black uppercase tracking-tighter mb-12 text-white leading-none">{t.team.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 -mx-2">
                  {filteredTalent.map((person, i) => (
                    <div key={i} onClick={() => setSelectedTalent(person)} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center flex flex-col group cursor-pointer transition-all hover:ring-2 hover:ring-[#7D68F6]">
                      <img src={person.ImageURL} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale transition-all border-4 border-transparent group-hover:border-[#7D68F6] bg-black shadow-lg" alt="" />
                      <h4 className="text-[18px] font-black uppercase truncate w-full text-white">{person.Name}</h4>
                      <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4 tracking-widest">{person.Role}</p>
                      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                        {person.skillsArray.slice(0, 2).map((skill, sIdx) => (
                          <span key={sIdx} className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black uppercase tracking-widest text-zinc-400">{skill}</span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSquad(person); }}
                        className={`w-full py-3 rounded-full flex items-center justify-center text-[10px] font-black uppercase border border-[#7D68F6] mt-auto transition-all ${squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10'}`}
                      >
                        {squad.some(p => p.ID === person.ID) ? t.team.inSquad : t.team.addSquad}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-start justify-center p-6 backdrop-blur-2xl bg-black/95 overflow-y-auto">
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 rounded-full flex items-center justify-center hover:bg-white text-white hover:text-black transition-all border border-white/10 shadow-2xl"><X size={24} /></button>
            <div className="w-full max-w-[1600px] mx-auto my-12 flex flex-col lg:flex-row gap-8 pb-20 text-left relative">

              <div className="w-full lg:w-[70%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl h-fit">
                <div className="relative h-[450px] w-full bg-zinc-950 overflow-hidden">
                  <img src={selectedProject.images[0]} className="w-full h-full object-cover opacity-70" alt="Project cover" />
                </div>
                <div className="p-16 space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white leading-none">{selectedProject.Title}</h2>
                    <p className="text-xl text-white/60 normal-case leading-relaxed font-normal">{selectedProject.Description}</p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {projectModalTags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">{tag}</span>
                      ))}
                    </div>
                    {selectedProject.images.length > 1 && (
                      <div className="flex gap-4 overflow-x-auto hide-scrollbar pt-6 pb-2 -mx-2 px-2">
                        {selectedProject.images.slice(1).map((img, idx) => (
                          <img key={idx} src={img} className="h-40 w-64 object-cover rounded-2xl flex-shrink-0 border border-white/10 hover:border-[#7D68F6] transition-all" alt="Gallery image" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    {[{ label: t.projectModal.loPedido, d: selectedProject.LoPedido }, { label: t.projectModal.loHecho, d: selectedProject.LoHecho }, { label: t.projectModal.loLogrado, d: selectedProject.LoLogrado }].map((col, index) => (
                      <div key={index} className="space-y-4">
                        <h4 className="text-[12px] font-black tracking-[0.4em] text-[#7D68F6] uppercase">{col.label}</h4>
                        <p className="text-sm text-white/50 leading-relaxed font-normal">{col.d && String(col.d).trim() ? col.d : (language === 'es' ? (index === 0 ? 'Breve descripción de lo que se solicita: objetivos, alcance y KPIs esperados.' : index === 1 ? 'Resumen del trabajo realizado: actividades, entregables y enfoques metodológicos.' : 'Resultados alcanzados: métricas, aprendizajes y beneficios para el cliente.') : (index === 0 ? 'Brief description of what is requested: objectives, scope and expected KPIs.' : index === 1 ? 'Summary of the work done: activities, deliverables and methodological approaches.' : 'Results achieved: metrics, learnings and client benefits.'))}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[30%] bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-10 shadow-2xl h-fit lg:sticky top-12 flex flex-col">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#7D68F6] mb-8">{t.projectModal.talentInvolved}</h4>
                <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto hide-scrollbar p-2 -mx-2">
                  {activeTeamTalent.length === 0 ? (
                    <p className="text-white/20 text-xs italic">{t.projectModal.noTalent}</p>
                  ) : (
                    activeTeamTalent.map(member => (
                      <div key={member.ID} onClick={() => setSelectedTalent(member)} className="flex items-center justify-between bg-black/40 p-5 rounded-3xl border border-white/5 group cursor-pointer transition-all hover:ring-2 hover:ring-[#7D68F6]">
                        <div className="flex items-center gap-4 text-left">
                          <img src={member.ImageURL} className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="" />
                          <div>
                            <p className="font-black text-[13px] uppercase text-white truncate max-w-[120px]">{member.Name}</p>
                            <p className="text-[9px] text-[#7D68F6] font-black uppercase">{member.Role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSquad(member); }}
                          title={squad.some(s => s.ID === member.ID) ? t.talentModal.remove : t.talentModal.add}
                          className={`p-3 rounded-full border transition-all ${squad.some(s => s.ID === member.ID) ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-white/30 border-white/10 hover:text-white hover:border-[#7D68F6]'}`}
                        >
                          {squad.some(s => s.ID === member.ID) ? <UserMinus size={16} /> : <UserPlus size={16} />}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTalent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/95">
            <button onClick={() => setSelectedTalent(null)} className="fixed top-10 right-10 p-4 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-black transition-all shadow-2xl"><X size={32} /></button>
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[4rem] p-20 max-w-3xl w-full text-center shadow-2xl relative">
              <img src={selectedTalent.ImageURL} className="w-48 h-48 rounded-full mx-auto mb-10 object-cover border-4 border-[#7D68F6] shadow-[0_0_40px_rgba(125,104,246,0.3)]" alt="" />
              <h2 className="text-6xl font-black uppercase tracking-tighter text-white mb-4 leading-none">{selectedTalent.Name}</h2>
              <p className="text-[#7D68F6] font-black uppercase tracking-[0.4em] text-xs mb-16">{selectedTalent.Role}</p>
              <h4 className="text-[10px] font-black uppercase text-white/40 mb-6 tracking-widest">{t.talentModal.skills}</h4>
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {selectedTalent.skillsArray.map((skill, idx) => (
                  <span key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white tracking-widest">{skill}</span>
                ))}
              </div>
              <button
                onClick={() => { toggleSquad(selectedTalent); setSelectedTalent(null); }}
                className={`w-full py-7 rounded-full font-black uppercase tracking-[0.3em] text-[12px] transition-all shadow-xl ${squad.some(s => s.ID === selectedTalent.ID) ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-[#7D68F6] text-white hover:scale-105 shadow-[#7D68F6]/20'}`}
              >
                {squad.some(s => s.ID === selectedTalent.ID) ? t.talentModal.remove : t.talentModal.add}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState(localStorage.getItem('mrm_lang') || 'es');
  const t = translations[language];

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('mrm_lang', lang);
  };

  return (
    <MsalProvider instance={msalInstance}>
      <MainContent language={language} setLanguage={handleSetLanguage} t={t} />
    </MsalProvider>
  );
}
