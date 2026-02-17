import React, { useState } from 'react';
import { User, ChevronRight, GraduationCap, Zap } from 'lucide-react';

// CONSTRUCTOR: Datos protegidos con tus estilos
const PEOPLE_DATA = [
  {
    id: 1,
    name: "Perfil Creativo",
    role: "Comunicación Digital",
    tags: ["Interacción", "Estrategia", "UX/UI"],
    color: "#a855f7" // Lila
  },
  {
    id: 2,
    name: "Desarrollador",
    role: "Ingeniería de Medios",
    tags: ["React", "Tailwind", "Git"],
    color: "#a855f7"
  }
];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="relative bg-[#111] p-10 rounded-[2.5rem] border border-purple-500/30 text-center shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]">
          <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">BIENVENIDO</h1>
          <p className="text-gray-400 mb-10">Explora tus credenciales con el sistema de interacción digital.</p>
          <button 
            onClick={() => setShowOnboarding(false)}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-900/20"
          >
            INGRESAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-y-auto">
      <header className="max-w-5xl mx-auto mb-16 flex justify-between items-center border-b border-purple-900/30 pb-8">
        <h1 className="text-4xl font-black tracking-tighter italic">CREDENTIALS <span className="text-purple-500 text-sm not-italic ml-2">v2.0</span></h1>
        <Zap className="text-purple-500" fill="currentColor" />
      </header>

      <main className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2">
        {PEOPLE_DATA.map(person => (
          <div key={person.id} className="relative group">
            {/* Tarjeta con Efecto Espejo / Glassmorphism */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:border-purple-500/50 transition-all duration-500 shadow-2xl">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 text-purple-400">
                  <User size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{person.name}</h3>
                  <p className="text-gray-400 text-sm font-medium">{person.role}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                {person.tags.map(tag => (
                  <span key={tag} 
                    className="px-4 py-1.5 bg-white/5 backdrop-blur-xl text-purple-300 rounded-full text-[11px] font-bold border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;