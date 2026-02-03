import React, { useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';

const creativeAbilities = [
  "All Abilities", "UX/UI", "Motion", "Automation", "Data Visualization", 
  "Image Editing", "Video Editing", "Editorial", "3D Modeling", "Branding"
];

const sampleProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Creative Director",
    abilities: ["Image Editing", "Editorial", "Branding"],
    bio: "Experta en dirección de arte y diseño editorial.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    availability: "Available"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "UX Strategy Lead",
    abilities: ["UX/UI", "Data Visualization", "Automation"],
    bio: "Especialista en interfaces y flujos automatizados.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    availability: "Limited"
  }
];

export default function CredentialsShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterAbility, setFilterAbility] = useState("All Abilities");

  const filteredProfiles = sampleProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAbility = filterAbility === "All Abilities" || profile.abilities.includes(filterAbility);
    return matchesSearch && matchesAbility;
  });

  if (selectedProfile) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <button onClick={() => setSelectedProfile(null)} className="mb-4 text-blue-600 font-bold">← BACK TO LIST</button>
        <h1 className="text-4xl font-bold">{selectedProfile.name}</h1>
        <p className="text-xl text-slate-500 mb-4">{selectedProfile.role}</p>
        <div className="flex gap-2 mb-6">
          {selectedProfile.abilities.map(a => <span key={a} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{a}</span>)}
        </div>
        <p className="text-lg text-slate-700">{selectedProfile.bio}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Creative <span className="text-blue-600">Talents</span></h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Search by name..." 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select 
              className="p-3 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={filterAbility}
              onChange={(e) => setFilterAbility(e.target.value)}
            >
              {creativeAbilities.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map(profile => (
            <div key={profile.id} onClick={() => setSelectedProfile(profile)} className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all">
              <img src={profile.photo} className="w-full h-48 object-cover rounded-2xl mb-4" />
              <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{profile.name}</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter mb-4">{profile.role}</p>
              <div className="flex flex-wrap gap-1">
                {profile.abilities.map(a => <span key={a} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
