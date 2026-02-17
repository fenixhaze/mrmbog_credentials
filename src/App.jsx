import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronRight, Zap, MessageCircle, Send, X, ShieldCheck, Sparkles } from 'lucide-react';

const LILA_BRAND = "#6040F1"; // RGB(96, 64, 241)

const CORPORATE_DATA = [
  {
    id: 1,
    name: "Perfil Estratégico",
    role: "Consultoría de Interacción",
    tags: ["Interacción", "Estrategia", "Análisis", "UX/UI"],
    color: LILA_BRAND
  },
  {
    id: 2,
    name: "Perfil de Desarrollo",
    role: "Arquitectura Digital",
    tags: ["React", "Tailwind", "Git", "AI Integration"],
    color: LILA_BRAND
  }
];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Asistente corporativo activo. Analizando tags del sistema interno.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Procesando consulta... La integración de IA está operativa para estos perfiles.' }]);
    }, 800);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
        <div className="bg-[#252525] p-10 rounded-[2.5rem] border border-white/5 text-center shadow-2xl max-w-sm">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: LILA_BRAND, boxShadow: `0 0 40px ${LILA_BRAND}66` }}>
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter italic uppercase">Internal Brief</h1>
          <p className="text-gray-400 mb-10 text-[10px] uppercase tracking-[0.4em]">Confidential System</p>
          <button onClick={() => setShowOnboarding(false)} className="w-full bg-white text-[#1D1D1D] py-4 rounded-2xl font-black hover:opacity-90 transition-all">INGRESAR</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white p-8">
      <header className="max-w-5xl mx-auto mb-16 flex justify-between items-center bg-[#252525]/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl">
        <h1 className="text-2xl font-black tracking-tighter italic uppercase">Corporate <span style={{ color: LILA_BRAND }}>Credentials</span></h1>
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: LILA_BRAND }}></div> Interno
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2">
        {CORPORATE_DATA.map(person => (
          <div key={person.id} className="bg-[#252525] p-8 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10" style={{ color: LILA_BRAND }}><User size={30} /></div>
              <div><h3 className="text-2xl font-bold tracking-tight">{person.name}</h3><p className="text-gray-500 text-sm">{person.role}</p></div>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
              {person.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-white/5 backdrop-blur-xl rounded-lg text-[10px] font-bold border border-white/10 uppercase tracking-widest" style={{ color: LILA_BRAND }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* CHATBOT */}
      <div className="fixed bottom-8 right-8 z-50">
        {isChatOpen ? (
          <div className="bg-[#252525]/95 backdrop-blur-2xl w-80 h-[450px] rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-white/5" style={{ backgroundColor: `${LILA_BRAND}22` }}>
              <span className="text-[10px] font-black uppercase tracking-widest">AI Assistant</span>
              <button onClick={() => setIsChatOpen(false)}><X size={18}/></button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl text-[11px] border border-white/5" style={m.role === 'ai' ? { backgroundColor: `${LILA_BRAND}11`, color: '#d1d1d1' } : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}>{m.content}</div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="bg-transparent flex-1 text-[11px] outline-none text-white px-2" placeholder="Consulta segura..." />
              <button onClick={handleSendMessage} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: LILA_BRAND }}><Send size={14}/></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 rounded-full flex items-center justify-center text-white border-4 border-[#1D1D1D]" style={{ backgroundColor: LILA_BRAND }}><MessageCircle size={28} /></button>
        )}
      </div>
    </div>
  );
}

export default App;