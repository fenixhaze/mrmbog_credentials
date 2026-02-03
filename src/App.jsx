import React, { useState } from 'react';

const profiles = [
  {
    id: 1,
    name: "German Herrera",
    role: "Creative Director",
    skills: [{ n: 'Creatividad', v: 95 }, { n: 'Liderazgo', v: 90 }, { n: 'Técnico', v: 85 }]
  },
  {
    id: 2,
    name: "Sara Builesh",
    role: "UX Strategy Lead",
    skills: [{ n: 'UX/UI', v: 98 }, { n: 'Estrategia', v: 95 }, { n: 'Datos', v: 85 }]
  }
];

export default function App() {
  const [sel, setSel] = useState(null);

  // Estilos manuales para no depender de Tailwind
  const containerStyle = { padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' };
  const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '10px', cursor: 'pointer', border: '1px solid #ddd' };
  const chartBoxStyle = { backgroundColor: '#1e293b', color: 'white', padding: '30px', borderRadius: '20px', marginTop: '20px' };
  
  if (sel) {
    return (
      <div style={containerStyle}>
        <button onClick={() => setSel(null)} style={{ marginBottom: '20px', fontWeight: 'bold', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer' }}>
          ← VOLVER
        </button>
        <h1 style={{ fontSize: '40px', margin: '0' }}>{sel.name}</h1>
        <p style={{ color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' }}>{sel.role}</p>

        <div style={chartBoxStyle}>
          <h3 style={{ fontSize: '12px', letterSpacing: '2px', color: '#94a3b8' }}>MÉTRICAS DE SKILLS</h3>
          {sel.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span>{s.n}</span>
                <span>{s.v}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#334155', height: '10px', borderRadius: '5px' }}>
                <div style={{ width: `${s.v}%`, backgroundColor: '#3b82f6', height: '100%', borderRadius: '5px', transition: 'width 1s' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontWeight: '900', fontStyle: 'italic', marginBottom: '30px' }}>TALENT SHOWCASE</h1>
      {profiles.map(p => (
        <div key={p.id} onClick={() => setSel(p)} style={cardStyle}>
          <h3 style={{ margin: '0' }}>{p.name}</h3>
          <p style={{ color: '#2563eb', fontSize: '12px', margin: '5px 0' }}>VER PERFIL</p>
        </div>
      ))}
    </div>
  );
}