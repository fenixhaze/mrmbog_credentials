import React, { useState } from 'react';
import { User, Tag, ChevronRight, GraduationCap, Layout } from 'lucide-react';

// 1. DATA CONSTRUCTOR: Aquí definimos que cada persona SIEMPRE tenga sus tags
const INITIAL_PROFILES = [
  {
    id: 1,
    name: "Diseñador Interactivo",
    role: "UX/UI & Multimedia",
    // Estos son los chips que siempre estarán presentes
    tags: ["Figma", "Interaction", "Prototyping", "User Testing"],
    color: "indigo"
  },
  {
    id: 2,
    name: "Desarrollador Digital",
    role: "Fullstack Creator",
    tags: ["React", "Node.js", "Creative Coding", "Web3"],
    color: "emerald"
  }
];

function App() {
  const [step, setStep] = useState(0); // 0: Onboarding, 1: Main App
  const [profiles] = useState(INITIAL_PROFILES);

  // Componente para los Chips de Tags
  const TagChip = ({ text, color }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700 border border-${color}-200 shadow-sm`}>
      {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto">
      {step === 0 ? (
        /* --- ONBOARDING SCREEN --- */
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-700">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-slate-800">Bienvenido al Onboarding</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Explora las credenciales creativas y los perfiles de interacción del proyecto.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95"
            >
              Comenzar Exploración <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* --- MAIN APP SCREEN --- */
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layout className="text-indigo-600" /> Describe your Project Briefly
              </h2>
              <button onClick={() => setStep(0)} className="text-sm text-slate-400 hover:text-slate-600">Reiniciar</button>
            </div>
          </header>

          <main className="max-w-5xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-8 text-slate-800">Perfiles Configurados</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {profiles.map(profile => (
                <div key={profile.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-${profile.color}-50 text-${profile.color}-600`}>
                      <User size={32} />
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-800">{profile.name}</h4>
                  <p className="text-slate-500 text-sm mb-6">{profile.role}</p>
                  
                  {/* Visualización de Tags SIEMPRE presentes */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    {profile.tags.map(tag => (
                      <TagChip key={tag} text={tag} color={profile.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;