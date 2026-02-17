import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronRight, Zap, MessageCircle, Send, X, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';

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
    { role: 'ai', content: 'Bienvenido. Para comenzar, por favor describe el proyecto que vas a realizar. Es valioso que agregues detalles específicos sobre las habilidades (skills) que planeas integrar.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Lógica para el carrusel pequeño
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Entendido. Procesando descripción del proyecto para mapear las credenciales necesarias...' }]);
    }, 1000);
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % CORPORATE_DATA.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + CORPORATE_DATA.length) % CORPORATE_DATA.length);

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
        <div className="bg-[#252525] p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: LILA_BRAND }}>
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tighter">MRM</h1>
          <p className="text-gray-400 mb-8 text-[10px] uppercase tracking-[0.3em]">Bogota Credentials</p>
          <button onClick={() => setShowOnboarding(false)} className="w-full bg-white text-[#1D1D1D] py-3 rounded-xl font-black hover:opacity-90 transition-all">ACCEDER</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white flex flex-col p-6 overflow-hidden">
      
      {/* TÍTULO Y SUBTÍTULO */}
      <header className="text-center mb-6">
        <h1 className="text-5xl font-black tracking-[ -0.05em] mb-1">MRM</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">Bogota Credentials</p>
      </header>

      {/* CHATBOT CENTRALIZADO */}
      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col bg-[#252525]/30 rounded-[2rem] border border-white/5 overflow-hidden mb-8 shadow-2xl backdrop-blur-sm">
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`p-4 rounded-2xl text-[12px] max-w-[85%] border border-white/5 ${m.role === 'ai' ? 'bg-[#333]/50 text-gray-200 self-start' : 'ml-auto text-white'}`}
              style={m.role === 'user' ? { backgroundColor: LILA_BRAND } : {}}>
              {m.content}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 bg-white/5 flex gap-2 border-t border-white/5">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe tu proyecto y skills..." 
            className="bg-transparent flex-1 text-sm outline-none px-2"
          />
          <button onClick={handleSendMessage} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: LILA_BRAND }}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* CARRUSEL MINI ABAJO */}
      <footer className="max-w-2xl mx-auto w-full relative">
        <div className="flex items-center gap-4 bg-[#252525]/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <button onClick={prevSlide} className="opacity-50 hover:opacity-100"><ChevronLeft size={20}/></button>
          
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5" style={{ color: LILA_BRAND }}>
                <User size={20} />
              </div>
              <div className="text-left">
                <h4 className="text-[12px] font-bold leading-none">{CORPORATE_DATA[currentIndex].name}</h4>
                <p className="text-[10px] opacity-50">{CORPORATE_DATA[currentIndex].role}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {CORPORATE_DATA[currentIndex].tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-bold border border-white/10 uppercase tracking-tighter" style={{ color: LILA_BRAND }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button onClick={nextSlide} className="opacity-50 hover:opacity-100"><ChevronRight size={20}/></button>
        </div>
      </footer>
    </div>
  );
}

export default App;