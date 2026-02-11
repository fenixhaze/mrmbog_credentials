import React, { useState, useMemo } from 'react';

/** * @section CONFIGURACIÓN DE IDENTIDAD VISUAL (MRM BRANDING)
 * Centralización de constantes estéticas para facilitar cambios de tema globales.
 */
const lila = "rgb(143, 134, 255)"; // Color primario
const aqua = "#4ade80";           // Color para aciertos/impacto
const yellow = "#fbbf24";         // Color para herramientas/AI
const darkBg = "#0f1115";         // Fondo profundo
const cardBg = "rgba(255, 255, 255, 0.03)"; // Glassmorphism base

/**
 * @section HOJA DE ESTILOS DINÁMICA
 * Definición de animaciones y clases CSS para el DOM.
 */
const styleSheet = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

body { margin: 0; background-color: ${darkBg}; font-family: 'Inter', sans-serif; color: white; }

/* Header con efecto Blur y posicionamiento fijo */
.header-anchor {
  position: fixed; top: 0; left: 0; right: 0; height: 90px;
  padding: 0 60px; display: flex; justify-content: space-between;
  align-items: center; z-index: 1000;
  backdrop-filter: blur(30px); border-bottom: 1px solid rgba(255,255,255,0.03);
}

/* Buscador animado */
.search-input-header {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 10px 20px; color: white; outline: none;
  font-size: 13px; width: 250px; transition: all 0.3s ease;
}
.search-input-header:focus { border-color: ${lila}; width: 300px; background: rgba(255,255,255,0.08); }

/* Tarjetas de talento con efecto de elevación */
.card-talent { 
  position: relative; transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); 
  border: 1px solid rgba(255,255,255,0.08); background: ${cardBg}; cursor: pointer; 
  overflow: hidden;
}
.card-talent:hover { transform: translateY(-10px); border-color: ${lila}; background: rgba(255,255,255,0.06); }

/* Animación de carga para las barras de skills */
@keyframes fillBar { from { width: 0; } }
.skill-bar-inner { animation: fillBar 1.2s ease forwards; }

