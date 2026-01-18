import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useGetAllGlobalAmenitiesQuery } from '../features/Apis/Amenities.Api';
import { 
  MapPin, ArrowLeft, Filter, SearchX, Layers, 
  Loader2, Check, Users, X, Map as MapIcon, 
  List, Compass, Sparkles, Globe
} from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';
import Navbar from '../Components/Navbar';

/* --- ENHANCED MINI COMPONENTS --- */

const MetaBadge: React.FC = () => (
  <div className="flex items-center gap-1.5 bg-indigo-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
    <div className="relative flex items-center justify-center w-3.5 h-3.5">
      <div className="absolute inset-0 bg-indigo-500 rotate-[22.5deg] rounded-sm opacity-80"></div>
      <div className="absolute inset-0 bg-indigo-400 rotate-[67.5deg] rounded-sm"></div>
      <Check size={10} strokeWidth={4} className="relative z-10 text-white" />
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-200">System Verified</span>
  </div>
);

const HostelCardWrapper: React.FC<{ hostel: any; index: number }> = ({ hostel, index }) => {
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(hostel.id);
  const { data: gallery } = useGetHostelGalleryQuery(hostel.id);

  const roomDetails = useMemo(() => {
    if (!rooms || rooms.length === 0) return { price: null, types: [] };
    const displayPrice = rooms[0].price ? Number(rooms[0].price) : null;
    const uniqueTypes = Array.from(new Set(rooms.map((r: any) => r.type).filter(Boolean)));
    return { price: displayPrice, types: uniqueTypes };
  }, [rooms]);

  const displayImage = useMemo(() => {
    const thumb = gallery?.find((m: any) => m.isThumbnail === true);
    return thumb ? thumb.url : hostel.image;
  }, [gallery, hostel.image]);

  return (
    <div 
      className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-[#0F172A]/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2">
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
          {hostel.isVerified && <MetaBadge />}
        </div>

        <HostelCard 
          id={hostel.id}
          name={hostel.name}
          address={hostel.address}
          campus={hostel.campus}
          policy={hostel.policy}
          isVerified={false}
          image={displayImage}
          price={roomDetails.price} 
          isLoadingPrice={roomsLoading}
        />
      </div>
    </div>
  );
};

const SearchByAddress: React.FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const addressQuery = queryParams.get('address') || "";

  const { data: hostels, isLoading: hostelsLoading } = useGetAllHostelsQuery({});
  const { data: globalAmenities } = useGetAllGlobalAmenitiesQuery();

  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleAmenity = (name: string) => {
    setActiveAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
  };

  const filteredHostels = useMemo(() => {
    if (!hostels) return [];
    return hostels.filter((h: any) => {
      const matchesAddress = h.address?.toLowerCase().includes(addressQuery.toLowerCase()) || 
                             h.campus?.toLowerCase().includes(addressQuery.toLowerCase());
      const hostelAmenityNames = h.amenities?.map((a: any) => a.name) || [];
      const matchesAmenities = activeAmenities.length === 0 || activeAmenities.every(active => 
        hostelAmenityNames.some((name: string) => name.toLowerCase() === active.toLowerCase())
      );
      return matchesAddress && matchesAmenities;
    });
  }, [hostels, addressQuery, activeAmenities]);

  // Enhanced Map with Dark Mode filtering
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery + " Kenya")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#030712] min-h-screen text-slate-400 font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* FLOATING BLUR DECOR */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <header className="pt-40 pb-16 relative z-10">
        <div className="max-w-[1600px] mx-auto px-8">          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-8 bg-indigo-500/50" />
                 <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em]">Global Search</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
                {addressQuery}<span className="text-indigo-600">.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                 <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-slate-800 shadow-xl">
                    <MapPin size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">{addressQuery}, Kenya</span>
                 </div>
                 <div className="h-2 w-2 rounded-full bg-slate-800" />
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
                   {filteredHostels.length} curated matches
                 </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-3 bg-[#0F172A] hover:bg-indigo-600 border border-slate-800 hover:border-indigo-400 text-white px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]"
               >
                 <Filter size={16} /> Filters {activeAmenities.length > 0 && `(${activeAmenities.length})`}
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-[1600px] mx-auto px-8 pb-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* GRID SIDE */}
          <div className={`flex-1 ${viewMode === 'map' ? 'hidden' : 'block'} lg:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {hostelsLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[450px] bg-slate-900/20 rounded-[3rem] animate-pulse border border-slate-800/50" />
                ))
              ) : filteredHostels.length > 0 ? (
                filteredHostels.map((hostel: any, idx: number) => (
                  <HostelCardWrapper key={hostel.id} hostel={hostel} index={idx} />
                ))
              ) : (
                <div className="col-span-full py-40 flex flex-col items-center justify-center bg-slate-900/10 rounded-[4rem] border border-dashed border-slate-800">
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] mb-8 shadow-inner">
                    <SearchX size={48} strokeWidth={1} className="text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-widest text-white">Zero results found</h3>
                  <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-bold">Try adjusting your filters or location</p>
                </div>
              )}
            </div>
          </div>

          {/* MAP SIDEBAR */}
          <div className={`lg:w-[500px] xl:w-[600px] ${viewMode === 'list' ? 'hidden' : 'block'} lg:block`}>
            <div className="lg:sticky lg:top-32 w-full">
              <div className="relative h-[70vh] rounded-[3.5rem] overflow-hidden border border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] group">
                {/* Custom Map Overlay for Dark Theme Look */}
                <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none mix-blend-color" />
                <iframe 
                  title="Location Map" 
                  src={mapSrc} 
                  className="w-full h-full border-0 brightness-[0.6] contrast-[1.2] grayscale-[0.3] scale-[1.02]" 
                  allowFullScreen 
                />
                
                {/* Map Floating UI */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 pointer-events-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Tracking Active</span>
                  </div>
                  <button 
                    className="p-4 bg-white text-black rounded-2xl shadow-2xl pointer-events-auto hover:scale-110 transition-transform"
                    onClick={() => window.open(`https://www.google.com/maps/search/${addressQuery}`, '_blank')}
                  >
                    <Globe size={18} />
                  </button>
                </div>

                {/* Bottom Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FILTER MODAL (Upgraded) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-[#0F172A] w-full max-w-2xl border border-white/5 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.2)] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Preferences</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles size={12} className="text-indigo-500" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimizing for {addressQuery}</p>
                </div>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-4 bg-slate-900 text-slate-400 rounded-3xl hover:text-white hover:bg-slate-800 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10">
              <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                 {globalAmenities?.map((item: any) => {
                    const isActive = activeAmenities.includes(item.name);
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => toggleAmenity(item.name)} 
                        className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-300 ${
                          isActive 
                            ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20" 
                            : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-indigo-500/30"
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                        {isActive ? <Check size={14} strokeWidth={4} /> : <Layers size={14} className="opacity-20" />}
                      </button>
                    );
                 })}
              </div>
            </div>

            <div className="p-10 bg-black/20 flex gap-4">
               <button onClick={() => { setActiveAmenities([]); setIsFilterOpen(false); }} className="flex-1 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">Reset All</button>
               <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 transition-all">Show Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchByAddress;