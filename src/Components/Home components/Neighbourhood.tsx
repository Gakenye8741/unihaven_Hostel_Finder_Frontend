import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Loader2, MapPin, Search, ArrowRight, 
  LocateFixed, Navigation, Compass
} from 'lucide-react';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';

// 1. HIGH-END ARCHITECTURAL IMAGES (Guaranteed valid URLs)
const NEIGHBORHOOD_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449156003053-96432b77ec2c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513584684374-8bdb7489feef?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1430285561322-7808604715df?q=80&w=1000&auto=format&fit=crop"
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1555854817-5b2247a8175f?q=80&w=1000&auto=format&fit=crop";

const Neighborhoods: React.FC = () => {
  const { data: hostels, isLoading } = useGetAllHostelsQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  // 2. LOGIC: Extract unique localities and assign images
  const neighborhoodData = useMemo(() => {
    if (!hostels) return [];

    const groups = hostels.reduce((acc: Record<string, any>, hostel: any) => {
      const rawAddress = hostel.address || "General Area";
      // Split "Cherika, Juja" into "Cherika"
      const areaName = rawAddress.split(',')[0].trim(); 
      
      if (!acc[areaName]) {
        acc[areaName] = {
          name: areaName,
          fullAddress: rawAddress,
          count: 0,
        };
      }
      acc[areaName].count += 1;
      return acc;
    }, {});

    return Object.values(groups)
      .filter((area: any) => area.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a: any, b: any) => b.count - a.count)
      .map((area: any, index: number) => ({
        ...area,
        // Assign images based on index to ensure variety
        img: NEIGHBORHOOD_IMAGES[index % NEIGHBORHOOD_IMAGES.length] || FALLBACK_IMG
      }));
  }, [hostels, searchTerm]);

  return (
    <section className="py-24 bg-[#0F172A] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-500">
              <Compass size={18} className="animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Hyper-Local Discovery</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              Explore <span className="text-indigo-600">Localities</span>
            </h3>
          </div>

          <div className="relative w-full lg:w-[400px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search Cherika, Taiti, Mbili..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#030712] border border-slate-800 text-white pl-16 pr-6 py-5 rounded-[2rem] text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* CONTENT AREA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Addresses...</p>
          </div>
        ) : neighborhoodData.length > 0 ? (
          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory pt-4">
            {neighborhoodData.map((area: any, i) => (
              <Link 
                to={`/search?address=${encodeURIComponent(area.name)}`} 
                key={i} 
                className="relative flex-shrink-0 w-[280px] md:w-[320px] h-[450px] group bg-[#030712] border border-slate-800/60 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-indigo-500 snap-center shadow-2xl"
              >
                {/* DYNAMIC BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                  <img 
                    src={area.img} 
                    alt={area.name} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent" />
                </div>

                {/* CARD CONTENT */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                       <Navigation size={20} />
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {area.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <LocateFixed size={12} className="text-indigo-500" />
                        Within {area.fullAddress.split(',')[1] || "Immediate Area"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Listings</span>
                        <span className="text-xl font-black text-white italic">{area.count}</span>
                      </div>
                      <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No neighborhoods found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Neighborhoods;