import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useGetAllGlobalAmenitiesQuery } from '../features/Apis/Amenities.Api';
import { 
  MapPin, ArrowLeft, Filter, 
  SearchX, Layers, 
  Loader2, Check, Users, X, Map as MapIcon, List
} from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';
import Navbar from '../Components/Navbar';

// MetaBadge and PolicyBadge kept as per your design requirements
const MetaBadge: React.FC = () => (
  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
    <div className="relative flex items-center justify-center w-3.5 h-3.5">
      <div className="absolute inset-0 bg-[#0095F6] rotate-[22.5deg] rounded-sm"></div>
      <div className="absolute inset-0 bg-[#0095F6] rotate-[67.5deg] rounded-sm"></div>
      <Check size={10} strokeWidth={4} className="relative z-10 text-white drop-shadow-sm" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-wider text-white">Verified</span>
  </div>
);

const PolicyBadge: React.FC<{ policy: string }> = ({ policy }) => {
  const p = policy?.toLowerCase() || '';
  const isGirls = p.includes('girls');
  const isBoys = p.includes('boys');
  
  const theme = isGirls 
    ? { bg: "bg-rose-500/20", border: "border-rose-400/40", text: "text-rose-300", icon: "text-rose-400" }
    : isBoys 
      ? { bg: "bg-blue-500/20", border: "border-blue-400/40", text: "text-blue-300", icon: "text-blue-400" }
      : { bg: "bg-black/40 backdrop-blur-md", border: "border-purple-400/40", text: "text-white", icon: "text-purple-400" };

  return (
    <div className={`flex items-center gap-2 backdrop-blur-xl px-3 py-1.5 rounded-full border ${theme.bg} ${theme.border} ${theme.text} shadow-lg transition-all duration-300`}>
      <Users size={11} strokeWidth={3} className={theme.icon}  />
      <span className="text-[9px] font-black uppercase tracking-[0.1em]">{policy}</span>
    </div>
  );
};

const HostelCardWrapper: React.FC<{ hostel: any }> = ({ hostel }) => {
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(hostel.id);
  const { data: gallery } = useGetHostelGalleryQuery(hostel.id);

  const roomDetails = useMemo(() => {
    if (!rooms || rooms.length === 0) return { price: null, methods: [], types: [] };
    const displayPrice = rooms[0].price ? Number(rooms[0].price) : null;
    const uniqueTypes = Array.from(new Set(rooms.map((r: any) => r.type).filter(Boolean)));
    return { price: displayPrice, types: uniqueTypes };
  }, [rooms]);

  const displayImage = useMemo(() => {
    const thumb = gallery?.find((m: any) => m.isThumbnail === true);
    return thumb ? thumb.url : hostel.image;
  }, [gallery, hostel.image]);

  return (
    <div className="relative group bg-[#0F172A] border border-slate-800/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 h-full">
      {/* Top Left Badges */}
      <div className="absolute top-5 left-6 z-20 flex flex-col gap-2.5 pointer-events-none">
        {hostel.isVerified && <MetaBadge />}
        <PolicyBadge policy={hostel.policy} />
      </div>

      {/* Renders the HostelCard which now handles its own Ratings and Amenities internally */}
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
      
      {/* Room Type Tags - Positioned over the card for quick scanning */}
      {!roomsLoading && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end max-w-[70%]">
          {roomDetails.types.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {roomDetails.types.slice(0, 1).map((type: any) => (
                <div key={type} className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="text-[9px] font-black uppercase text-indigo-300 tracking-tighter">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CampusDestinationPage: React.FC = () => {
  const { campusName } = useParams<{ campusName: string }>();
  const { data: hostels, isLoading: hostelsLoading } = useGetAllHostelsQuery({ campus: campusName });
  const { data: globalAmenities } = useGetAllGlobalAmenitiesQuery();

  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleAmenity = (name: string) => {
    setActiveAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
  };

  const filteredHostels = useMemo(() => {
    if (!hostels) return [];
    if (activeAmenities.length === 0) return hostels;
    return hostels.filter((h: any) => {
      const hostelAmenityNames = h.amenities?.map((a: any) => a.name) || [];
      return activeAmenities.every(active => 
        hostelAmenityNames.some((name: string) => name.toLowerCase() === active.toLowerCase())
      );
    });
  }, [hostels, activeAmenities]);

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(campusName + " Kenya")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#030712] min-h-screen text-slate-400 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* FLOATING ACTION HUB - Mobile Only */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 lg:hidden">
        <div className="bg-slate-900/80 backdrop-blur-2xl p-1.5 rounded-[2rem] border border-white/10 shadow-2xl flex items-center">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={16} /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:text-white'}`}
            >
              <MapIcon size={16} /> Map
            </button>
        </div>
      </div>

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-[#0F172A] w-full max-w-xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Filter Hostels</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Select amenities you need</p>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
               {globalAmenities?.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => toggleAmenity(item.name)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black transition-all ${
                      activeAmenities.includes(item.name) 
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" 
                        : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <Layers size={16} />
                    {item.name}
                  </button>
               ))}
            </div>

            <div className="p-8 bg-slate-900/50 flex gap-4">
               <button onClick={() => { setActiveAmenities([]); setIsFilterOpen(false); }} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Reset All</button>
               <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 hover:text-white transition-all">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="pt-32 pb-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={14} /> Back to Discovery
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">{campusName}</h1>
              <div className="flex items-center gap-4 mt-8">
                 <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <MapPin size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Kenya Campus</span>
                 </div>
                 <div className="h-1 w-1 rounded-full bg-slate-800 hidden md:block" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                   {filteredHostels.length} Detailed Listings
                 </p>
                 <button onClick={() => setIsFilterOpen(true)} className="hidden lg:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
                   <Filter size={12} strokeWidth={3} />
                   Filter Hostels
                   {activeAmenities.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white text-black rounded-md text-[8px]">{activeAmenities.length}</span>}
                 </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1600px] mx-auto px-6 pb-40">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className={`flex-1 ${viewMode === 'map' ? 'hidden' : 'block'} lg:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {hostelsLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-slate-900/40 rounded-[2.5rem] animate-pulse border border-slate-800" />)
              ) : filteredHostels.length > 0 ? (
                filteredHostels.map((hostel: any) => (
                  <HostelCardWrapper key={hostel.id} hostel={hostel} />
                ))
              ) : (
                <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-50">
                  <SearchX size={64} strokeWidth={1} />
                  <h3 className="mt-6 text-xl font-black uppercase italic tracking-widest">No Matches</h3>
                </div>
              )}
            </div>
          </div>

          {/* MAP SIDE */}
          <div className={`lg:w-[450px] xl:w-[550px] ${viewMode === 'list' ? 'hidden' : 'block'} lg:block`}>
            <div className="lg:sticky lg:top-28 w-full h-[60vh] lg:h-[75vh] bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative transition-all">
              <iframe title="Campus Map" src={mapSrc} className="w-full h-full border-0 brightness-[0.7] contrast-[1.1] grayscale-[0.2]" allowFullScreen />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712]/50 to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Map View</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampusDestinationPage;