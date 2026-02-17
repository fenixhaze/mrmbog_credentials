import React, { useState } from 'react';
import { User, ShieldCheck, ChevronRight, GraduationCap } from 'lucide-react';

// CONSTRUCTOR: Las personas SIEMPRE nacen con sus tags definidos aquí
const PEOPLE_DATA = [
  {
    id: 1,
    name: "Estudiante Javeriana",
    role: "Comunicación Digital",
    // Tags fijos y obligatorios
    tags: ["Interacción", "Creatividad", "Estrategia", "UX"],
    color: "indigo"
  },
  {
    id: 2,
    name: "Mentor de Proyecto",
    role: "Facilitador",
    tags: ["Guía", "Metodología", "Feedback"],
    color: "emerald"
  }
];

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto">
      {showOnboarding ? (
        /* COMPONENTE ONBOARDING */
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-600 to-violet-700">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="text-indigo-600" size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Bienvenido a Credentials</h1>
            <p className="text-slate-500 mb-8">Configura y visualiza tus insignias de competencias digitales.</p>
            <button 
              onClick={() => setShowOnboarding(false)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              Comenzar <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* COMPONENTE PRINCIPAL (LISTA DE PERSONAS) */
        <main className="max-w-4xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black mb-10 text-slate-800 border-b pb-4">Directorio de Credenciales</h2>
          <div className="grid gap-6">
            {PEOPLE_DATA.map(person => (
              <div key={person.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-${person.color}-100 text-${person.color}-600`}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{person.name}</h3>
                    <p className="text-slate-500 text-sm">{person.role}</p>
                  </div>
                </div>
                
                {/* TAGS SIEMPRE PRESENTES */}
                <div className="flex flex-wrap gap-2">
                  {person.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;