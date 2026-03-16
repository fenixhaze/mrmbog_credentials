import React, { useState } from 'react';
import { 
  Briefcase, GraduationCap, Link2, MapPin, 
  CalendarDays, ChevronLeft, ChevronRight, ExternalLink,
  Mail, Github, Linkedin, User
} from 'lucide-react';

// --- DATOS DEL PROYECTO ---
const carouselImages = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
];

const mosaicImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=600&auto=format&fit=crop",
];

const projectSkills = ["React", "Tailwind CSS", "Node.js", "GitHub Actions", "Git"];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100 p-6 md:p-12 font-sans selection:bg-zinc-700">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* --- 1. CABECERA --- */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-zinc-900 pb-10">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-zinc-700 shadow-2xl shrink-0 rotate-3" />
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-5xl font-black tracking-tighter">MrMBog</h1>
              <p className="text-zinc-400 text-lg font-medium">Digital Product Developer & Tech Enthusiast</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5"><MapPin size={14}/> Bogotá, CO</span>
              <span className="flex items-center gap-1.5"><Mail size={14}/> contact@mrmbog.com</span>
            </div>
          </div>
        </header>

        {/* --- 2. ABOUT ME --- */}
        <section className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User size={20} className="text-zinc-600"/> About Me
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Especializado en crear soluciones digitales escalables. Mi enfoque combina el diseño técnico riguroso con una implementación limpia y eficiente, asegurando que cada proyecto cumpla con los más altos estándares de calidad.
          </p>
        </section>

        {/* --- 3. PROYECTO (EL COMPONENTE ACTUALIZADO) --- */}
        <section className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl transition-all hover:border-zinc-700">
          
          {/* Carrusel */}
          <div className="relative h-72 w-full bg-zinc-800 group">
            {carouselImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`} 
                alt="Project detail" 
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 hover:bg-black/80 transition">
              <ChevronLeft size={20}/>
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 hover:bg-black/80 transition">
              <ChevronRight size={20}/>
            </button>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {/* Info del Proyecto */}
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Featured Project</span>
                  <h2 className="text-4xl font-extrabold tracking-tight">Credentials System 2.0</h2>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  <span className="bg-zinc-800 px-2 py-1 rounded">Vite + React</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded">CI/CD Enabled</span>
                </div>
              </div>
              
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                Ecosistema digital diseñado para la validación de material técnico. Integra una arquitectura de componentes modulares y despliegue automatizado.
              </p>

              <div className="flex">
                <a href="#" className="flex items-center gap-3 px-6 py-3 bg-zinc-800/80 hover:bg-zinc-700 rounded-2xl text-sm font-bold border border-zinc-700/50 transition-all text-zinc-300 group">
                  <Link2 size={18} className="text-zinc-500 group-hover:text-zinc-100 transition-colors" />
                  <span>View verified material</span>
                  <ExternalLink size={14} className="opacity-30" />
                </a>
              </div>
            </div>

            {/* Mosaico */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Project Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mosaicImages.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 aspect-square">
                    <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" alt="Mosaic" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-zinc-800/50">
              {[
                { label: "LO PEDIDO", content: "Interfaz dinámica, tarjetas separadas y despliegue automático en GH Pages." },
                { label: "LO HECHO", content: "Configuración de Workflows, lógica de carrusel y estilización con Tailwind CSS." },
                { label: "LO LOGRADO", content: "Un flujo de trabajo profesional y una UI cinematográfica de alta respuesta." }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">{item.label}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">{item.content}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="pt-6 flex flex-wrap gap-2">
              {projectSkills.map(s => (
                <span key={s} className="px-3 py-1 bg-zinc-800/40 text-zinc-500 text-[10px] font-bold rounded-lg border border-zinc-800/50 uppercase tracking-tighter">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --- 4. EDUCACIÓN Y REDES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="p-3 bg-zinc-800 w-fit rounded-2xl group-hover:bg-zinc-700 transition-colors">
                <GraduationCap size={24}/>
              </div>
              <h3 className="font-bold text-xl tracking-tight">Education</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Bachelor in Computer Science & Multimedia Design. Focused on user experience and system architecture.
              </p>
            </div>
            <div className="mt-6 text-zinc-600 text-xs font-mono uppercase tracking-widest">2018 — 2022</div>
          </div>

          <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 space-y-6">
            <h3 className="font-bold text-xl tracking-tight">Connect</h3>
            <div className="space-y-3">
              {[
                { icon: <Github size={18}/>, label: "GitHub", handle: "@fenixhaze" },
                { icon: <Linkedin size={18}/>, label: "LinkedIn", handle: "/in/mrmbog" }
              ].map((social, i) => (
                <a key={i} href="#" className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-200">
                    {social.icon}
                    <span className="text-sm font-bold">{social.label}</span>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono">{social.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="text-center pt-10 pb-6">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.4em]">MrMBog Digital Portfolio © 2026</p>
        </footer>

      </div>
    </div>
  );
}

export default App;