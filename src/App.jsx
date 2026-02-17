import React, { useState, useEffect, useRef } from 'react';
import { User, Send, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const LILA_BRAND = "#6040F1"; // RGB(96, 64, 241)

const CORPORATE_DATA = [
  { id: 1, name: "Estratégico", role: "Consultoría", tags: ["Interacción", "Estrategia", "UX/UI"] },
  { id: 2, name: "Desarrollo", role: "Arquitectura", tags: ["React", "AI", "Node.js"] },
  { id: 3, name: "Creative", role: "Multimedia", tags: ["Motion", "Design", "Storytelling"] },
  { id: 4, name: "Data", role: "Analytics", tags: ["Python", "Insights", "BI"] }
];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! Describe el proyecto que tienes en mente. No olvides mencionar los skills clave que necesitas integrar.' }
  ]);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Entendido. Estoy analizando las habilidades necesarias para el despliegue del proyecto...' }]);
    }, 1000);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
        <div className="bg-[#252525] p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: LILA_BRAND }}>
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tighter italic">MRM</h1>
          <p className="text-gray-400 mb-8 text-[10px] uppercase tracking-[0.3em]">Credentials OS</p>
          <button onClick={() => setShowOnboarding(false)} className="w-full bg-white text-[#1D1D1D] py-3 rounded-xl font-black hover:opacity-90 transition-all uppercase text-xs tracking-widest">Inicializar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white flex flex-col font-sans">
      
      {/* HEADER MRM */}
      <header className="p-8 pb-0">
        <h1 className="text-4xl font-black tracking-tighter italic">MRM</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Bogota Credentials</p>
      </header>

      {/* ÁREA DE CONVERSACIÓN TIPO BURBUJAS LIBRES */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 pt-12 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
              <div 
                className={`max-w-[80%] p-4 px-6 rounded-[1.8rem] text-sm leading-relaxed shadow-xl border border-white/5
                  ${m.role === 'ai' 
                    ? 'bg-white text-[#1D1D1D] rounded-bl-none font-medium' 
                    : 'text-white rounded-br-none'}`}
                style={m.role === 'user' ? { backgroundColor: LILA_BRAND } : {}}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* BARRA DE ENTRADA ALARGADA Y MINIMALISTA */}
        <div className="relative group mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full opacity-50 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-[#252525] rounded-full border border-white/10 p-2 pl-6 shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describa el proyecto y los skills necesarios..."
              className="bg-transparent flex-1 outline-none text-sm text-white placeholder:text-gray-600 h-12"
            />
            <button 
              onClick={handleSendMessage}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
              style={{ backgroundColor: LILA_BRAND }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* CARRUSEL MINI PARA CREDENCIALES (FOOTER) */}
      <footer className="p-8 pt-0 flex justify-center">
        <div className="w-full max-w-sm flex items-center gap-4 bg-white/5 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/5 shadow-lg">
          <button onClick={() => setCurrentIndex(prev => (prev - 1 + CORPORATE_DATA.length) % CORPORATE_DATA.length)} className="text-gray-500 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex-1 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center" style={{ color: LILA_BRAND }}>
                <User size={16} />
             </div>
             <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-tight">{CORPORATE_DATA[currentIndex].name}</h4>
                <div className="flex gap-1 mt-1">
                  {CORPORATE_DATA[currentIndex].tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/5" style={{ color: LILA_BRAND }}>{tag}</span>
                  ))}
                </div>
             </div>
          </div>

          <button onClick={() => setCurrentIndex(prev => (prev + 1) % CORPORATE_DATA.length)} className="text-gray-500 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;