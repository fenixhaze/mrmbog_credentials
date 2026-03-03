import React, { useState, useEffect } from 'react';
import { MessageSquare, Briefcase, Users, ArrowRight, X, Calendar, Mail, Plus, UserPlus } from 'lucide-react';

// --- COMPONENTE PRINCIPAL ---
export default function MrmCredentialsApp() {
  // 1. ESTADOS DE INTERFAZ
  const [activeTab, setActiveTab] = useState(null); // 'ia', 'proyectos', 'talento'
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 2. ESTADO DEL SQUAD (Fuente de Verdad del usuario)
  const [squad, setSquad] = useState([]);
  const [projectTitle, setProjectTitle] = useState("MI PROYECTO INNOVACIÓN");

  // 3. DATA SIMULADA (Esto vendría de tus OneDrive File IDs vía Power Automate)
  const [projectsData, setProjectsData] = useState([
    {
      id: "ONEDRIVE_FILE_001",
      title: "Migración Azure AI",
      skills: ["React", "Power Automate", "Azure OpenAI", "Node.js"],
      description: "Optimización de flujos de trabajo corporativos usando GPT-4.",
      participants: [
        { id: 'p1', name: "Ana Silva", role: "Fullstack Dev", photo: "https://i.pravatar.cc/150?u=ana", email: "asilva@mrm.com" },
        { id: 'p2', name: "Carlos Ruiz", role: "Cloud Architect", photo: "https://i.pravatar.cc/150?u=carlos", email: "cruiz@mrm.com" }
      ]
    }
  ]);

  // --- LÓGICA DE SQUAD ---
  const addToSquad = (person) => {
    if (!squad.find(p => p.id === person.id)) {
      setSquad(prev => [...prev, person]);
    }
  };

  const addEntireTeamToSquad = (team) => {
    setSquad(prev => {
      const newPeople = team.filter(member => !prev.find(p => p.id === member.id));
      return [...prev, ...newPeople];
    });
  };

  const handleTeamsMeeting = () => {
    const emails = squad.map(p => p.email).join(';');
    window.location.href = `mailto:${emails}?subject=Reunión Squad: ${projectTitle}&body=Hola equipo, agendemos kickoff.`;
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden relative">
      
      {/* --- HEADER & LOGO --- */}
      <div className="absolute top-10 left-10 z-50 pointer-events-none">
        <h1 className="text-6xl font-black italic tracking-tighter leading-none">MRM</h1>
        <div className="flex mt-2 items-center">
          <div className="w-[3px] h-14 bg-indigo-600 mr-4"></div>
          <p className="text-indigo-500 text-[11px] font-bold tracking-[0.2em] leading-tight uppercase">
            Bogotá<br/>Creative<br/>Credentials
          </p>
        </div>
      </div>

      {/* --- TWEAK 3: COMPONENTE "TU SQUAD" (Lado de navegación) --- */}
      <div 
        onClick={() => setShowSquadModal(true)}
        className="absolute top-10 right-10 z-50 flex items-center bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-2 pl-4 rounded-full cursor-pointer hover:border-indigo-500 transition-all group"
      >
        <span className="text-[10px] font-black uppercase tracking-widest mr-4">Tu Squad: ({squad.length})</span>
        <div className="flex -space-x-3 overflow-hidden">
          {squad.map((member, i) => (
            <img 
              key={member.id}
              src={member.photo} 
              className="w-9 h-9 rounded-full border-2 border-black animate-in slide-in-from-right-2 duration-300" 
              style={{ zIndex: 10 - i }}
            />
          ))}
          {squad.length === 0 && <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center"><Users size={14}/></div>}
        </div>
      </div>

      {/* --- COLUMNAS (PILARES PRINCIPALES) --- */}
      
      {/* PILAR 1: CONSULTORÍA IA */}
      <div className="relative w-1/3 h-full border-r border-zinc-900 group cursor-pointer transition-all duration-700 hover:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-20 left-12 z-20">
          <MessageSquare className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={48} strokeWidth={1.5} />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Consultoría<br/>IA</h2>
        </div>
      </div>

      {/* PILAR 2: PROYECTOS (Con Tweak 1: Gradiente Mejorado) */}
      <div 
        className="relative w-1/3 h-full border-r border-zinc-900 group cursor-pointer overflow-hidden"
        onClick={() => setSelectedProject(projectsData[0])}
      >
        {/* Imagen de fondo (OneDrive Placeholder) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center grayscale opacity-30 group-hover:opacity-50 transition-all duration-1000 group-hover:scale-110" />
        
        {/* TWEAK 1: Gradiente para visualización de textos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        <div className="absolute bottom-20 left-12 z-20">
          <Briefcase className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={48} strokeWidth={1.5} />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Proyectos</h2>
        </div>
      </div>

      {/* PILAR 3: TALENTO */}
      <div className="relative w-1/3 h-full group cursor-pointer transition-all duration-700 hover:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-20 left-12 z-20">
          <Users className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={48} strokeWidth={1.5} />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Talento</h2>
        </div>
        <div className="absolute bottom-10 right-10 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-4 rounded-full border border-zinc-700 hover:border-indigo-500 transition-colors">
            <ArrowRight size={24} />
          </div>
        </div>
      </div>

      {/* --- TWEAK 2 & 4: MODAL DE DETALLE DE PROYECTO --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl p-12 relative rounded-lg">
            <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X size={32}/></button>
            
            <h3 className="text-5xl font-black italic uppercase mb-6 tracking-tighter">{selectedProject.title}</h3>
            
            {/* TWEAK 2: Chips de Skills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {selectedProject.skills.map(skill => (
                <span key={skill} className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            {/* TWEAK 4: Personas con Tarjetas y CTA individual */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {selectedProject.participants.map(person => (
                <div key={person.id} className="bg-zinc-900/50 p-4 border border-zinc-800 flex items-center justify-between group/card hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={person.photo} className="w-12 h-12 rounded-full border border-zinc-700" alt={person.name} />
                    <div>
                      <p className="text-sm font-bold uppercase italic">{person.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{person.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToSquad(person)}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-indigo-600 transition-colors text-white"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { addEntireTeamToSquad(selectedProject.participants); setSelectedProject(null); }}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] italic transition-all flex items-center justify-center gap-3"
            >
              <Plus size={20} /> Agrega a tu squad
            </button>
          </div>
        </div>
      )}

      {/* --- TWEAK 5: MODAL OVERVIEW TU SQUAD --- */}
      {showSquadModal && (
        <div className="fixed inset-0 z-[70] bg-black backdrop-blur-2xl flex items-center justify-center animate-in zoom-in-95 duration-300">
          <button onClick={() => setShowSquadModal(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white"><X size={48}/></button>
          
          <div className="w-full max-w-5xl px-10">
            {/* Titulo editable */}
            <input 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent text-7xl font-black italic uppercase border-b-4 border-zinc-800 focus:border-indigo-600 outline-none w-full pb-4 mb-12 tracking-tighter"
            />

            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-4 bg-zinc-900/30 p-8 border-l-4 border-indigo-600">
                <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Resumen Chatbot IA</p>
                <p className="text-zinc-400 italic leading-relaxed">
                  "Basado en tus requerimientos, este squad combina expertos en automatización y desarrollo front-end. Han colaborado previamente en proyectos de Azure garantizando una entrega fluida."
                </p>
              </div>

              <div className="col-span-8">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-right">Participantes Seleccionados ({squad.length})</p>
                <div className="flex flex-wrap gap-6 justify-end mb-12">
                  {squad.map(p => (
                    <div key={p.id} className="text-center group">
                      <img src={p.photo} className="w-20 h-20 rounded-full border-2 border-zinc-800 group-hover:border-indigo-500 transition-all mb-2 shadow-2xl" alt="" />
                      <p className="text-[10px] font-bold uppercase">{p.name.split(' ')[0]}</p>
                    </div>
                  ))}
                  {squad.length === 0 && <p className="text-zinc-700 italic">No hay miembros seleccionados aún.</p>}
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                    <Mail size={18} /> Formulario de Contacto
                  </button>
                  <button 
                    onClick={handleTeamsMeeting}
                    className="flex-1 py-6 bg-white text-black hover:bg-indigo-500 hover:text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all"
                  >
                    <Calendar size={18} /> Reunión de Teams
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}