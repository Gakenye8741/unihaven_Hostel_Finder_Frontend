import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, MapPin, Navigation2, Building2, ChevronLeft, ArrowRight, Map as MapIcon, Globe, Info } from 'lucide-react';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import Navbar from '../Components/Navbar';

const campusAliases: Record<string, string> = {
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
  const { data: hostels } = useGetAllHostelsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  const campusRegistry = useMemo(() => {
    const registry: Record<string, { count: number; fullName: string; isSystem: boolean }> = {};
    Object.keys(campusAliases).forEach(short => {
      registry[short] = { count: 0, fullName: campusAliases[short], isSystem: false };
    });
    hostels?.forEach((hostel: any) => {
      const name = (hostel.campus || "Other").toUpperCase();
      if (!registry[name]) registry[name] = { count: 0, fullName: name, isSystem: true };
      registry[name].count += 1;
      registry[name].isSystem = true;
    });
    return registry;
  }, [hostels]);

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

      <main className="flex-grow flex pt-16 lg:pt-20 overflow-hidden relative">
        
        {/* SIDEBAR */}
        <div className={`w-full lg:w-[400px] border-r border-slate-800 flex flex-col bg-[#030712] z-30 transition-all duration-500
          ${selectedCampus ? 'max-lg:-translate-x-full absolute lg:relative' : 'relative translate-x-0'}`}>
          
          <div className="p-6 lg:p-8 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              CAMPUS <span className="text-indigo-600">HUB</span>
            </h1>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="text"
                placeholder="Search Campus..."
                className="w-full bg-slate-900/50 border border-slate-800 py-4 pl-14 pr-6 rounded-2xl text-xs font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Added padding at bottom (pb-32) so last item is not hidden by mobile navbar */}
          <div className="flex-grow overflow-y-auto no-scrollbar px-6 pb-32 lg:pb-10 space-y-3">
            {filteredList.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedCampus(name)}
                className={`w-full text-left p-4 lg:p-5 rounded-[1.5rem] lg:rounded-[2.2rem] border transition-all duration-300 ${
                  selectedCampus === name ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-600/20" : "bg-slate-900/30 border-slate-800"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <Building2 size={16} className={selectedCampus === name ? "text-white" : "text-indigo-500"} />
                  {campusRegistry[name].count > 0 && (
                    <span className="text-[8px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded">
                      {campusRegistry[name].count} Hostels
                    </span>
                  )}
                </div>
                <h4 className="text-md lg:text-lg font-black text-white uppercase italic tracking-tighter">{name}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* MAP CONTENT */}
        <div className={`flex-grow relative bg-[#020617] transition-all duration-500 ${selectedCampus ? 'translate-x-0' : 'max-lg:translate-x-full'}`}>
          {selectedCampus ? (
            <div className="absolute inset-0 flex flex-col">
              <button onClick={() => setSelectedCampus(null)} className="lg:hidden absolute top-4 left-4 z-40 bg-white text-black p-3 rounded-xl font-black text-[10px] uppercase shadow-2xl flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>

              <iframe
                title="Campus Map"
                src={getMapUrl(selectedCampus)}
                className="w-full h-full border-0 grayscale-[0.2] brightness-[0.7]"
                allowFullScreen
              />
              
              {/* STICKY BOTTOM ACTION AREA - FIXED FOR MOBILE NAVBAR */}
              {/* Added bottom-20 for mobile and bottom-10 for desktop */}
              <div className="absolute bottom-20 lg:bottom-10 left-0 right-0 px-4 lg:px-10 z-20 flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row gap-3 w-full max-w-5xl mx-auto">
                  
                  {/* Info Card */}
                  <div className="flex-grow bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 p-4 lg:p-6 rounded-2xl lg:rounded-[2.5rem] flex items-center shadow-2xl">
                    <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
                      <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 bg-indigo-600 rounded-full items-center justify-center text-white flex-shrink-0">
                        <Navigation2 size={20} />
                      </div>
                      <div className="overflow-hidden text-left">
                        <h5 className="text-sm lg:text-xl font-black text-white uppercase italic truncate leading-tight">{selectedCampus}</h5>
                        <p className="text-[8px] lg:text-[9px] font-bold text-indigo-400 uppercase tracking-widest truncate">
                          {campusRegistry[selectedCampus]?.fullName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button - Now clearly visible above Bottom Nav */}
                  {campusRegistry[selectedCampus]?.count > 0 ? (
                    <Link 
                      to={`/hostels?campus=${encodeURIComponent(selectedCampus)}`} 
                      className="bg-white text-black h-12 lg:h-auto px-6 lg:px-10 py-4 lg:py-6 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase text-[10px] lg:text-[12px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                    >
                      View Hostels <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <div className="bg-slate-800/90 backdrop-blur-md text-slate-500 px-6 py-4 lg:py-6 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest border border-slate-700">
                      <Info size={16} /> No Listings
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
               <MapIcon size={64} className="text-slate-800 animate-pulse mb-6" />
               <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Select a Campus</h3>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mt-4 max-w-xs leading-loose">Choose an institution to find nearby housing</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CampusHub;