.onboarding-tag {
  padding: 12px 20px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
  font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.3s ease;
  background: transparent; color: #64748b;
}
.onboarding-tag.active { border-color: ${lila}; background: rgba(143, 134, 255, 0.1); color: white; }
`;

/**
 * @section HELPERS & DATA GENERATORS
 * Funciones para simular contenido dinámico por perfil.
 */
const availableTags = ["UI/UX", "Motion", "AI Strategy", "Branding", "3D Design", "Data Viz", "Creative Copy", "Creative Tech", "Experience Design", "Project Management"];

const generateWorks = () => [
  { id: Math.random(), title: 'Global Campaign 2026', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800', desc: 'Digital transformation project.', achievements: ['Reducción 40% tiempo prod.', 'Scalable System'] },
  { id: Math.random(), title: 'AI Interface Prototype', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', desc: 'Generative UI implementation.', achievements: ['Patente voz', '85% Sat'] }
];

const generateSkills = () => [
  { category: 'Hard Skills', items: [{ n: 'Creative Strategy', v: 92, c: lila, radarMap: 0 }, { n: 'Digital Craft', v: 95, c: lila, radarMap: 2 }] },
  { category: 'Soft Skills', items: [{ n: 'Leadership', v: 90, c: aqua, radarMap: 3 }] },
  { category: 'Tools & AI', items: [{ n: 'AI Workflows', v: 88, c: yellow, radarMap: 4 }] }
];

/**
 * @section DATA SOURCE
 * Base de datos de los 26 talentos con roles actualizados.
 */
const profilesData = [
  { id: "1", name: "German Bernardo Jose Herrera", role: "Creative Director", email: "g.herrera@mrm.com", tags: ["Branding", "AI Strategy"], photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800" },
  { id: "2", name: "Darwin Jose Silva", role: "Art Director", email: "d.silva@mrm.com", tags: ["UI/UX", "3D Design"], photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800" },
  { id: "3", name: "Stephany Diaz", role: "Senior Digital Designer", email: "s.diaz@mrm.com", tags: ["Motion", "UI/UX"], photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800" },
  { id: "4", name: "Laura Patino", role: "Creative Operations Manager", email: "l.patino@mrm.com", tags: ["Project Management", "Data Viz"], photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800" },
  { id: "5", name: "Ana Maria Nino", role: "Digital Designer Semi Senior", email: "a.nino@mrm.com", tags: ["UI/UX", "Branding"], photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800" },
  { id: "6", name: "David Ricardo Angel", role: "Digital Designer Semi Senior", email: "d.angel@mrm.com", tags: ["Creative Tech", "AI Strategy"], photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" },
  { id: "7", name: "Sara Maria Builes", role: "Creative Digital Specialist", email: "s.builes@mrm.com", tags: ["Data Viz", "Experience Design"], photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800" },
  { id: "8", name: "Mariana Osorio", role: "Digital Designer Semi Senior", email: "m.osorio@mrm.com", tags: ["UI/UX", "Motion"], photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800" },
  { id: "9", name: "Camilo Esteban Vaca", role: "Digital Designer Semi Senior", email: "c.vaca@mrm.com", tags: ["Creative Tech", "UI/UX"], photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800" },
  { id: "10", name: "Juan Pablo Pabon", role: "Senior Digital Designer", email: "j.pabon@mrm.com", tags: ["UI/UX", "Branding"], photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800" },
  { id: "11", name: "Juan Diego Cordoba", role: "Senior Presentation Designer", email: "j.cordoba@mrm.com", tags: ["Branding", "Motion"], photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800" },
  { id: "12", name: "Juan Camilo Bahamon", role: "Senior UX/UI Designer", email: "j.bahamon@mrm.com", tags: ["UI/UX", "Experience Design"], photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800" },
  { id: "13", name: "Marina Esther Montero", role: "Semi Senior Digital Designer", email: "m.montero@mrm.com", tags: ["UI/UX", "Creative Tech"], photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2a04?w=800" },
  { id: "14", name: "Agustina De Girolamo", role: "UX/UI Analyst", email: "a.girolamo@mrm.com", tags: ["Data Viz", "UI/UX"], photo: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800" },
  { id: "15", name: "Mariapaula Fernandez", role: "Semi Senior Digital Designer", email: "m.fernandez@mrm.com", tags: ["Branding", "UI/UX"], photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800" },
  { id: "16", name: "Mariana Ceballos", role: "Semi Senior Digital Designer", email: "m.ceballos@mrm.com", tags: ["UI/UX", "Experience Design"], photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800" },
  { id: "17", name: "Ricardo Gomez", role: "Technical Lead", email: "r.gomez@mrm.com", tags: ["Creative Tech", "AI Strategy"], photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800" },
  { id: "18", name: "Angela Restrepo", role: "Account Director", email: "a.restrepo@mrm.com", tags: ["Project Management"], photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800" },
  { id: "19", name: "Fernando Ruiz", role: "Motion Designer", email: "f.ruiz@mrm.com", tags: ["Motion", "3D Design"], photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800" },
  { id: "20", name: "Lucia Salazar", role: "Copywriter Senior", email: "l.salazar@mrm.com", tags: ["Creative Copy", "Branding"], photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800" },
  { id: "21", name: "Mateo Villalba", role: "UI Designer", email: "m.villalba@mrm.com", tags: ["UI/UX", "Branding"], photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800" },
  { id: "22", name: "Sofia Arango", role: "Data Analyst", email: "s.arango@mrm.com", tags: ["Data Viz", "AI Strategy"], photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800" },
  { id: "23", name: "Carlos Mario Duque", role: "Creative Lead", email: "c.duque@mrm.com", tags: ["Branding", "Creative Tech"], photo: "https://images.unsplash.com/photo-1441786426383-bb306fc26cc7?w=800" },
  { id: "24", name: "Valeria Ortiz", role: "UX Researcher", email: "v.ortiz@mrm.com", tags: ["Experience Design", "UI/UX"], photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=800" },
  { id: "25", name: "Andres Felipe Cano", role: "Senior Developer", email: "a.cano@mrm.com", tags: ["Creative Tech", "Data Viz"], photo: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800" },
  { id: "26", name: "Paula Andrea Rios", role: "Visual Designer", email: "p.rios@mrm.com", tags: ["Branding", "UI/UX"], photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800" }
].map(p => ({ ...p, works: generateWorks(), categorizedSkills: generateSkills() }));

/**
 * @component SkillRadar
 * @description Genera un gráfico radial dinámico usando SVG.
 * @param {Array} skills - Habilidades categorizadas del usuario.
 * @param {Number} activeIndex - Índice de la habilidad resaltada para interactividad.
 */
const SkillRadar = ({ skills, activeIndex }) => {
  // Memorización del cálculo de puntos del radar para optimizar performance
  const radarValues = useMemo(() => {
    const axes = [0, 0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0, 0];
    skills.forEach(cat => cat.items.forEach(s => { axes[s.radarMap] += s.v; counts[s.radarMap] += 1; }));
    return axes.map((val, i) => (counts[i] > 0 ? val / counts[i] : 20));
  }, [skills]);

  const labels = ['Visual', 'Motion', 'UX', 'Strat', 'AI', 'Data'];
  
  // Mapeo circular (Trigonometría básica para coordenadas SVG)
  const points = radarValues.map((v, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (v / 100) * 80; // Radio máximo de 80 unidades
    return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle) };
  });

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ width: '100%', height: '230px', marginBottom: '25px' }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        {/* Círculos de referencia concéntricos */}
        {[80, 60, 40].map(r => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 2" />)}
        
        {/* Ejes y Etiquetas */}
        {labels.map((l, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          const isActive = activeIndex === i;
          return (
            <g key={l}>
              <line x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke={isActive ? lila : "rgba(255,255,255,0.1)"} strokeWidth={isActive ? 2 : 0.5} />
              <text x={100 + 105 * Math.cos(angle)} y={100 + 105 * Math.sin(angle)} fill={isActive ? "white" : "#64748b"} fontSize={isActive ? "10" : "8"} fontWeight="900" textAnchor="middle">{l}</text>
            </g>
          );
        })}
        {/* Polígono del radar */}
        <polygon points={polyPoints} fill={`${lila}33`} stroke={lila} strokeWidth="2.5" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={lila} />)}
      </svg>
    </div>
  );
};

/**
 * @component App (Main Entry Point)
 * @description Orquestador principal de la aplicación. Gestiona estados de filtrado, equipo y vistas.
 */
export default function App() {
  // --- ESTADOS LOCALES ---
  const [step, setStep] = useState('onboarding');     // 'onboarding' | 'grid' | 'deck'
  const [projectTitle, setProjectTitle] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Filtros de tags
  const [myTeam, setMyTeam] = useState([]);           // Carrito de talentos seleccionados
  const [selProfile, setSelProfile] = useState(null);   // Perfil en vista detallada
  const [showModal, setShowModal] = useState(false);    // Control de modal de equipo
  const [modalView, setModalView] = useState('list');   // 'list' | 'form' en modal
  const [openWorkId, setOpenWorkId] = useState(null);   // Control de acordeón de portafolio
  const [hoveredRadarIdx, setHoveredRadarIdx] = useState(null); // Feedback visual radar
  const [searchTerm, setSearchTerm] = useState('');     // Texto de búsqueda libre

  /**
   * @logic Filtrado de Perfiles
   * Combina búsqueda por texto y filtrado por tags de especialidad.
   */
  const filteredProfiles = useMemo(() => {
    return profilesData.filter(p => {
      const matchTags = selectedTags.length === 0 || selectedTags.some(t => p.tags.includes(t));
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.role.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTags && matchSearch;
    });
  }, [selectedTags, searchTerm]);

  // --- HANDLERS ---
  const isAlreadyAdded = (id) => myTeam.some(m => m.id === id);
  const removeFromTeam = (id) => setMyTeam(myTeam.filter(t => t.id !== id));

  /** Genera un link Mail-to para convocar a todo el equipo seleccionado */
  const handleTeamsMeeting = () => {
    const emails = myTeam.map(m => m.email).join(';');
    window.location.href = `mailto:${emails}?subject=Project Kickoff: ${projectTitle}&body=Hola equipo, agendemos la reunión de inicio para el proyecto.`;
  };

  /** Header Reutilizable */
  const renderHeader = () => (
    <header className="header-anchor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 onClick={() => setStep('grid')} style={{ color: lila, fontSize: '22px', fontWeight: '900', cursor: 'pointer', margin: 0 }}>MRM Bogotá</h1>
        {step === 'grid' && (
          <input 
            className="search-input-header" 
            placeholder="Search talent or role..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => setStep('onboarding')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', padding: '10px 20px', borderRadius: '100px', fontSize: '9px', fontWeight: '800', cursor: 'pointer' }}>Re-brief</button>
        {myTeam.length > 0 && (
          <div onClick={() => { setShowModal(true); setModalView('list'); }} style={{ background: 'rgba(143, 134, 255, 0.1)', border: `1px solid ${lila}44`, padding: '8px 20px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ display: 'flex' }}>{myTeam.map((m, i) => <img key={i} src={m.photo} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${darkBg}`, marginLeft: i === 0 ? 0 : '-10px', objectFit: 'cover' }} />)}</div>
             <span style={{ fontSize: '10px', fontWeight: '900', color: lila }}>Overview ({myTeam.length})</span>
          </div>
        )}
      </div>
    </header>
  );

  /** RENDER: PASO 1 - ONBOARDING / BRIEFING */
  if (step === 'onboarding') {
    return (
      <div style={{ backgroundColor: darkBg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{styleSheet}</style>
        <div style={{ width: '90%', maxWidth: '900px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '80px', fontWeight: '900', color: lila, margin: 0 }}>MRM Bogotá</h1>
          <p style={{ color: '#64748b', fontWeight: '700', letterSpacing: '4px', marginBottom: '50px' }}>Profile Matching</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input value={projectTitle} onChange={(e)=>setProjectTitle(e.target.value)} placeholder="Client / Project Name" style={{ background: cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '25px', borderRadius: '25px', color: 'white', outline: 'none' }} />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{availableTags.map(t => (<button key={t} className={`onboarding-tag ${selectedTags.includes(t) ? 'active' : ''}`} onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t])}>{t}</button>))}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <textarea value={projectBrief} onChange={(e)=>setProjectBrief(e.target.value)} placeholder="Project Challenge..." style={{ height: '250px', background: cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '25px', borderRadius: '25px', color: 'white', resize: 'none', outline: 'none' }} />
              <button onClick={() => setStep('grid')} style={{ padding: '25px', borderRadius: '25px', background: lila, color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer' }}>Match {filteredProfiles.length} Talents</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** RENDER: PASOS 2 & 3 - GRID Y DETALLE */
  return (
    <div style={{ backgroundColor: darkBg, minHeight: '100vh', paddingTop: '110px' }}>
      <style>{styleSheet}</style>
      {renderHeader()}

      {/* MODAL GLOBAL: Gestión de equipo y envío de proyecto */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div style={{ background: '#0f1115', width: '480px', borderRadius: '40px', border: `1px solid ${lila}33`, padding: '40px' }} onClick={e => e.stopPropagation()}>
            {modalView === 'list' ? (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: '24px', fontWeight: '900' }}>Team Overview</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '30px' }}>
                  {myTeam.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <img src={m.photo} style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '13px' }}>{m.name}</div>
                        <div style={{ fontSize: '10px', color: lila }}>{m.role}</div>
                      </div>
                      <button onClick={() => removeFromTeam(m.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px' }}>×</button>
                    </div>
                  ))}
                </div>
                <button onClick={handleTeamsMeeting} className="modal-cta cta-teams">Determinar Reunión (Teams)</button>
                <button onClick={() => setModalView('form')} className="modal-cta cta-project">Generar Proyecto</button>
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: '24px', fontWeight: '900' }}>New Project Form</h2>
                <input className="form-input" placeholder="Project Name" defaultValue={projectTitle} />
                <textarea className="form-input" style={{ height: '100px', resize: 'none' }} placeholder="Final Objectives..." defaultValue={projectBrief} />
                <input className="form-input" placeholder="Delivery Date (DD/MM/YYYY)" />
                <button onClick={() => { alert('Project Request Sent!'); setShowModal(false); }} className="modal-cta cta-project">Send Request</button>
                <button onClick={() => setModalView('list')} style={{ background: 'none', border: 'none', color: '#64748b', width: '100%', marginTop: '10px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' }}>Go back</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* VISTA: GRILLA DE RESULTADOS */}
      {step === 'grid' ? (
        <div style={{ padding: '0 60px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredProfiles.map(p => (
            <div key={p.id} onClick={() => { setSelProfile(p); setStep('deck'); }} className="card-talent" style={{ borderRadius: '35px', padding: '15px' }}>
              {isAlreadyAdded(p.id) && <div className="added-badge">Added</div>}
              <img src={p.photo} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '25px', filter: isAlreadyAdded(p.id) ? 'grayscale(0.5)' : 'none' }} />
              <div style={{ padding: '15px 5px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', lineHeight: '1.2' }}>{p.name}</h3>
                <p style={{ color: lila, fontSize: '10px', fontWeight: '800', marginBottom: '10px' }}>{p.role}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{p.tags.slice(0, 3).map(tag => <span key={tag} className="card-spec-tag">{tag}</span>)}</div>
              </div>
            </div>
          ))}
          {filteredProfiles.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#64748b' }}>
              <h3 style={{ fontWeight: '900' }}>No talents found for "{searchTerm}"</h3>
            </div>
          )}
        </div>
      ) : (
        /* VISTA: DECK DETALLADO (Perfil Individual) */
        <div style={{ padding: '0 60px 60px', display: 'grid', gridTemplateColumns: '380px 1fr 380px', gap: '40px' }}>
          
          {/* Columna Izquierda: Bio y Acción */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <button onClick={() => setStep('grid')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: lila, fontWeight: '900', marginBottom: '20px', cursor: 'pointer' }}>← Back</button>
             <div style={{ width: '100%', backgroundColor: cardBg, padding: '45px 35px', borderRadius: '45px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                {isAlreadyAdded(selProfile.id) && <div className="added-badge">Added</div>}
                <div style={{ width: '160px', height: '160px', margin: '0 auto 25px', borderRadius: '50%', border: `3px solid ${lila}`, overflow: 'hidden' }}><img src={selProfile.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>{selProfile.name}</h2>
                <p style={{ color: lila, fontWeight: '800' }}>{selProfile.role}</p>
             </div>
             <div style={{ display: 'flex', width: '100%', marginTop: '20px' }}>
               <button disabled={isAlreadyAdded(selProfile.id)} onClick={() => setMyTeam([...myTeam, selProfile])} className="action-btn btn-add">
                 {isAlreadyAdded(selProfile.id) ? 'Already in Team' : 'Add Talent +'}
               </button>
               {isAlreadyAdded(selProfile.id) && (
                 <button onClick={() => removeFromTeam(selProfile.id)} className="action-btn btn-dismiss">Dismiss</button>
               )}
             </div>
          </div>

          {/* Columna Central: Portafolio Dinámico */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', marginBottom: '25px' }}>Portfolio Overview ({selProfile.works.length})</h3>
            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
              {selProfile.works.map(w => (
                <div key={w.id} className={`work-item ${openWorkId === w.id ? 'open' : ''}`}>
                  <div onClick={() => setOpenWorkId(openWorkId === w.id ? null : w.id)} style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontWeight: '900', fontSize: '14px' }}>{w.title}</span>
                    <span style={{ color: lila }}>{openWorkId === w.id ? '−' : '+'}</span>
                  </div>
                  {openWorkId === w.id && (
                    <div style={{ padding: '0 30px 30px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '25px' }}>
                      <div style={{ borderRadius: '15px', overflow: 'hidden', height: '180px' }}><img src={w.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div><h5 style={{ color: lila, fontSize: '8px', margin: '0 0 5px' }}>Brief</h5><p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{w.desc}</p></div>
                        <div><h5 style={{ color: aqua, fontSize: '8px', margin: '0 0 5px' }}>Impact</h5><ul style={{ margin: 0, paddingLeft: '15px', color: '#cbd5e1', fontSize: '11px' }}>{w.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Analítica de Skills */}
          <div style={{ backgroundColor: cardBg, padding: '40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <SkillRadar skills={selProfile.categorizedSkills} activeIndex={hoveredRadarIdx} />
            {selProfile.categorizedSkills.map((cat, idx) => (
              <div key={idx} style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '10px', color: cat.category === 'Hard Skills' ? lila : aqua, fontWeight: '900', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px' }}>{cat.category}</h4>
                {cat.items.map((s, i) => (
                  <div key={i} className="skill-bar-row" onMouseEnter={() => setHoveredRadarIdx(s.radarMap)} onMouseLeave={() => setHoveredRadarIdx(null)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}><span>{s.n}</span><span style={{ color: s.c }}>{s.v}%</span></div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}><div className="skill-bar-inner" style={{ width: `${s.v}%`, height: '100%', background: s.c }} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}