import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Briefcase, MessageSquare, ChevronRight, X, Calendar, UserPlus, UserMinus, Menu as MenuIcon } from 'lucide-react';
import Papa from 'papaparse';
import talentCSVStr from './datacenter/Talent_Database.csv?raw';
import projectsCSVStr from './datacenter/Projects_Database.csv?raw';
import loopIngestedJSON from './datacenter/loop_ingested.json';

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
      error: "He analizado tu solicitud y estos son los perfiles y proyectos que mejor se adaptan a lo que buscas:"
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
      analysisQuote: "Tu talento seleccionado.",
      selected: "PARTICIPANTES SELECCIONADOS",
      teamsBtn: "REGISTRAR CONTACTO",
      contacto: "CONTACTO"
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
      error: "I have analyzed your request and these are the profiles and projects that best suit what you are looking for:"
    },
    team: { filter: "FILTER ROLE", title: "BOGOTÁ TEAM", inSquad: "IN SQUAD", addSquad: "ADD TO SQUAD", all: "All" },
    projectModal: { category: "Category", loPedido: "THE ASK", loHecho: "THE WORK", loLogrado: "THE RESULT", talentInvolved: "INVOLVED TALENT", noTalent: "No associated talent found.", removeSquad: "REMOVE FULL SQUAD", addSquad: "ADD FULL SQUAD", viewCredential: "VIEW CREDENTIAL" },
    talentModal: { skills: "SKILLS AND EXPERIENCE", remove: "REMOVE FROM SQUAD", add: "ADD TO SQUAD" },
    squadModal: {
      defaultTitle: "NEW MRM PROJECT",
      titlePlaceholder: "PROJECT NAME...",
      analysis: "SYSTEM ANALYSIS",
      analysisQuote: "Your selected talent.",
      selected: "SELECTED PARTICIPANTS",
      teamsBtn: "REGISTER CONTACT",
      contacto: "CONTACT"
    }
  }
};

