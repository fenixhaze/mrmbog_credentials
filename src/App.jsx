import React, { useState } from 'react';
import { User, ShieldCheck, ChevronRight, GraduationCap, Star, Zap } from 'lucide-react';

// CONSTRUCTOR DE DATOS (Esto no cambia la estética, solo asegura los datos)
const PEOPLE_DATA = [
  {
    id: 1,
    name: "Estudiante Javeriana",
    role: "Comunicación Digital",
    tags: ["Interacción", "Creatividad", "Estrategia", "UX"],
    color: "#6366f1", // Indigo
    level: "Pro"
  },
  {
    id: 2,
    name: "Mentor de Proyecto",
    role: "Facilitador",
    tags: ["Guía", "Metodología", "Feedback"],
    color: "#10b981", // Emerald
    level: "Expert"
  }
];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  // --- COMPONENTE DE ONBOARDING (ESTÉTICA RECUPERADA) ---
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="relative group">
          {/* Efecto de resplandor de fondo */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-[#1e293b] p-10 rounded-3xl shadow-2xl max-w-sm text-center border border-white/10">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black mb-3 text-white tracking-tight">CREDENTIALS</h1>
            <p className="text-slate-400 mb-8 font-medium">Configura y visualiza tus insignias de competencias digitales con estilo.</p>
            <button 
              onClick={() => setShowOnboarding(false)}
              className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all transform active:scale-95"
            >
              EMPEZAR AHORA <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- APP PRINCIPAL (ESTÉTICA DE TARJETAS TIPO GLASSMORPHISM) ---
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 overflow-y-auto">
      <header className="max-w-5xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2">Dashboard</h2>
          <h1 className="text-4xl font-black">Directorio Creativo</h1>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg border border-white/5">
           <Zap className="text-yellow-400" size={20} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {PEOPLE_DATA.map(person => (
          <div key={person.id} className="group relative">
            <div className="absolute -inset-0.5 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 text-indigo-400">
                  <User size={28} />
                </div>
                <span className="text-[10px] font-bold py-1 px-3 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                  {person.level}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-1">{person.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{person.role}</p>
              
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {person.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-[11px] font-bold border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                    #{tag.toUpperCase()}
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