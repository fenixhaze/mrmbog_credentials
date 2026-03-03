import React, { useState } from 'react';
import { MessageSquare, Briefcase, Users, ArrowRight, X, Calendar, Mail, Plus } from 'lucide-react';

export default function CredentialDashboard() {
  // Estados originales
  const [isChatOpen, setIsChatOpen] = useState(false);

  // NUEVOS ESTADOS PARA LOS TWEAKS
  const [squad, setSquad] = useState([]); // Almacena las personas agregadas
  const [activeModal, setActiveModal] = useState(null); // 'project' | 'squad' | null
  const [squadProjectTitle, setSquadProjectTitle] = useState('Mi Nuevo Proyecto IA');

  // Datos simulados (Fuente de verdad) que vendrían de OneDrive
  const dummyProject = {
    title: 'Migración a Azure & Power Automate',
    skills: ['React', 'Node.js', 'Power Automate', 'Azure OpenAI'],
    people: [
      { id: 1, name: 'Ana Silva', role: 'Frontend Dev', photo: '/api/placeholder/100/100', email: 'ana@mrm.com' },
      { id: 2, name: 'Carlos Ruiz', role: 'Cloud Architect', photo: '/api/placeholder/100/100', email: 'carlos@mrm.com' },
      { id: 3, name: 'Laura Gómez', role: 'UX/UI Designer', photo: '/api/placeholder/100/100', email: 'laura@mrm.com' }
    ]
  };

  const handleOpenChat = () => setIsChatOpen(true);
  
  const fetchProjectsFromOneDrive = () => {
    // Simulamos la carga del proyecto y abrimos el modal
    setActiveModal('project');
  };

  const fetchTalentFromOneDrive = () => {
    console.log("Llamando al ID del archivo de OneDrive en Azure para TALENTO...");
  };

  // TWEAK 3 & 4: Lógica para agregar personas al squad sin duplicados
  const addToSquad = (peopleToAdd) => {
    setSquad(prevSquad => {
      const newSquad = [...prevSquad];
      peopleToAdd.forEach(person => {
        if (!newSquad.find(p => p.id === person.id)) {
          newSquad.push(person);
        }
      });
      return newSquad;
    });
  };

  const handleCreateTeamsMeeting = () => {
    const emails = squad.map(p => p.email).join(';');
    window.location.href = `mailto:${emails}?subject=Reunión Kickoff: ${squadProjectTitle}&body=Hola equipo, agendemos para revisar los requerimientos del proyecto.`;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-sans overflow-hidden relative">
      
      {/* TWEAK 3: BARRA DE NAVEGACIÓN Y COMPONENTE "TU SQUAD" */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-start p-10 z-50 pointer-events-none">
        {/* Logo MRM */}
        <div className="pointer-events-auto">
          <h1 className="text-5xl font-extrabold italic tracking-tighter">MRM</h1>
          <div className="flex mt-2">
            <div className="w-[2px] h-12 bg-indigo-500 mr-3"></div>
            <p className="text-indigo-400 text-xs font-semibold tracking-widest leading-tight uppercase">
              Bogotá<br/>Creative<br/>Credentials
            </p>
          </div>
        </div>

        {/* Componente "Tu Squad" estático y clickeable */}
        <div 
          onClick={() => setActiveModal('squad')}
          className="pointer-events-auto flex items-center gap-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 p-3 rounded-full cursor-pointer hover:border-indigo-500 transition-colors shadow-lg group"
        >
          <div className="flex items-center gap-2 px-2">
            <Users className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
            <span className="font-semibold text-sm">Tu Squad: ({squad.length})</span>
          </div>
          
          {/* TWEAK 3: Animación suave de fotos sumándose */}
          <div className="flex -space-x-3 pr-2">
            {squad.map((person, idx) => (
              <img 
                key={person.id} 
                src={person.photo} 
                alt={person.name} 
                className="w-8 h-8 rounded-full border-2 border-gray-900 animate-in fade-in slide-in-from-right-4 duration-500"
                style={{ zIndex: squad.length - idx }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE LAS 3 COLUMNAS */}
      <div className="flex h-full w-full pt-0">
        
        {/* COLUMNA 1: CONSULTORÍA IA */}
        <div 
          className="relative w-1/3 h-full border-r border-gray-800 cursor-pointer group hover:bg-gray-900 transition-colors duration-500"
          onClick={handleOpenChat}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
          
          {/* TWEAK 1: Gradiente de negro a opacidad 0 para resaltar títulos y CTA */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>

          <div className="absolute bottom-16 left-10 z-10">
            <MessageSquare className="w-10 h-10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h2 className="text-4xl font-extrabold italic uppercase tracking-wide">Consultoría IA</h2>
          </div>
        </div>

        {/* COLUMNA 2: PROYECTOS */}
        <div 
          className="relative w-1/3 h-full border-r border-gray-800 cursor-pointer group"
          onClick={fetchProjectsFromOneDrive}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700"
            style={{ backgroundImage: "url('/api/placeholder/600/1000')" }}
          ></div>
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* TWEAK 1: Gradiente */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>

          <div className="absolute bottom-16 left-10 z-10">
            <Briefcase className="w-10 h-10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h2 className="text-4xl font-extrabold italic uppercase tracking-wide">Proyectos</h2>
          </div>
        </div>

        {/* COLUMNA 3: TALENTO */}
        <div 
          className="relative w-1/3 h-full cursor-pointer group"
          onClick={fetchTalentFromOneDrive}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700"
            style={{ backgroundImage: "url('/api/placeholder/600/1000')" }}
          ></div>
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* TWEAK 1: Gradiente */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>

          <div className="absolute bottom-16 left-10 z-10">
            <Users className="w-10 h-10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h2 className="text-4xl font-extrabold italic uppercase tracking-wide">Talento</h2>
          </div>

          <div className="absolute bottom-10 right-10 z-10">
            <button className="p-3 rounded-full border border-gray-600 hover:border-indigo-500 hover:bg-indigo-500/20 transition-all duration-300 text-gray-400 hover:text-white">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>

      {/* CHATBOT (Original) */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-900 border-l border-gray-700 shadow-2xl p-6 z-[60] flex flex-col animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-400">MRM IA Assistant</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
          </div>
          <div className="flex-grow bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm text-gray-300 overflow-y-auto">
            <p>&gt; Inicializando conexión segura con Azure...</p>
            <p>&gt; Buscando el mejor squad para tu proyecto...</p>
          </div>
          <input 
            type="text" 
            placeholder="Describe tu proyecto aquí..." 
            className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* MODALES OVERLAY */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          
          {/* TWEAK 2 & 4: MODAL DE PROYECTOS */}
          {activeModal === 'project' && (
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl max-w-2xl w-full relative animate-in zoom-in-95">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
              
              <h3 className="text-3xl font-extrabold italic mb-4">{dummyProject.title}</h3>
              
              {/* TWEAK 2: Chips de skills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {dummyProject.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-indigo-900/50 border border-indigo-500/30 text-indigo-200 text-xs rounded-full font-semibold uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>

              {/* TWEAK 4: Tarjetas específicas de personas */}
              <div className="mb-8">
                <h4 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">Equipo involucrado</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dummyProject.people.map(person => (
                    <div key={person.id} className="flex items-center gap-4 bg-black/50 p-3 rounded-lg border border-gray-800">
                      <img src={person.photo} alt={person.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold text-sm">{person.name}</p>
                        <p className="text-xs text-indigo-400">{person.role}</p>
                      </div>
                      <button 
                        onClick={() => addToSquad([person])}
                        className="ml-auto p-2 bg-gray-800 hover:bg-indigo-600 rounded-full transition-colors"
                        title="Agregar persona al squad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TWEAK 4: CTA para agregar a todo el equipo */}
              <button 
                onClick={() => {
                  addToSquad(dummyProject.people);
                  setActiveModal(null);
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                AGREGA ESTE EQUIPO A TU SQUAD
              </button>
            </div>
          )}

          {/* TWEAK 5: MODAL "TU SQUAD" (OVERVIEW) */}
          {activeModal === 'squad' && (
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl max-w-3xl w-full relative animate-in zoom-in-95">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
              
              {/* Posibilidad de editar el título */}
              <input 
                type="text" 
                value={squadProjectTitle}
                onChange={(e) => setSquadProjectTitle(e.target.value)}
                className="text-3xl font-extrabold italic mb-4 bg-transparent border-b border-dashed border-gray-600 focus:border-indigo-500 focus:outline-none w-full pb-2"
              />

              {/* Resumen del requerimiento (Escrito por el Chatbot) */}
              <div className="bg-black/50 border border-gray-800 p-4 rounded-lg mb-6">
                <h4 className="text-xs text-indigo-400 font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Resumen generado por IA
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Basado en la conversación, se requiere un equipo especializado en integración de arquitecturas Cloud y React para desarrollar una plataforma interna segura. El equipo seleccionado posee los skills exactos en Power Automate, Node.js y Azure OpenAI.
                </p>
              </div>

              {/* Personas involucradas */}
              <div className="mb-8">
                <h4 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">Tu Squad ({squad.length})</h4>
                {squad.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">Aún no has agregado talentos a tu squad.</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {squad.map(person => (
                      <div key={person.id} className="flex flex-col items-center bg-black/40 p-4 rounded-xl border border-gray-800 w-32">
                        <img src={person.photo} alt={person.name} className="w-16 h-16 rounded-full mb-3 shadow-md" />
                        <p className="font-bold text-xs text-center">{person.name}</p>
                        <p className="text-[10px] text-indigo-400 text-center uppercase mt-1">{person.role}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dos CTAs: Formulario y Teams */}
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-600 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  FORMULARIO DE CONTACTO
                </button>
                <button 
                  onClick={handleCreateTeamsMeeting}
                  disabled={squad.length === 0}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  AGENDAR EN TEAMS
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}