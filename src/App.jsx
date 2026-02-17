import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, X, Globe, Zap, Cpu, Palette, BarChart3, ChevronLeft, ChevronRight, UserPlus, Layers } from 'lucide-react';

const LILA_REAL = "#6040F1"; 

const PROJECTS_DATA = [
  { id: 1, title: "Plataforma Core Banking", desc: "Modernización de infraestructura legacy para banca digital.", color: "from-indigo-500/20" },
  { id: 2, title: "Ecosistema Retail AR", desc: "Experiencia de compra inmersiva usando Realidad Aumentada.", color: "from-purple-500/20" },
  { id: 3, title: "AI Analytics Dashboard", desc: "Predicción de churn y modelos de comportamiento de usuario.", color: "from-blue-500/20" },
  { id: 4, title: "Brand Identity 360", desc: "Rediseño global de marca y sistemas de diseño escalables.", color: "from-violet-500/20" },
];

const SKILLS_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría Senior", icon: <Globe size={26}/> },
  { id: 2, name: "Desarrollo", role: "Arquitectura Cloud", icon: <Cpu size={26}/> },
  { id: 3, name: "Creative", role: "Design Systems", icon: <Palette size={26}/> },
  { id: 4, name: "Data", role: "ML & Analytics", icon: <BarChart3 size={26}/> },
];

function App() {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentChat, setCurrentChat] = useState({ user: null, ai: 'Sistema activo. Describe tu proyecto.' });
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    if (currentChat.user) setHistory(prev => [{ ...currentChat, id: Date.now() }, ...prev].slice(0, 5));
    setCurrentChat({ user: input, ai: null });
    setInput('');
    setIsTyping(true);
    setShowResults(false);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentChat(prev => ({ ...prev, ai: 'Mira resultados y agrega talentos a tu equipo.' }));
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-8 text-white relative pb-20 px-6" 
         style={{ background: `radial-gradient(circle at center, #1a0f3c 0%, #0A0A0A 80%)` }}>
      
      {/* HEADER */}
      <motion.header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-[100px] font-black tracking-[-0.08em] leading-none text-white italic uppercase">MRM</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-gray-500 mt-2">Creative Credentials</p>
      </motion.header>

      {/* CHAT AREA */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6 z-20">
        
        {/* BURBUJA DE USUARIO */}
        <AnimatePresence>
          {currentChat.user && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="py-1.5 px-6 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-400 italic self-center"
            >
              "{currentChat.user}"
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENEDOR DE IA EXPANDIDO */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <div className="flex justify-center gap-2 p-4">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: LILA_REAL}} />
                <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{backgroundColor: LILA_REAL}} />
              </div>
            ) : (
              <motion.div 
                key={currentChat.ai}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full px-8 py-8 rounded-[3rem] border backdrop-blur-md shadow-2xl relative overflow-hidden"
                style={{ borderColor: `${LILA_REAL}33`, backgroundColor: `rgba(96, 64, 241, 0.02)` }}
              >
                <h2 className="text-xl font-bold italic text-center mb-8 tracking-tight text-white/90">
                  {currentChat.ai}
                </h2>

                {/* GRID DE 4 PROYECTOS */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {PROJECTS_DATA.map((proj) => (
                        <motion.div 
                          key={proj.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#6040F1]/50 transition-all group cursor-pointer"
                        >
                          {/* IMAGEN IZQUIERDA */}
                          <div className={`w-24 h-24 rounded-2xl flex-shrink-0 bg-gradient-to-br ${proj.color} to-transparent border border-white/5 flex items-center justify-center`}>
                            <Layers size={24} className="text-white/20 group-hover:text-[#6040F1] transition-colors" />
                          </div>

                          {/* CONTENIDO */}
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-[12px] font-black uppercase tracking-tight mb-1">{proj.title}</h3>
                              <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{proj.desc}</p>
                            </div>
                            <button className="flex items-center gap-2 mt-2 text-[9px] font-bold uppercase tracking-tighter text-[#6040F1] hover:text-white transition-colors">
                              <UserPlus size={12} />
                              Agregar Talento
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUT ALARGADO */}
        <div className="w-full max-w-2xl relative">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-7 py-3 focus-within:border-[#6040F1]/60 transition-all backdrop-blur-sm">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu necesidad de talento..."
              className="bg-transparent flex-1 outline-none text-[12px] text-white/60 py-1"
            />
            <button onClick={handleSendMessage} className="ml-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#6040F1] hover:rotate-12 transition-all">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* SKILLS CAROUSEL ABAJO */}
      <div className="mt-12 flex flex-col items-center space-y-4">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-20 italic">Global Skill Network</p>
        <div className="flex items-center gap-6">
          <ChevronLeft onClick={() => setCurrentIndex(prev => (prev - 1 + SKILLS_DATA.length) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
          <div className="w-64 p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6040F1]/10 flex items-center justify-center text-[#6040F1]">{SKILLS_DATA[currentIndex].icon}</div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase text-white">{SKILLS_DATA[currentIndex].name}</p>
              <p className="text-[9px] text-gray-600">{SKILLS_DATA[currentIndex].role}</p>
            </div>
          </div>
          <ChevronRight onClick={() => setCurrentIndex(prev => (prev + 1) % SKILLS_DATA.length)} className="opacity-20 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;