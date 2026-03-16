import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Link2, 
  MapPin, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS (Puedes editar estos links e información) ---
const carouselImages = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
];

const mosaicImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=600&auto=format&fit=crop",
];

const skillsData = [
  "React JS", "Tailwind CSS", "JavaScript ES6", "Git & GitHub", "Node.js", 
  "UI Design", "Figma", "Responsive Design", "GitHub Actions", "Web Vitals"
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100 p-4 md:p-8 lg:p-12 font-sans selection:bg-zinc-700">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* 1. CARROUSEL SUPERIOR */}
        <section className="relative h-[300px] md:h-[450px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-zinc-800 bg-zinc-900 group">
          {carouselImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${index === currentSlide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f]/80 via-transparent to-transparent" />
          
          {/* Botones de navegación */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full hover:bg-white/10 transition border border-white/10 opacity-0 group-hover:opacity-100">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full hover:bg-white/10 transition border border-white/10 opacity-0 group-hover:opacity-100">
            <ChevronRight size={24} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 transition-all rounded-full ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </section>

        {/* 2. TÍTULO, DESCRIPCIÓN Y LINK FALSO (CTA) */}
        <section className="space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            MrMBog Project
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl leading-relaxed">
            Esta plataforma presenta las credenciales verificadas y el proceso de desarrollo técnico realizado. 
            Aquí encontrarás la documentación visual y estructural de los hitos alcanzados en el proyecto.
          </p>
          <div className="flex pt-2">
            <a href="#" className="flex items-center gap-3 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-zinc-300 font-semibold border border-zinc-800 transition-all hover:scale-105 active:scale-95 group">
              <Link2 size={20} className="text-zinc-500 group-hover:text-blue-400" />
              <span>View project material</span>
              <ExternalLink size={14} className="opacity-40" />
            </a>
          </div>
        </section>

        {/* 3. SECCIÓN EXPERIENCIA (Estilo imagen de referencia) */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-zinc-800 rounded-2xl">
                <Briefcase className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold italic tracking-tight">Main Experience</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800/50 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Fullstack Developer & Designer</h3>
                  <div className="flex items-center gap-2 text-zinc-400 font-medium">
                    <span>Credentials Verification System</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="text-zinc-500">MrMBog Inc.</span>
                  </div>
                  <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
                    Desarrollo de una arquitectura escalable para la visualización de portafolios técnicos, optimizando el despliegue mediante CI/CD con GitHub Actions.
                  </p>
                </div>
                <div className="flex flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest shrink-0">
                  <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800"><CalendarDays size={12}/> Mar 2024 - Present</div>
                  <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800"><MapPin size={12}/> Global / Remote</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MOSAICO DE IMÁGENES */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold px-4 flex items-center gap-3">
             Visual Assets <span className="h-px flex-1 bg-zinc-800"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
            {mosaicImages.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-2xl aspect-square border border-zinc-800">
                <img 
                  src={img} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 cursor-zoom-in" 
                  alt="Asset"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 5. TRES SECCIONES VERTICALES (Lo Pedido, Lo Hecho, Lo Logrado) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "LO PEDIDO", 
              desc: "Una interfaz modular que rompa con el esquema de un solo modal, integrando elementos visuales de alta fidelidad y un despliegue automatizado estable.",
              icon: "01"
            },
            { 
              title: "LO HECHO", 
              desc: "Reestructuración del DOM, implementación de carruseles con React Hooks y corrección de flujos de GitHub Actions para garantizar la persistencia de la web.",
              icon: "02"
            },
            { 
              title: "LO LOGRADO", 
              desc: "Un sistema de portafolio que carga en menos de 1s, con diseño dark-mode coherente y una estructura escalable para futuros módulos de información.",
              icon: "03"
            }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/60 hover:border-zinc-500/30 transition-colors group">
              <span className="text-5xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors">{item.icon}</span>
              <h3 className="text-lg font-bold mt-4 mb-3 tracking-widest text-zinc-100">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 6. SKILLS GRISES Y EDUCACIÓN (Al final) */}
        <footer className="pt-10 border-t border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-zinc-900/20 p-8 rounded-[2.5rem] border border-zinc-800">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Award className="text-zinc-500" size={20} />
                <h2 className="text-xl font-bold">Background</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-zinc-800 pl-4 py-1">
                  <p className="font-bold text-zinc-200">Ingeniería de Software</p>
                  <p className="text-sm text-zinc-500 italic">Especialización en Desarrollo Web</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                Core Skills <span className="text-xs font-normal text-zinc-600 uppercase tracking-tighter">(Updated 2024)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsData.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-zinc-800/50 text-zinc-400 text-xs font-bold rounded-xl border border-zinc-800 hover:text-white hover:bg-zinc-800 transition-all cursor-default uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
          
          <div className="text-center mt-12 mb-6">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">
              MrMBog Credentials & Portfolio • Built with React & Tailwind
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;