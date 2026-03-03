import React, { useState } from 'react';
import { MessageSquare, Briefcase, Users, ArrowRight, Plus, X, Mail, Calendar } from 'lucide-react';

export default function MrmApp() {
  // --- Estados de Lógica ---
  const [squad, setSquad] = useState([]);
  const [showSquadDetail, setShowSquadDetail] = useState(false);
  const [projectName, setProjectName] = useState("PROYECTO SIN TÍTULO");

  // --- Datos de OneDrive (Placeholder) ---
  const projectInfo = {
    id: "ONEDRIVE_ID_123",
    skills: ["React", "Azure", "AI", "UX"],
    team: [
      { id: 1, name: "Ana Silva", role: "Dev", photo: "https://i.pravatar.cc/100?u=1", email: "a@mrm.com" },
      { id: 2, name: "Carlos R.", role: "Arch", photo: "https://i.pravatar.cc/100?u=2", email: "c@mrm.com" }
    ]
  };

  // --- Handlers ---
  const addToSquad = (person) => {
    if (!squad.find(p => p.id === person.id)) setSquad([...squad, person]);
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden select-none">
      
      {/* TWEAK 3: COMPONENTE TU SQUAD (Al lado del logo, ultra minimalista) */}
      <div 
        onClick={() => setShowSquadDetail(true)}
        className="absolute top-10 right-10 z-50 flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-4 rounded-full cursor-pointer hover:bg-white/10 transition-all"
      >
        <span className="text-[10px] font-bold tracking-widest">TU SQUAD ({squad.length})</span>
        <div className="flex -space-x-2">
          {squad.map(p => (
            <img key={p.id} src={p.photo} className="w-7 h-7 rounded-full border border-black animate-in fade-in zoom-in" />
          ))}
        </div>
      </div>

      {/* BRANDING (Idéntico a la imagen) */}
      <div className="absolute top-10 left-10 z-50">
        <h1 className="text-6xl font-black italic tracking-tighter leading-[0.8]">MRM</h1>
        <div className="flex mt-3">
          <div className="w-[2px] h-12 bg-indigo-600 mr-3"></div>
          <p className="text-indigo-500 text-[10px] font-bold tracking-[0.2em] leading-tight uppercase">
            Bogotá<br/>Creative<br/>Credentials
          </p>
        </div>
      </div>

      {/* COLUMNA 1: CONSULTORÍA IA */}
      <div className="relative w-1/3 h-full border-r border-white/5 group cursor-pointer transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-20 left-10 z-20">
          <MessageSquare className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Consultoría IA</h2>
        </div>
      </div>

      {/* COLUMNA 2: PROYECTOS (Tweak 1, 2 y 4 integrados aquí) */}
      <div className="relative w-1/3 h-full border-r border-white/5 group overflow-hidden">
        {/* Tweak 1: Gradiente de negro a opacidad 0 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516116216624-53e697fedbea')] bg-cover bg-center grayscale opacity-30 group-hover:opacity-50 transition-all duration-1000" />
        
        <div className="absolute bottom-20 left-10 z-20 w-full pr-20">
          <Briefcase className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Proyectos</h2>
          
          {/* Tweak 2 & 4: Info que aparece al hacer hover o interactuar */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 space-y-4">
            <div className="flex gap-1">
              {projectInfo.skills.map(s => (
                <span key={s} className="text-[8px] border border-white/20 px-2 py-0.5 rounded uppercase font-bold text-white/60">{s}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {projectInfo.team.map(p => (
                  <img key={p.id} src={p.photo} className="w-8 h-8 rounded-full border border-black hover:scale-110 transition-transform cursor-pointer" title={`Añadir ${p.name}`} onClick={() => addToSquad(p)} />
                ))}
              </div>
              <button onClick={() => setSquad([...squad, ...projectInfo.team])} className="text-[9px] font-bold text-indigo-500 hover:text-white uppercase tracking-widest ml-2">
                + Agregar Todo el Squad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMNA 3: TALENTO */}
      <div className="relative w-1/3 h-full group cursor-pointer transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-20 left-10 z-20">
          <Users className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Talento</h2>
        </div>
        <div className="absolute bottom-10 right-10 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-4 border border-white/10 rounded-full hover:border-indigo-600 transition-colors">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* TWEAK 5: MODAL OVERVIEW (Solo se activa al clickear "Tu Squad") */}
      {showSquadDetail && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-10 animate-in fade-in">
          <button onClick={() => setShowSquadDetail(false)} className="absolute top-10 right-10 hover:rotate-90 transition-transform"><X size={40}/></button>
          
          <div className="max-w-4xl w-full">
            <input 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent text-6xl font-black italic uppercase border-b-2 border-white/10 focus:border-indigo-600 outline-none w-full mb-8 pb-4 tracking-tighter text-indigo-600"
            />
            
            <div className="grid grid-cols-2 gap-20">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Resumen IA (OneDrive Analysis)</p>
                <p className="text-xl text-white/80 leading-relaxed italic border-l-4 border-indigo-600 pl-6">
                  "Basado en el prompt, este equipo tiene el expertise técnico para ejecutar la arquitectura Azure solicitada."
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Squad Seleccionado</p>
                <div className="flex flex-wrap gap-4 mb-10">
                  {squad.map(p => (
                    <div key={p.id} className="text-center">
                      <img src={p.photo} className="w-16 h-16 rounded-full mb-2 border border-white/10 shadow-xl" />
                      <p className="text-[9px] font-bold uppercase">{p.name}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white text-black font-bold py-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                    <Mail size={16}/> Contactar
                  </button>
                  <button className="flex-1 border border-white text-white font-bold py-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                    <Calendar size={16}/> Agendar Teams
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