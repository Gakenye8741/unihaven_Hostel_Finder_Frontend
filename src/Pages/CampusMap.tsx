import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, MapPin, Navigation2, Building2, ChevronLeft, ArrowRight, Map as MapIcon, Globe, Info } from 'lucide-react';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import Navbar from '../Components/Navbar';

// 1. COMPREHENSIVE KENYAN INSTITUTIONAL REGISTRY
const campusAliases: Record<string, string> = {
  // Public Universities
  "JKUAT": "Jomo Kenyatta University of Agriculture and Technology",
  "KU": "Kenyatta University",
  "UON": "University of Nairobi",
  "EGERTON": "Egerton University",
  "MOI": "Moi University",
  "MASENO": "Maseno University",
  "MMUST": "Masinde Muliro University of Science and Technology",
  "TUK": "Technical University of Kenya",
  "TUM": "Technical University of Mombasa",
  "DEKUT": "Dedan Kimathi University of Technology",
  "CHUKA": "Chuka University",
  "KIBU": "Kibabii University",
  "LU": "Laikipia University",
  "PU": "Pwani University",
  "MAUA": "Maasai Mara University",
  
  // Private Universities
  "STRATHMORE": "Strathmore University",
  "USIU": "United States International University Africa",
  "DAYSTAR": "Daystar University",
  "MKU": "Mount Kenya University",
  "CUEA": "Catholic University of Eastern Africa",
  "KCA": "KCA University",
  "ANUE": "Africa Nazarene University",
  "ZETECH": "Zetech University",
  "PAC": "Pan Africa Christian University",
  "KABARAK": "Kabarak University",

  // Famous Colleges & TVETs
  "KMTC": "Kenya Medical Training College",
  "KIM": "Kenya Institute of Management",
  "KCA COLLEGE": "KCA University College",
  "RIAT": "Ramogi Institute of Advanced Technology",
  "NYERI POLY": "Nyeri National Polytechnic",
  "ELDORET POLY": "Eldoret National Polytechnic",
  "KISII POLY": "Kisii National Polytechnic",
  "KTTI": "Kabete Technical Training Institute",
};