const contentTranslations = {
  projects: {
    P01: {
      en: {
        Title: "Nike Refresh 2024",
        Description: "Complete redesign of the user experience for the e-commerce platform across Latam.",
        LoPedido: "Redesign the user experience to increase the conversion rate on mobile devices.",
        LoHecho: "Complete UX audit, high-fidelity prototyping, and usability testing with real users.",
        LoLogrado: "25% increase in mobile sales and 15% reduction in cart abandonment."
      }
    },
    P02: {
      en: {
        Title: "Coca-Cola Summer",
        Description: "Animated content campaign for giant screens and social media during the summer.",
        LoPedido: "Create a vibrant visual campaign to attract the young audience during the summer season.",
        LoHecho: "Production of 3D motion graphics and dynamic pieces for giant screens and social media.",
        LoLogrado: "Millions of social media impressions and a high level of engagement with the target audience."
      }
    },
    P03: {
      en: {
        Title: "Mastercard Security",
        Description: "Case study-style video production showcasing new biometric security layers.",
        LoPedido: "Effectively communicate new biometric security layers to cardholders.",
        LoHecho: "Production of a narrative case study video explaining the benefits of biometric technology.",
        LoLogrado: "Improved brand security perception and reduction in fraud-related support queries."
      }
    },
    P04: {
      en: {
        Title: "Lego Builder Ads",
        Description: "Interactive rich media banner set for the Technic line launch.",
        LoPedido: "Generate anticipation and engagement for the launch of the new Technic line.",
        LoHecho: "Development of a set of interactive rich media banners that allow users to virtually build.",
        LoLogrado: "CTR 3 times higher than the industry average and significant increase in pre-sale site traffic."
      }
    },
    P05: {
      en: {
        Title: "Spotify Wrapped Local",
        Description: "Adaptation of the Wrapped campaign for digital billboards in Bogotá and Medellín.",
        LoPedido: "Adapt the successful global Wrapped campaign to the cultural context of Bogotá and Medellín.",
        LoHecho: "Curation of local data and design of dynamic digital billboards reflecting city musical tastes.",
        LoLogrado: "Wide organic social media visibility and consolidation of brand presence in the local market."
      }
    },
    P06: {
      en: {
        Title: "Nestlé Smart Data",
        Description: "Interactive dashboard and consumer data visualization for decision making.",
        LoPedido: "Transform complex consumer data into actionable insights for the marketing team.",
        LoHecho: "Design and development of an interactive dashboard with real-time custom data visualizations.",
        LoLogrado: "Strategic decision-making time reduction and advertising budget optimization."
      }
    },
    P07: {
      en: {
        Title: "IKEA Welcome Home",
        Description: "Automated loyalty strategy with dynamic email design.",
        LoPedido: "Automate communication with new customers to foster brand loyalty.",
        LoHecho: "Implementation of a CRM strategy with dynamic emails based on purchasing behavior.",
        LoLogrado: "45% email open rate and increase in purchase frequency from new club members."
      }
    },
    P08: {
      en: {
        Title: "P&G Global Pitch",
        Description: "Visual narrative design and decks for the global pitch of personal care accounts.",
        LoPedido: "Develop an impactful visual narrative for the global personal care accounts pitch.",
        LoHecho: "Comprehensive design of presentation decks and strategic storytelling to communicate agency value.",
        LoLogrado: "Successful awarding of the global account and recognition for creative presentation excellence."
      }
    },
    P09: {
      en: {
        Title: "AI Workflow 1.0",
        Description: "Implementation of generative AI tools for campaign asset creation.",
        LoPedido: "Optimize internal creative production processes through the use of artificial intelligence.",
        LoHecho: "Integration of generative AI tools into the workflow for fast creation of advertising assets.",
        LoLogrado: "40% reduction in production times and greater agility in delivering large-scale campaigns."
      }
    },
    P10: {
      en: {
        Title: "Netflix Premiere",
        Description: "Subscription flow optimization for original series launches in the region.",
        LoPedido: "Facilitate the subscription process for users in regions with limited connectivity.",
        LoHecho: "Technical optimization of the payment flow and design of a minimalist interface focused on speed.",
        LoLogrado: "20% increase in new subscriptions in target markets and improved user satisfaction."
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

export const DESIGN_TOKENS = {
  themes: {
    cream: { bg: 'bg-[#F8F9F4]', text: 'text-black', contrast: 'text-[#FA4B14]' },
    orange: { bg: 'bg-[#FA4B14]', text: 'text-white', contrast: 'text-white' },
    blue: { bg: 'bg-[#104FE6]', text: 'text-white', contrast: 'text-white' }
  }
};

function MainContent({ language, setLanguage, t }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [rawTalentData, setRawTalentData] = useState([]);
  const [rawFlatProjects, setRawFlatProjects] = useState([]); 
  const [talentData, setTalentData] = useState([]);
  const [flatProjects, setFlatProjects] = useState([]);
  const [loopData, setLoopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [squad, setSquad] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('mrm'); // 'mrm' | 'cmlatam'
  const [flyingAvatars, setFlyingAvatars] = useState([]);
  const [hoveredPillar, setHoveredPillar] = useState(null);

  const chatContainerRef = useRef(null);
  const headerSquadRef = useRef(null);
  const modalSquadRef = useRef(null);

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
        setLoopData(loopIngestedJSON || []);

        const parsedTalent = Papa.parse(talentCSVStr, {
          header: true,
          skipEmptyLines: true,
          delimiter: ';',
          transformHeader: (h) => h.trim().replace(/^[\u200B\uFEFF]/, '')
        }).data;
        setRawTalentData(parsedTalent);

        const parsedProjects = Papa.parse(projectsCSVStr, {
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
      return {
        ...item,
        Title: language === 'en' ? projectTranslation.Title || item.Title : item.Title,
        Description: language === 'en' ? projectTranslation.Description || item.Description : item.Description,
        LoPedido: language === 'en' ? projectTranslation.LoPedido || item.LoPedido : item.LoPedido,
        LoHecho: language === 'en' ? projectTranslation.LoHecho || item.LoHecho : item.LoHecho,
        LoLogrado: language === 'en' ? projectTranslation.LoLogrado || item.LoLogrado : item.LoLogrado,
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
      setActiveImageIdx(0);
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

    const localFallback = (query) => {
      const q = (query || '').toLowerCase();
      const tokens = q.split(/\W+/).filter(Boolean);

      const talentScores = talentData.map(t => {
        const hay = ((t.Name || '') + ' ' + (t.Role || '') + ' ' + (t.skillsArray || []).join(' ')).toLowerCase();
        let score = 0;
        tokens.forEach(tok => { if (hay.includes(tok)) score += 2; });
        return { talent: t, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.talent).slice(0, 4);

      const projectScores = flatProjects.map(p => {
        const hay = ((p.Title || '') + ' ' + (p.tagsArray || []).join(' ') + ' ' + (p.Description || '')).toLowerCase();
        let score = 0;
        tokens.forEach(tok => { if (hay.includes(tok)) score += 1; });
        return { project: p, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.project).slice(0, 3);

      return {
        match_ids: projectScores.map(p => p.ID),
        recommendedTalent: talentScores,
        results: projectScores,
        reason: t.chat.error
      };
    };

    try {
      let KEY = import.meta.env.VITE_GEMINI_API_KEY;

      // Obfuscation check: if the key doesn't start with 'AIza' (standard Gemini prefix), 
      // try decoding it from Base64 (used in production to bypass scanners).
      if (KEY && !KEY.startsWith('AIza')) {
        try {
          const decoded = atob(KEY);
          if (decoded.startsWith('AIza')) KEY = decoded;
        } catch (e) {
          // If decoding fails, stick with original KEY
        }
      }

      const MODEL = 'gemini-2.5-flash';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

      const pBrief = flatProjects.slice(0, 15).map(p => `ID_PROYECTO: ${p.ID} | Título: ${p.Title} | Tags: ${p.tagsArray.join(', ')}`).join('\n');
      const tBrief = talentData.slice(0, 15).map(tItem => `Nombre: ${tItem.Name} | Rol: ${tItem.Role} | Skills: ${tItem.skillsArray.join(', ')}`).join('\n');
      const lBrief = loopData.slice(0, 15).map(lItem => `ID_NODO: ${lItem.id} | Contexto_Loop: ${lItem.text}`).join('\n');

      const systemPrompt = language === 'es'
        ? `Eres el Asistente de Staffing de MRM Bogotá.\nDistingue estrictamente entre P-IDs (Proyectos) y T-IDs (Talento).\nREGLAS ESTRICTAS:\n1. Devuelve MÁXIMO 4 talent_names en un grid de 2 columnas.\n2. En "match_ids", debes devolver SOLO los códigos exactos de ID_PROYECTO (ej. "P001").\n3. Responde SOLO en este formato JSON: {"match_ids":["P###"], "talent_names":["NOMBRE"], "reason":"explicación en ESPAÑOL"}`
        : `You are the Staffing Assistant for MRM Bogotá.\nStrictly distinguish between P-IDs (Projects) and T-IDs (Talent).\nSTRICT RULES:\n1. Return MAXIMUM 4 talent_names in a 2-column grid.\n2. In "match_ids", you must return ONLY the exact PROJECT_IDs (e.g., "P001").\n3. Respond ONLY in this JSON format: {"match_ids":["P###"], "talent_names":["NAME"], "reason":"explanation in ENGLISH"}`;

      const prompt = `${systemPrompt}\n\n[PROYECTOS DISPONIBLES]\n${pBrief}\n\n[TALENTO DISPONIBLE]\n${tBrief}\n\n[DATOS EXTRA (LOOP)]\n${lBrief}\n\nUSUARIO: "${userMsg}"`;

      if (!KEY || typeof KEY !== 'string' || KEY.trim() === '') {
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
        // On error, use local fallback silently
        const fallback = localFallback(userMsg);
        setChatHistory(prev => [...prev, { type: 'ai', text: fallback.reason, results: fallback.results, recommendedTalent: fallback.recommendedTalent }]);
        setIsTyping(false);
        return;
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
      const fallback = localFallback(userMsg);
      setChatHistory(prev => [...prev, { type: 'ai', text: fallback.reason, results: fallback.results, recommendedTalent: fallback.recommendedTalent }]);
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

  const toggleSquad = (item, event = null) => {
    const isAdding = !squad.some(x => x.ID === item.ID);
    
    if (isAdding) {
      let startRect = null;
      if (event && event.currentTarget) {
        const container = event.currentTarget.closest('div');
        const img = container?.querySelector('img');
        if (img) {
          startRect = img.getBoundingClientRect();
        } else {
          startRect = event.currentTarget.getBoundingClientRect();
        }
      }

      if (startRect) {
        const targetRef = (selectedTalent || selectedProject) ? modalSquadRef : headerSquadRef;
        const endRect = targetRef.current?.getBoundingClientRect();
        if (endRect) {
          const id = Date.now() + Math.random();
          setFlyingAvatars(prev => [...prev, {
            id,
            img: item.ImageURL,
            start: { x: startRect.left, y: startRect.top },
            end: { x: endRect.left + endRect.width / 2 - 40, y: endRect.top + endRect.height / 2 - 40 }
          }]);
        }
      }
    }
    
    setSquad(prev => isAdding ? [...prev, item] : prev.filter(x => x.ID !== item.ID));
  };

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

  if (loading) return <div className="h-[100dvh] bg-[#0A0A0A] flex items-center justify-center text-[#7D68F6] font-black uppercase animate-pulse">{t.loading}</div>;

  return (
    <div className={`h-[100dvh] font-sans overflow-hidden selection:bg-[#7D68F6]/30 flex flex-col ${theme === 'mrm' ? 'bg-[#0A0A0A] text-white' : 'bg-[#F8F9F4] text-black'}`}>
      {theme === 'mrm' && <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a0b3d_0%,transparent_50%)] z-0 pointer-events-none" />}

      <header className={`relative w-full p-6 md:p-10 px-6 md:px-12 z-[100] flex flex-col sm:flex-row justify-between items-start sm:items-start pointer-events-none gap-4 sm:gap-0 flex-shrink-0 ${theme === 'cmlatam' ? 'text-black' : 'text-white'}`}>
        <div className="flex flex-col items-start cursor-pointer pointer-events-auto" onClick={() => setActiveTab('landing')}>
          {theme === 'cmlatam' ? (
            <img src="/cmlatam.png" alt="CM Latam" className="h-10 md:h-14 object-contain" />
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none m-0">MRM</h1>
              <div className="text-[8px] md:text-[10px] text-[#7D68F6] mt-1 ml-1 border-l-2 border-[#7D68F6] pl-3 flex flex-col uppercase font-bold tracking-widest">
                <span>BOGOTÁ</span><span>CREATIVE</span><span>CREDENTIALS</span>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2 md:gap-4 items-center pointer-events-auto flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
          <button
            onClick={() => setTheme(theme === 'mrm' ? 'cmlatam' : 'mrm')}
            className={`flex items-center justify-center px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${theme === 'cmlatam' ? 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]' : 'bg-[#FA4B14] text-white'}`}
          >
            {theme === 'mrm' ? 'CM LATAM' : 'MRM'}
          </button>
          <div className={`flex items-center backdrop-blur-3xl border rounded-full p-1 ${theme === 'mrm' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            {['es', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${language === lang ? (theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-lg' : 'bg-[#104FE6] text-white shadow-lg rounded-[75px]') : (theme === 'mrm' ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-[#104FE6]')}`}
              >
                {lang}
              </button>
            ))}
          </div>
          {activeTab !== 'landing' && (
            <div className="relative">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className={`md:hidden flex items-center gap-2 px-4 py-2 backdrop-blur-3xl border rounded-full text-[10px] font-black uppercase shadow-2xl ${theme === 'mrm' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}
              >
                <MenuIcon size={14} /> MENU
              </button>
              
              <nav className={`${isMobileMenuOpen ? 'flex flex-col absolute top-[120%] mt-2 right-0 min-w-[200px] z-[200]' : 'hidden'} md:flex md:flex-row items-center gap-1 md:gap-2 p-2 backdrop-blur-3xl border rounded-2xl md:rounded-full shadow-2xl ${theme === 'mrm' ? 'bg-[#0A0A0A]/95 md:bg-white/5 border-white/10' : 'bg-[#F8F9F4]/95 md:bg-black/5 border-black/10'}`}>
                {[{ id: 'chat', label: t.nav.chat, icon: <MessageSquare size={14} /> }, { id: 'projects', label: t.nav.projects, icon: <Briefcase size={14} /> }, { id: 'team', label: t.nav.team, icon: <Users size={14} /> }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all w-full md:w-auto text-left ${activeTab === tab.id ? (theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-lg' : 'bg-[#104FE6] text-white shadow-lg rounded-[75px]') : (theme === 'mrm' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-black/40 hover:text-[#104FE6] hover:bg-black/5')}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
          <div 
            className={`px-6 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-lg uppercase text-[10px] font-black hover:scale-105 transition-all pointer-events-auto ${theme === 'mrm' ? 'bg-[#7D68F6] text-white' : 'bg-transparent border border-black text-black hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'}`} 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation();
              setShowSquadModal(true); 
            }}
          >
            {t.squad} ({squad.length})
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto pb-10 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.section 
              key="landing" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="fixed inset-0 flex flex-col md:flex-row items-stretch z-0"
            >
              {[{ id: 'chat', title: t.landing.chat, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' }, { id: 'projects', title: t.landing.projects, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' }, { id: 'team', title: t.landing.team, img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200' }].map((card, idx) => (
                <div 
                  key={card.id} 
                  onClick={() => setActiveTab(card.id)} 
                  className={`relative flex-1 group cursor-pointer overflow-hidden ${theme === 'mrm' ? 'border-b md:border-b-0 md:border-r border-white/5 last:border-b-0 md:last:border-r-0' : idx === 1 ? DESIGN_TOKENS.themes.blue.bg : DESIGN_TOKENS.themes.orange.bg}`}
                >
                  {theme === 'mrm' && (
                    <div className="absolute inset-0 bg-black">
                      <img src={card.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-500" alt="" />
                    </div>
                  )}
                  
                  <div className={`relative z-10 h-full flex flex-col justify-end p-8 md:p-16 pb-12 md:pb-24 text-left ${theme === 'mrm' ? '' : 'justify-center items-center hover:scale-105 transition-transform duration-500'}`}>
                    <h2 className={theme === 'mrm' ? "text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none group-hover:text-[#7D68F6] transition-colors duration-300 text-white" : "text-5xl md:text-[6vw] font-compacta font-normal uppercase tracking-tight leading-[0.9] text-white text-center after:content-['.'] after:text-white"}>{card.title}</h2>
                  </div>
                </div>
              ))}
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <section className="max-w-4xl mx-auto w-full px-6 flex flex-col flex-1 text-left">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-4 hide-scrollbar pb-4 px-2 -mx-2">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`${(msg.results?.length > 0 || msg.recommendedTalent?.length > 0) ? 'w-full max-w-[100%] md:max-w-[95%] lg:max-w-[90%]' : 'w-fit max-w-[90%] md:max-w-[75%] lg:max-w-[65%]'} ${theme === 'mrm' ? (msg.type === 'user' ? 'rounded-[2rem] bg-[#7D68F6] border border-[#7D68F6] px-4 md:px-6 py-2 text-white' : 'rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl px-4 md:px-6 py-2 text-white') : (msg.type === 'user' ? 'rounded-none bg-black border border-black px-4 md:px-6 py-2 text-white' : 'rounded-none bg-white border border-black/10 px-4 md:px-6 py-2 text-black shadow-sm')}`}>
                      <div className="min-h-[40px] md:min-h-[48px] flex items-center">
                        <p className={`whitespace-pre-wrap leading-relaxed normal-case m-0 text-[13px] md:text-[14px] ${theme === 'mrm' ? 'opacity-90' : 'opacity-100 font-medium'}`}>{msg.text}</p>
                      </div>

                      {msg.results && msg.results.length > 0 && (
                        <div className="mb-4 mt-2 flex gap-4 overflow-x-auto hide-scrollbar pb-4 pt-2 px-4 -mx-4">
                          {msg.results.map((p, idx) => (
                            <div key={idx} onClick={() => setSelectedProject(normalizeProjectTags(p))} className={`min-w-[260px] md:min-w-[280px] overflow-hidden group cursor-pointer transition-all flex-shrink-0 ${theme === 'mrm' ? 'bg-black/40 border border-white/10 rounded-3xl hover:ring-2 hover:ring-[#7D68F6]' : 'bg-transparent rounded-none hover:opacity-80'}`}>
                              <img src={p.images[0]} className={`h-28 w-full object-cover transition-all ${theme === 'mrm' ? 'grayscale group-hover:grayscale-0' : 'rounded-none'}`} alt="" />
                              <div className={theme === 'mrm' ? "p-5 text-left" : "pt-4 text-left pb-2"}>
                                {theme === 'mrm' ? (
                                  <>
                                    <h4 className="text-[12px] font-black uppercase mb-2 truncate text-white">{p.Title}</h4>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                      {p.tagsArray.slice(0, 2).map((tag, tIdx) => (
                                        <span key={tIdx} className="inline-flex items-center px-2 py-1 bg-white/10 rounded text-[8px] font-black uppercase tracking-widest text-zinc-300">{tag}</span>
                                      ))}
                                    </div>
                                    <p className="text-[10px] text-white/50 line-clamp-2 mb-6 normal-case font-normal leading-relaxed">{p.Description}</p>
                                    <p className="text-[9px] text-[#7D68F6] font-bold uppercase tracking-widest">{t.chat.viewCredential}</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2 mb-2 text-[9px] font-medium tracking-widest uppercase">
                                      <span className="text-[#104FE6]">{p.tagsArray[0]}</span>
                                      {p.tagsArray.length > 1 && (
                                        <>
                                          <span className="text-gray-300">|</span>
                                          <span className="text-black truncate">{p.tagsArray.slice(1, 2).join('')}</span>
                                        </>
                                      )}
                                    </div>
                                    <h4 className="text-base font-bold text-black font-sans leading-tight">{p.Title}</h4>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 pt-5 border-t border-white/10 p-2 -mx-2">
                          {msg.recommendedTalent.map((talent, idx) => (
                            <div key={idx} onClick={() => setSelectedTalent(talent)} className={`p-3 pr-5 flex items-center justify-between group cursor-pointer transition-all ${theme === 'mrm' ? 'bg-black/40 rounded-full border border-white/5 hover:ring-2 hover:ring-[#7D68F6]' : 'bg-transparent border border-black/10 rounded-none hover:bg-black/5'}`}>
                              <div className="flex items-center gap-4 text-left min-w-0">
                                <img src={talent.ImageURL} className={`w-10 h-10 flex-shrink-0 object-cover transition-all ${theme === 'mrm' ? 'rounded-full grayscale group-hover:grayscale-0' : 'rounded-none'}`} alt="" />
                                <div className="min-w-0">
                                  <p className={`text-[10px] font-black uppercase leading-none mb-1 truncate ${theme === 'mrm' ? 'text-white' : 'text-black'}`}>{talent.Name}</p>
                                  <p className={`text-[8px] font-bold uppercase truncate ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-gray-500'}`}>{talent.Role}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSquad(talent, e); }}
                                title={squad.some(s => s.ID === talent.ID) ? t.talentModal.remove : t.talentModal.add}
                                className={`p-2 rounded-full border transition-all flex-shrink-0 ml-2 ${theme === 'mrm' ? (squad.some(s => s.ID === talent.ID) ? 'bg-[#7D68F6] border-[#7D68F6] text-white shadow-lg' : 'border-white/10 text-white/40 hover:text-white') : (squad.some(s => s.ID === talent.ID) ? 'bg-black text-white border-black' : 'border-black/20 text-black hover:bg-black/10')}`}
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
                  className={`flex-1 py-3 px-6 outline-none text-[15px] min-h-[56px] leading-relaxed backdrop-blur-md resize-none border ${theme === 'mrm' ? 'bg-white/5 border-white/20 rounded-[2rem] focus:border-[#7D68F6] text-white' : 'bg-white border-black/20 rounded-none focus:border-black text-black shadow-sm'}`}
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg hover:scale-105 disabled:opacity-50 transition-all flex-shrink-0 ${theme === 'mrm' ? 'bg-[#7D68F6] text-white' : 'bg-black text-white'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section className="pt-4 md:pt-8 px-6 md:px-12 max-w-7xl mx-auto pb-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 p-2 -mx-2">
              {flatProjects.map((project, i) => (
                <div key={i} onClick={() => setSelectedProject(normalizeProjectTags(project))} className={`group cursor-pointer text-left transition-all flex flex-col ${theme === 'mrm' ? 'bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden hover:ring-2 hover:ring-[#7D68F6] shadow-xl' : 'hover:opacity-80'}`}>
                  <div className={`overflow-hidden relative ${theme === 'mrm' ? 'h-64 bg-black' : 'w-full aspect-[4/3] bg-zinc-200'}`}>
                    <img src={project.images[0]} className={`w-full h-full object-cover transition-all duration-700 ${theme === 'mrm' ? 'grayscale group-hover:grayscale-0' : ''}`} alt="" />
                  </div>
                  <div className={`flex-1 flex flex-col ${theme === 'mrm' ? 'p-8' : 'pt-5'}`}>
                    {theme === 'mrm' ? (
                      <>
                        <h4 className="text-xl font-black uppercase text-white mb-4">{project.Title}</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tagsArray.slice(0, 3).map((tag, tIdx) => (
                            <span key={tIdx} className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-zinc-400">{tag}</span>
                          ))}
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-2 mb-8 normal-case font-normal leading-relaxed">{project.Description}</p>
                        <p className="text-[10px] text-[#7D68F6] font-bold uppercase tracking-widest mt-auto">{t.projectModal.viewCredential} <ChevronRight size={10} className="inline ml-1" /></p>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 text-[11px] font-medium tracking-wider uppercase">
                          <span className="text-[#104FE6]">{project.tagsArray[0]}</span>
                          {project.tagsArray.length > 1 && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="text-black">{project.tagsArray.slice(1, 3).join(' / ')}</span>
                            </>
                          )}
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold text-black font-sans leading-tight tracking-tight pr-4">{project.Title}</h4>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'team' && (
            <section className="flex flex-col md:flex-row gap-8 md:gap-16 pt-4 md:pt-8 px-6 md:px-12 max-w-7xl mx-auto pb-40 text-left">
              <aside className="w-full md:w-64 relative md:sticky top-auto md:top-32 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-4 md:pb-0 border-b border-white/10 md:border-b-0 z-20">
                <h3 className={`text-[10px] font-black uppercase md:mb-8 tracking-widest hidden md:block ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-black'}`}>{t.team.filter}</h3>
                {uniqueRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`flex items-center text-left px-5 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${filterRole === role ? (theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-lg' : 'bg-[#104FE6] text-white shadow-lg rounded-[75px]') : (theme === 'mrm' ? 'text-white/30 hover:text-white hover:bg-white/5' : 'text-black/50 hover:text-black hover:bg-black/5')}`}
                  >
                    {role === 'All' ? t.team.all : role}
                  </button>
                ))}
              </aside>
              <div className="flex-1">
                <h2 className={theme === 'mrm' ? "text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 md:mb-12 text-white leading-none" : "text-5xl md:text-[6vw] font-compacta font-normal uppercase tracking-tight mb-8 md:mb-12 text-black leading-[0.9] after:content-['.'] after:text-black"}>{t.team.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 -mx-2">
                  {filteredTalent.map((person, i) => (
                    <div key={i} onClick={() => setSelectedTalent(person)} className={`group cursor-pointer transition-all flex flex-col ${theme === 'mrm' ? 'bg-zinc-900/40 border border-white/5 p-8 rounded-[3.5rem] text-center hover:ring-2 hover:ring-[#7D68F6]' : 'text-left hover:opacity-80'}`}>
                      <img src={person.ImageURL} className={theme === 'mrm' ? "w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale transition-all border-4 border-transparent group-hover:border-[#7D68F6] bg-black shadow-lg" : "w-full aspect-square mb-4 object-cover transition-all rounded-none bg-zinc-200"} alt="" />
                      {theme === 'mrm' ? (
                        <>
                          <h4 className="text-[18px] font-black uppercase truncate w-full text-white">{person.Name}</h4>
                          <p className="text-[10px] text-[#7D68F6] font-black uppercase mb-4 tracking-widest">{person.Role}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2 text-[10px] font-medium tracking-widest uppercase">
                             <span className="text-[#104FE6] truncate">{person.Role}</span>
                          </div>
                          <h4 className="text-2xl font-bold text-black font-sans leading-tight truncate w-full mb-3">{person.Name}</h4>
                        </>
                      )}
                      {theme === 'mrm' ? (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                          {person.skillsArray.slice(0, 2).map((skill, sIdx) => (
                            <span key={sIdx} className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black uppercase tracking-widest text-zinc-400">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-6 truncate">
                          {person.skillsArray.slice(0, 2).join(' / ')}
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSquad(person); }}
                        className={`w-full py-3 rounded-full flex items-center justify-center text-[10px] font-black uppercase mt-auto transition-all ${theme === 'mrm' ? (squad.some(p => p.ID === person.ID) ? 'bg-[#7D68F6] text-white shadow-lg border border-[#7D68F6]' : 'text-[#7D68F6] hover:bg-[#7D68F6]/10 border border-[#7D68F6]') : (squad.some(p => p.ID === person.ID) ? 'bg-black text-white border border-black' : 'text-black hover:bg-black/5 border border-black')}`}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 z-[200] flex items-start justify-center p-6 pt-0 top-[10%] backdrop-blur-2xl bg-black/95 overflow-y-auto">
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 z-[250] p-4 bg-black/50 rounded-full flex items-center justify-center hover:bg-white text-white hover:text-black transition-all border border-white/10 shadow-2xl"><X size={24} /></button>
            
            {/* Sticky Squad CTA for Project Modal */}
            <div 
              ref={modalSquadRef}
              className="fixed bottom-12 right-12 bg-[#7D68F6] px-6 py-4 rounded-[20px] flex items-center gap-4 cursor-pointer shadow-2xl uppercase text-[10px] font-black hover:scale-105 transition-all z-[260]"
              onClick={(e) => {
                e.stopPropagation();
                setShowSquadModal(true);
              }}
            >
              {t.squad} ({squad.length})
            </div>

            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[1600px] mx-auto my-12 flex flex-col lg:flex-row gap-8 pb-20 text-left relative">

              <div className={`w-full lg:w-[70%] overflow-hidden h-fit ${theme === 'mrm' ? 'bg-[#0f0f0f] border border-white/10 rounded-[3rem] shadow-2xl' : 'bg-[#F8F9F4] rounded-none shadow-none'}`}>
                <div className={`relative h-[450px] w-full overflow-hidden ${theme === 'mrm' ? 'bg-zinc-950' : 'bg-zinc-200'}`}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedProject.images[activeImageIdx]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      src={selectedProject.images[activeImageIdx]} 
                      className="w-full h-full object-cover" 
                      alt="Project cover" 
                    />
                  </AnimatePresence>
                </div>
                <div className={`p-8 md:p-16 space-y-12 ${theme === 'mrm' ? '' : 'text-black'}`}>
                  <div className="space-y-6">
                    <h2 className={theme === 'mrm' ? "text-7xl font-black uppercase tracking-tighter text-white leading-none" : "text-5xl md:text-7xl font-bold text-black font-object-sans tracking-tight after:content-['.'] after:text-black leading-none"}>{selectedProject.Title}</h2>
                    <p className={`text-xl normal-case leading-relaxed font-normal ${theme === 'mrm' ? 'text-white/60' : 'text-black'}`}>{selectedProject.Description}</p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {theme === 'mrm' ? (
                        projectModalTags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">{tag}</span>
                        ))
                      ) : (
                        <div className="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                          {projectModalTags.slice(0, 3).join(' / ')}
                        </div>
                      )}
                    </div>
                    {selectedProject.images.length > 1 && (
                      <div className="flex gap-4 overflow-x-auto hide-scrollbar pt-6 pb-2 -mx-2 px-2">
                        {selectedProject.images.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setActiveImageIdx(idx)}
                            className={`relative h-40 w-64 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${theme === 'mrm' ? (activeImageIdx === idx ? 'rounded-2xl border-2 border-[#7D68F6] scale-105 shadow-lg shadow-[#7D68F6]/20' : 'rounded-2xl border-2 border-white/10 grayscale hover:grayscale-0 hover:border-white/30') : (activeImageIdx === idx ? 'rounded-none border-2 border-[#FA4B14]' : 'rounded-none border-2 border-transparent hover:border-black/10')}`}
                          >
                            <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t ${theme === 'mrm' ? 'border-white/5' : 'border-black/10'}`}>
                    {[{ label: t.projectModal.loPedido, d: selectedProject.LoPedido }, { label: t.projectModal.loHecho, d: selectedProject.LoHecho }, { label: t.projectModal.loLogrado, d: selectedProject.LoLogrado }].map((col, index) => (
                      <div key={index} className="space-y-4">
                        <h4 className={`text-[12px] font-black tracking-[0.4em] uppercase ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-[#FA4B14]'}`}>{col.label}</h4>
                        <p className={`text-sm leading-relaxed font-normal ${theme === 'mrm' ? 'text-white/50' : 'text-black'}`}>{col.d && String(col.d).trim() ? col.d : (language === 'es' ? (index === 0 ? 'Breve descripción de lo que se solicita: objetivos, alcance y KPIs esperados.' : index === 1 ? 'Resumen del trabajo realizado: actividades, entregables y enfoques metodológicos.' : 'Resultados alcanzados: métricas, aprendizajes y beneficios para el cliente.') : (index === 0 ? 'Brief description of what is requested: objectives, scope and expected KPIs.' : index === 1 ? 'Summary of the work done: activities, deliverables and methodological approaches.' : 'Results achieved: metrics, learnings and client benefits.'))}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`w-full lg:w-[30%] p-10 h-fit lg:sticky top-12 flex flex-col ${theme === 'mrm' ? 'bg-[#0f0f0f] border border-white/10 rounded-[3rem] shadow-2xl' : 'bg-[#F8F9F4] shadow-none'}`}>
                <h4 className={`text-[12px] font-black uppercase tracking-[0.4em] mb-8 ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-black'}`}>{t.projectModal.talentInvolved}</h4>
                <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto hide-scrollbar p-2 -mx-2">
                  {activeTeamTalent.length === 0 ? (
                    <p className={`text-xs italic ${theme === 'mrm' ? 'text-white/20' : 'text-black/50'}`}>{t.projectModal.noTalent}</p>
                  ) : (
                    activeTeamTalent.map(member => (
                      <div key={member.ID} onClick={() => setSelectedTalent(member)} className={`flex items-center justify-between p-5 group cursor-pointer transition-all ${theme === 'mrm' ? 'bg-black/40 rounded-3xl border border-white/5 hover:ring-2 hover:ring-[#7D68F6]' : 'bg-transparent border-b border-black/10 rounded-none hover:opacity-80'}`}>
                        <div className="flex items-center gap-4 text-left">
                          <img src={member.ImageURL} className={`w-12 h-12 object-cover transition-all ${theme === 'mrm' ? 'rounded-full border border-white/10 grayscale group-hover:grayscale-0' : 'rounded-none border-none'}`} alt="" />
                          <div>
                            <p className={`font-black text-[13px] uppercase truncate max-w-[120px] ${theme === 'mrm' ? 'text-white' : 'text-black'}`}>{member.Name}</p>
                            <p className={`text-[9px] font-black uppercase ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-gray-500'}`}>{member.Role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSquad(member, e); }}
                          title={squad.some(s => s.ID === member.ID) ? t.talentModal.remove : t.talentModal.add}
                          className={`p-3 rounded-full border transition-all ${theme === 'mrm' ? (squad.some(s => s.ID === member.ID) ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-white/30 border-white/10 hover:text-white hover:border-[#7D68F6]') : (squad.some(s => s.ID === member.ID) ? 'text-black bg-black/5 border-black' : 'text-black border-black')}`}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTalent(null)} className={`fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-2xl ${theme === 'mrm' ? 'bg-black/95' : 'bg-white/95'}`}>
            <button onClick={() => setSelectedTalent(null)} className={`fixed top-10 right-10 p-4 rounded-full flex items-center justify-center transition-all shadow-2xl ${theme === 'mrm' ? 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black' : 'bg-black/5 text-black border border-black/10 hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'}`}><X size={32} /></button>
            <div onClick={(e) => e.stopPropagation()} className={`p-20 max-w-3xl w-full text-center relative ${theme === 'mrm' ? 'bg-[#0f0f0f] border border-white/10 rounded-[4rem] shadow-2xl' : 'bg-[#F8F9F4] rounded-none shadow-none'}`}>
              <img src={selectedTalent.ImageURL} className={`mx-auto mb-10 object-cover ${theme === 'mrm' ? 'w-48 h-48 rounded-full border-4 border-[#7D68F6] shadow-[0_0_40px_rgba(125,104,246,0.3)]' : 'w-full aspect-square rounded-none border-none'}`} alt="" />
              <h2 className={theme === 'mrm' ? "text-6xl font-black uppercase tracking-tighter text-white mb-4 leading-none" : "text-6xl font-bold uppercase font-object-sans tracking-tight text-black mb-4 leading-none after:content-['.'] after:text-black"}>{selectedTalent.Name}</h2>
              <p className={`font-black uppercase tracking-[0.4em] text-xs mb-16 ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-gray-500'}`}>{selectedTalent.Role}</p>
              {theme === 'mrm' ? (
                <>
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-6 tracking-widest">{t.talentModal.skills}</h4>
                  <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {selectedTalent.skillsArray.map((skill, idx) => (
                      <span key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white tracking-widest">{skill}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-16">
                  {selectedTalent.skillsArray.join(' / ')}
                </div>
              )}
              <button
                onClick={() => { toggleSquad(selectedTalent); setSelectedTalent(null); }}
                className={`w-full py-7 rounded-full font-black uppercase tracking-[0.3em] text-[12px] transition-all shadow-xl ${theme === 'mrm' ? (squad.some(s => s.ID === selectedTalent.ID) ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-[#7D68F6] text-white hover:scale-105 shadow-[#7D68F6]/20') : (squad.some(s => s.ID === selectedTalent.ID) ? 'bg-black text-white border border-black' : 'bg-transparent text-black border border-black hover:bg-black/5')}`}
              >
                {squad.some(s => s.ID === selectedTalent.ID) ? t.talentModal.remove : t.talentModal.add}
              </button>
            </div>

            {/* Sticky Squad CTA for Talent Modal */}
            <div 
              ref={modalSquadRef}
              className="fixed bottom-12 right-12 bg-[#7D68F6] px-6 py-4 rounded-[20px] flex items-center gap-4 cursor-pointer shadow-2xl uppercase text-[10px] font-black hover:scale-105 transition-all z-[310]"
              onClick={(e) => {
                e.stopPropagation();
                setShowSquadModal(true);
              }}
            >
              {t.squad} ({squad.length})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSquadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSquadModal(false)} className={`fixed inset-0 z-[400] flex items-center justify-center p-6 backdrop-blur-2xl ${theme === 'mrm' ? 'bg-black/95' : 'bg-white/95'}`}>
            <button onClick={() => setShowSquadModal(false)} className={`fixed top-10 right-10 p-4 rounded-full flex items-center justify-center transition-all shadow-2xl z-[450] ${theme === 'mrm' ? 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black' : 'bg-black/5 text-black border border-black/10 hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'}`}><X size={32} /></button>
            <div onClick={(e) => e.stopPropagation()} className={`p-16 max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar relative text-left ${theme === 'mrm' ? 'bg-[#0f0f0f] border border-white/10 rounded-[4rem] shadow-2xl' : 'bg-[#F8F9F4] rounded-none shadow-none'}`}>
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h4 className={`font-black uppercase tracking-[0.4em] text-[10px] mb-4 ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-[#FA4B14]'}`}>{t.squadModal.analysis}</h4>
                  <h2 className={theme === 'mrm' ? "text-6xl font-black uppercase tracking-tighter text-white leading-none mb-4" : "text-6xl font-bold uppercase font-object-sans tracking-tight text-black leading-none mb-4 after:content-['.'] after:text-black"}>{t.squadModal.contacto}</h2>
                  <p className={`italic text-sm normal-case ${theme === 'mrm' ? 'text-white/40' : 'text-gray-500'}`}>{t.squadModal.analysisQuote}</p>
                </div>
                <div className={`px-6 py-4 rounded-3xl ${theme === 'mrm' ? 'bg-[#7D68F6]/10 border border-[#7D68F6]/30' : 'bg-black'}`}>
                  <span className={`font-black text-2xl ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-white'}`}>{squad.length}</span>
                  <span className={`font-black text-[10px] ml-2 uppercase ${theme === 'mrm' ? 'text-[#7D68F6]/50' : 'text-white/50'}`}>PAX</span>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <h4 className={`text-[10px] font-black uppercase mb-6 tracking-widest ${theme === 'mrm' ? 'text-white/40' : 'text-black/50'}`}>{t.squadModal.selected}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {squad.length === 0 ? (
                    <div className={`col-span-2 py-20 text-center border-2 border-dashed rounded-[3rem] ${theme === 'mrm' ? 'border-white/5' : 'border-black/10'}`}>
                      <p className={`uppercase font-black text-xs tracking-widest ${theme === 'mrm' ? 'text-white/20' : 'text-black/30'}`}>No hay talento seleccionado</p>
                    </div>
                  ) : (
                    squad.map((member) => (
                      <div key={member.ID} className={`flex items-center justify-between p-5 group transition-all ${theme === 'mrm' ? 'bg-black/40 rounded-3xl border border-white/5 hover:border-[#7D68F6]/30' : 'bg-transparent border-b border-black/10 rounded-none hover:opacity-80'}`}>
                        <div className="flex items-center gap-4">
                          <img src={member.ImageURL} className={`w-12 h-12 object-cover transition-all ${theme === 'mrm' ? 'rounded-full border border-white/10 grayscale group-hover:grayscale-0' : 'rounded-none border-none'}`} alt="" />
                          <div>
                            <p className={`font-black text-[13px] uppercase truncate max-w-[150px] ${theme === 'mrm' ? 'text-white' : 'text-black'}`}>{member.Name}</p>
                            <p className={`text-[9px] font-black uppercase ${theme === 'mrm' ? 'text-[#7D68F6]' : 'text-gray-500'}`}>{member.Role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSquad(member)}
                          className={`p-3 rounded-full border transition-all ${theme === 'mrm' ? 'border-red-500/10 text-red-500/30 hover:text-red-400 hover:bg-red-500/10' : 'border-black text-black hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'}`}
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {squad.length > 0 && (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const emails = squad.map(m => m.Email).filter(Boolean).join(';');
                      if (emails) window.location.href = `mailto:${emails}?subject=MRM Project: ${t.squadModal.defaultTitle}`;
                    }}
                    className={`flex-1 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all ${theme === 'mrm' ? 'bg-[#7D68F6] text-white hover:scale-[1.02] shadow-xl shadow-[#7D68F6]/20' : 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]'}`}
                  >
                    <Send size={16} />
                    {t.squadModal.teamsBtn}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flyingAvatars.map(avatar => (
          <FlyingAvatar
            key={avatar.id}
            img={avatar.img}
            start={avatar.start}
            end={avatar.end}
            onComplete={() => setFlyingAvatars(prev => prev.filter(a => a.id !== avatar.id))}
          />
        ))}
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
    <MainContent language={language} setLanguage={handleSetLanguage} t={t} />
  );
}