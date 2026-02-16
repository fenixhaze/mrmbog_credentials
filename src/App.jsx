import React, { useState, useMemo } from 'react';

const lila = "rgb(143, 134, 255)";
const rojo = "#ff4d4d"; 
const darkBg = "#050505";
const cardBg = "rgba(255, 255, 255, 0.03)";

const worldData = [
  { id: 1, title: "MOTION DESIGN", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", desc: "High-end animation and cinematic storytelling." },
  { id: 2, title: "UX/UI", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", desc: "User-centric interfaces and seamless interaction." }, 
  { id: 3, title: "CREATIVE DATA", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", desc: "Visualizing complex narratives through data." }, 
  { id: 4, title: "AI EXPERTISE", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", desc: "Generative AI for creative scaling." },
  { id: 5, title: "CREATIVE DESIGN", img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800", desc: "Disruptive visual identities." },
  { id: 6, title: "AUTOMATION", img: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800", desc: "Streamlining workflows through technology." },
];

const names = [
  "German", "Laura", "Daniela", "Camila", "Cristian", "Darwin", 
  "Sara", "Stephany", "Isabella", "Juan Pablo", "Juan Diego", 
  "Camilo", "Ana Maria", "Mariana O", "Marina", "Mariana C", "Maria Paula", 
  "Stefania", "Alejandra", "Mateo", "Tania"
];

const getRoleByName = (name) => {
  if (name === "German") return "Creative Director";
  if (["Laura", "Daniela"].includes(name)) return "Operation Manager";
  if (["Camila", "Cristian", "Darwin"].includes(name)) return "Art Director";
  if (["Sara", "Stephany", "Isabella", "Juan Pablo"].includes(name)) return "Senior Digital Designer";
  if (name === "Juan Diego") return "Senior Presentation Designer";
  if (["Camilo", "Ana Maria", "Mariana O", "Marina", "Mariana C", "Maria Paula"].includes(name)) return "Semi Senior Digital Designer";
  if (name === "Stefania") return "Presentation Designer";
  if (["Alejandra", "Mateo", "Tania"].includes(name)) return "Senior UX UI Designer";
  return "Creative Specialist";
};

const profilesData = names.map((name, i) => ({
  id: `${i + 1}`,
  name: name,
  role: getRoleByName(name),
  photo: `https://i.pravatar.cc/600?u=user${i + 200}`,
  stats: { creativity: 80 + (i % 20), technical: 70 + (i % 25), speed: 75 + (i % 20), precision: 85 - (i % 10) }
}));

export default function App() {
  const [view, setView] = useState("home");
  const [myTeam, setMyTeam] = useState([]);
  const [selProfile, setSelProfile] = useState(null);
  const [selWorld, setSelWorld] = useState(null);
  const [projectName, setProjectName] = useState(""); 
  const [briefName, setBriefName] = useState("");
  const [centerIdx, setCenterIdx] = useState(0);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);

  const toggleTeam = (p) => {
    const isAdded = myTeam.some(m => m.id === p.id);
    if (isAdded) setMyTeam(myTeam.filter(t => t.id !== p.id));
    else setMyTeam([...myTeam, p]);
  };

  const nextWorld = () => setCenterIdx((prev) => (prev + 1) % worldData.length);
  const prevWorld = () => setCenterIdx((prev) => (prev - 1 + worldData.length) % worldData.length);

  const getCardStyle = (index) => {
    const diff = (index - centerIdx + worldData.length) % worldData.length;
    let position = diff;
    if (position > worldData.length / 2) position -= worldData.length;
    const absPos = Math.abs(position);
    const isActive = absPos === 0;
    const offset = isActive ? 0 : -Math.sign(position) * 120;
    return {
      transform: `translateX(${position * 620 + offset}px) scale(${1 - absPos * 0.45}) rotateY(${position * -50}deg)`,
      zIndex: 10 - absPos,
      opacity: isActive ? 1 : 0.5,
      filter: isActive ? 'none' : 'grayscale(100%)',
      pointerEvents: isActive ? 'auto' : 'none',
    };
  };

  return (
    <div style={{ backgroundColor: darkBg, color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        html, body { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
          overscroll-behavior: none; 
          background-color: ${darkBg};
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .world-node { position: absolute; width: 100%; height: 350px; border-radius: 12px; overflow: hidden; border: 1px solid transparent; transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .world-node:hover { border-color: ${lila}; box-shadow: 0 0 30px rgba(143, 134, 255, 0.2); }
        .world-node img { width: 100%; height: 100%; object-fit: cover; transition: 0.9s ease; }
        .profile-card { position: relative; width: 240px; height: 340px; background: #111; border-radius: 8px; overflow: hidden; cursor: pointer; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.05); }
        .profile-card:hover { transform: translateY(-10px); border-color: ${lila}; }
        .pill-input { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); color: white; font-size: 15px; width: 500px; padding: 18px; border-radius: 8px; text-align: center; outline: none; margin-bottom: 12px; }
        .pill-input::placeholder { text-transform: none; color: rgba(255,255,255,0.3); }
        .cta-btn { background: none; border: 2px solid ${lila}; color: white; padding: 18px 50px; font-weight: 900; border-radius: 8px; font-size: 13px; cursor: pointer; transition: 0.4s; letter-spacing: 2px; text-transform: uppercase; }
        .cta-btn:hover { background: ${lila}; }
        .btn-remove { border-color: ${rojo}; color: white; }
        .btn-remove:hover { background: ${rojo}; }
        .back-btn { background: none; border: none; color: ${lila}; cursor: pointer; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .back-btn:hover { transform: translateX(-5px); }
        .bottom-blur-mask { position: absolute; bottom: 0; left: 0; right: 0; height: 45%; backdrop-filter: blur(10px); mask-image: linear-gradient(to top, black 20%, transparent 100%); -webkit-mask-image: linear-gradient(to top, black 20%, transparent 100%); z-index: 2; }
        .img-overlay-solid { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 65%); z-index: 2; }
      `}</style>

      {/* Nav Superior */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 50px', display: 'flex', justifyContent: 'flex-end', zIndex: 1000, boxSizing: 'border-box' }}>
        <div style={{ height: '48px', background: 'rgba(255,255,255,0.05)', padding: '0 20px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', cursor: 'pointer' }} onClick={() => setIsSquadModalOpen(true)}>
          <span style={{ opacity: 0.5 }}>PROJECT SQUAD:</span>
          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
            {myTeam.slice(-5).map((m) => (
              <div key={m.id} style={{ width: '28px', height: '28px', borderRadius: '4px', border: `2px solid ${darkBg}`, marginLeft: '-8px', overflow: 'hidden' }}>
                <img src={m.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <span style={{ color: lila }}>{myTeam.length}</span>
        </div>
      </nav>

      {/* MODAL SQUAD */}
      {isSquadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsSquadModalOpen(false)}>
          <div style={{ background: '#050505', width: '90%', maxWidth: '650px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '50px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>{projectName.toUpperCase() || "YOUR PROJECT SQUAD"}</h3>
            <p style={{ color: lila, fontSize: '11px', fontWeight: 800, marginTop: '8px' }}>BRIEF: {briefName.toUpperCase() || "PENDING"}</p>
            <div style={{ margin: '30px 0', maxHeight: '40vh', overflowY: 'auto' }}>
              {myTeam.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={m.photo} style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 900 }}>{m.name.toUpperCase()}</div><div style={{ color: lila, fontSize: '10px' }}>{m.role.toUpperCase()}</div></div>
                  <button style={{ background: 'none', border: 'none', color: rojo, fontWeight: 900, cursor: 'pointer' }} onClick={() => toggleTeam(m)}>REMOVE</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <button className="cta-btn">REQUEST QUOTE</button>
              <button className="cta-btn" style={{ border: '2px solid white' }}>BOOK MEETING</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ paddingTop: '80px', overflowX: 'hidden' }}>
        {view === "home" && (
          <div style={{ textAlign: 'center', padding: '60px 0' }} className="animate-fade">
            <h1 style={{ fontSize: '85px', fontWeight: 900, margin: 0 }}>MRM</h1>
            <p style={{ letterSpacing: '8px', color: lila, marginBottom: '40px' }}>CREATIVE CREDENTIALS</p>
            <div style={{ position: 'relative', width: '500px', height: '400px', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={prevWorld} style={{ position: 'absolute', left: -80, zIndex: 100, background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}>←</button>
              <button onClick={nextWorld} style={{ position: 'absolute', right: -80, zIndex: 100, background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}>→</button>
              <div style={{ position: 'absolute', width: '100%', height: '100%', perspective: '2500px' }}>
                {worldData.map((world, index) => (
                  <div key={world.id} className="world-node" style={getCardStyle(index)} onClick={() => { setSelWorld(world); setView("project-detail"); }}>
                    <img src={world.img} alt={world.title} />
                    <div className="bottom-blur-mask" />
                    <div className="img-overlay-solid" />
                    <div style={{ position: 'absolute', bottom: 30, left: 25, zIndex: 3, fontWeight: 900, fontSize: '20px' }}>{world.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input className="pill-input" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              <input className="pill-input" placeholder="Brief Description" value={briefName} onChange={(e) => setBriefName(e.target.value)} />
              <button className="cta-btn" style={{ marginTop: '30px' }} onClick={() => setView("grid")}>FILTER BY TALENT</button>
            </div>
          </div>
        )}

        {view === "grid" && (
          <div style={{ padding: '60px' }} className="animate-fade">
            <button className="back-btn" onClick={() => setView("home")}>← BACK</button>
            <div style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, margin: 0 }}>CREATIVE TEAM</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginTop: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: lila, letterSpacing: '1px' }}>
                  {projectName.toUpperCase() || "UNTITLED PROJECT"}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.5, letterSpacing: '0.5px' }}>
                  {briefName || "No description provided"}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px', marginTop: '40px' }}>
              {profilesData.map(p => (
                <div key={p.id} className="profile-card" onClick={() => { setSelProfile(p); setView("detail"); }}>
                  {myTeam.some(m => m.id === p.id) && <div style={{ position: 'absolute', top: 15, right: 15, background: lila, padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 900, zIndex: 10 }}>ADDED</div>}
                  <img src={p.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                  <div className="img-overlay-solid" />
                  <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 3 }}>
                    <div style={{ fontWeight: 900 }}>{p.name.toUpperCase()}</div>
                    <div style={{ color: lila, fontSize: '10px' }}>{p.role.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mantenemos Detail y Project Detail igual */}
        {view === "project-detail" && selWorld && (
          <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto' }} className="animate-slide">
             <button className="back-btn" onClick={() => setView("home")}>← BACK</button>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginTop: '40px' }}>
                <div>
                   <h2 style={{ fontSize: '64px', fontWeight: 900 }}>{selWorld.title}</h2>
                   <p style={{ fontSize: '18px', opacity: 0.7, margin: '30px 0', lineHeight: 1.6 }}>{selWorld.desc}</p>
                   <button className="cta-btn" onClick={() => setView("grid")}>FIND EXPERTS</button>
                </div>
                <img src={selWorld.img} style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '20px' }} alt={selWorld.title} />
             </div>
          </div>
        )}

        {view === "detail" && selProfile && (
          <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto' }} className="animate-slide">
            <button className="back-btn" onClick={() => setView("grid")}>← BACK TO TEAM</button>
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '60px', marginTop: '40px' }}>
              <div>
                <div style={{ background: cardBg, padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ width: '100%', height: '350px', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img src={selProfile.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selProfile.name} />
                    <div className="img-overlay-solid" />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 900, marginTop: '25px' }}>{selProfile.name.toUpperCase()}</h2>
                  <p style={{ color: lila, fontWeight: 800, fontSize: '12px', marginTop: '5px' }}>{selProfile.role.toUpperCase()}</p>
                  <button className={`cta-btn ${myTeam.some(m => m.id === selProfile.id) ? 'btn-remove' : ''}`} style={{ width: '100%', marginTop: '30px' }} onClick={() => toggleTeam(selProfile)}>
                    {myTeam.some(m => m.id === selProfile.id) ? 'REMOVE FROM SQUAD' : 'ADD TO SQUAD +'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: cardBg, padding: '40px', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', opacity: 0.4, marginBottom: '35px' }}>CAPABILITIES</h3>
                  {Object.entries(selProfile.stats).map(([label, value]) => (
                    <div key={label} style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 900, letterSpacing: '1px' }}><span>{label.toUpperCase()}</span><span>{value}%</span></div>
                      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', marginTop: '10px', position: 'relative' }}>
                        <div style={{ position: 'absolute', height: '100%', width: `${value}%`, background: lila, transition: '1s ease-in-out' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}