const CampusHub: React.FC = () => {
  const { data: hostels, isLoading } = useGetAllHostelsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  // 2. LOGIC: Merge Database Data with the Registry
  const campusRegistry = useMemo(() => {
    const registry: Record<string, { count: number; fullName: string; isSystem: boolean }> = {};

    // First, seed with all famous campuses
    Object.keys(campusAliases).forEach(short => {
      registry[short] = { count: 0, fullName: campusAliases[short], isSystem: false };
    });

    // Second, add or update with data from the Hostel Database
    hostels?.forEach((hostel: any) => {
      const name = (hostel.campus || "Other").toUpperCase();
      if (!registry[name]) {
        registry[name] = { count: 0, fullName: name, isSystem: true };
      }
      registry[name].count += 1;
      registry[name].isSystem = true;
    });

    return registry;
  }, [hostels]);

  // 3. FILTERED LIST: Prioritize campuses with hostels, then by search
  const filteredList = useMemo(() => {
    return Object.keys(campusRegistry).filter(name => {
      const search = searchTerm.toLowerCase();
      return name.toLowerCase().includes(search) || campusRegistry[name].fullName.toLowerCase().includes(search);
    }).sort((a, b) => campusRegistry[b].count - campusRegistry[a].count);
  }, [campusRegistry, searchTerm]);

  const getMapUrl = (name: string) => {
    const query = campusRegistry[name]?.fullName || name;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query + " Kenya")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="bg-[#030712] h-screen text-slate-300 overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow flex pt-20 overflow-hidden relative">
        
        {/* SIDEBAR */}
        <div className={`w-full lg:w-[400px] border-r border-slate-800 flex flex-col bg-[#030712] z-30 transition-all duration-500
          ${selectedCampus ? 'max-lg:-translate-x-full absolute lg:relative' : 'relative translate-x-0'}`}>
          
          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              CAMPUS <span className="text-indigo-600">HUB</span>
            </h1>

            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="text"
                placeholder="Search JKUAT, Strathmore, KMTC..."
                className="w-full bg-slate-900/50 border border-slate-800 py-4 pl-14 pr-6 rounded-2xl text-xs font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar px-6 pb-10 space-y-3">
            {filteredList.map((name) => {
              const data = campusRegistry[name];
              return (
                <button
                  key={name}
                  onClick={() => setSelectedCampus(name)}
                  className={`w-full text-left p-5 rounded-[2.2rem] border transition-all duration-300 group ${
                    selectedCampus === name ? "bg-indigo-600 border-indigo-400" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <Building2 size={16} className={selectedCampus === name ? "text-white" : "text-indigo-500"} />
                    {data.count > 0 && (
                      <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md">
                        {data.count} Hostels
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{name}</h4>
                  <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${selectedCampus === name ? "text-indigo-100" : "text-slate-500"}`}>
                    {data.fullName}
                  </p>
                </button>
              );
            })}

            {/* GLOBAL SEARCH FALLBACK */}
            {searchTerm && !filteredList.some(n => n.toLowerCase() === searchTerm.toLowerCase()) && (
              <button
                onClick={() => setSelectedCampus(searchTerm)}
                className="w-full text-left p-6 rounded-[2.2rem] border border-dashed border-slate-700 bg-indigo-950/10 hover:bg-indigo-950/30 transition-all"
              >
                <div className="flex items-center gap-3 text-indigo-500 mb-2">
                  <Globe size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Global Discovery</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase italic">Search "{searchTerm}" in Kenya</h4>
              </button>
            )}
          </div>
        </div>

        {/* MAP CONTENT */}
        <div className={`flex-grow relative bg-[#020617] transition-all duration-500 ${selectedCampus ? 'translate-x-0' : 'max-lg:translate-x-full'}`}>
          {selectedCampus ? (
            <div className="absolute inset-0 flex flex-col">
              <button onClick={() => setSelectedCampus(null)} className="lg:hidden absolute top-6 left-6 z-40 bg-white text-black p-4 rounded-2xl font-black text-xs uppercase shadow-2xl"><ChevronLeft size={18} /></button>

              <iframe
                title="Campus Map"
                src={getMapUrl(selectedCampus)}
                className="w-full h-full border-0 grayscale-[0.2] brightness-[0.7] contrast-[1.1]"
                allowFullScreen
              />
              
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 z-20 flex flex-col md:flex-row gap-3">
                <div className="flex-grow bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 p-5 lg:p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Navigation2 size={20} /></div>
                    <div className="flex flex-col">
                      <h5 className="text-lg lg:text-xl font-black text-white uppercase italic tracking-tight leading-none">{selectedCampus}</h5>
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-1 truncate max-w-[200px]">
                        {campusRegistry[selectedCampus]?.fullName || "Educational Institution"}
                      </p>
                    </div>
                  </div>
                </div>

                {campusRegistry[selectedCampus]?.count > 0 ? (
                  <Link to={`/search?address=${encodeURIComponent(selectedCampus)}`} className="bg-white text-black px-10 py-5 lg:py-6 rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl">
                    View Hostels <ArrowRight size={16} />
                  </Link>
                ) : (
                  <div className="bg-slate-800/90 backdrop-blur-md text-slate-500 px-8 py-5 lg:py-6 rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase text-[9px] tracking-widest border border-slate-700">
                    <Info size={16} /> No Listings Available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
               <MapIcon size={64} className="text-slate-800 animate-pulse mb-6" />
               <h3 className="text-2xl font-black text-white uppercase italic tracking-[0.3em]">Institutional Hub</h3>
               <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-600 mt-4 max-w-xs leading-loose">Search for any Kenyan University or College to start exploring</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CampusHub;