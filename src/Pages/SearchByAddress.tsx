import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useGetAllGlobalAmenitiesQuery } from '../features/Apis/Amenities.Api';
import { useGetHostelReviewsQuery } from '../features/Apis/Review.Api';
import { 
  MapPin, ArrowLeft, Filter, SearchX, Layers, 
  Check, Users, X, Map as MapIcon, 
  List, Globe, Heart, Star, Sparkles
} from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';
import Navbar from '../Components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

// Wishlist API Imports
import { 
  useAddToWishlistMutation, 
  useRemoveFromWishlistMutation, 
  useCheckFavoriteStatusQuery 
} from '../features/Apis/Wishlist.Api';

/* --- ENHANCED MINI COMPONENTS --- */

const MetaBadge: React.FC = () => (
  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
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
    ? { bg: "bg-rose-600", border: "border-rose-400", text: "text-white", icon: "text-rose-100" }
    : isBoys 
      ? { bg: "bg-blue-600", border: "border-blue-400", text: "text-white", icon: "text-blue-100" }
      : { bg: "bg-slate-800", border: "border-slate-600", text: "text-white", icon: "text-slate-300" };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl ${theme.bg} ${theme.border} ${theme.text} transition-all duration-300`}>
      <Users size={11} strokeWidth={3} className={theme.icon}  />
      <span className="text-[9px] font-black uppercase tracking-[0.1em] drop-shadow-md">{policy}</span>
    </div>
  );
};

const HostelCardWrapper: React.FC<{ hostel: any; index: number }> = ({ hostel, index }) => {
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(hostel.id);
  const { data: gallery } = useGetHostelGalleryQuery(hostel.id);
  const { data: reviewResponse } = useGetHostelReviewsQuery(hostel.id);
  const { data: favStatus } = useCheckFavoriteStatusQuery(hostel.id);
  
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); 
    toast.dismiss();
    try {
      if (favStatus?.isFavorited) {
        await removeFromWishlist(hostel.id).unwrap();
        toast.success(`${hostel.name} removed`, {
            style: { background: '#0F172A', color: '#fff', border: '1px solid #1E293B', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }
        });
      } else {
        await addToWishlist({ hostelId: hostel.id }).unwrap();
        toast.success(`${hostel.name} added`, {
            style: { background: '#0F172A', color: '#fff', border: '1px solid #6366F1', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }
        });
      }
    } catch (err) { 
        toast.error("Error updating wishlist"); 
    }
  };

  const stats = useMemo(() => {
    const avg = Number(reviewResponse?.stats?.averageRating) || 0;
    const count = reviewResponse?.stats?.totalReviews || 0;
    
    if (!rooms || rooms.length === 0) return { price: null, types: [], avg, count };
    
    const validRooms = rooms.filter((r: any) => !isNaN(Number(r.price)));
    const lowestRoom = validRooms.reduce((prev: any, curr: any) => (Number(prev.price) < Number(curr.price)) ? prev : curr, validRooms[0]);
    
    return { 
      price: lowestRoom ? Number(lowestRoom.price) : null, 
      types: Array.from(new Set(rooms.map((r: any) => r.type).filter(Boolean))), 
      avg, 
      count 
    };
  }, [rooms, reviewResponse]);

  return (
    <div className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-[#0F172A]/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 h-full flex flex-col">
        
        {/* TOP LEFT BADGES */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
          {hostel.isVerified && <MetaBadge />}
          <PolicyBadge policy={hostel.policy} />
        </div>

        {/* TOP RIGHT RATING */}
        <div className="absolute top-6 right-6 z-20 bg-black/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xl">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black text-white">
            {stats.avg > 0 ? stats.avg.toFixed(1) : "New"}
          </span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">({stats.count})</span>
        </div>

        {/* ROOM TYPES - UPDATED FOR HIGH VISIBILITY */}
        {!roomsLoading && stats.types.length > 0 && (
          <div className="absolute top-20 right-6 flex flex-col gap-2 items-end pointer-events-none z-20">
              {stats.types.slice(0, 2).map((type: any) => (
                  <div key={type} className="bg-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-400 shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                      <span className="text-[9px] font-black uppercase text-white tracking-[0.15em] drop-shadow-md">{type}</span>
                  </div>
              ))}
          </div>
        )}

        {/* FLOATING HEART */}
        <div className="absolute bottom-[145px] right-6 z-30">
          <button onClick={handleWishlistToggle} className={`p-4 rounded-full border shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${favStatus?.isFavorited ? 'bg-rose-600 border-rose-400 text-white' : 'bg-slate-900/95 backdrop-blur-xl border-slate-700 text-slate-400 hover:text-white'}`}>
            <Heart size={20} fill={favStatus?.isFavorited ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        <HostelCard 
          id={hostel.id}
          name={hostel.name}
          address={hostel.address}
          campus={hostel.campus}
          policy={hostel.policy}
          isVerified={false}
          image={gallery?.find((m: any) => m.isThumbnail === true)?.url || hostel.image}
          price={stats.price} 
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

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery + " Kenya")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#030712] min-h-screen text-slate-400 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Navbar />

      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

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
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
                   {filteredHostels.length} curated matches
                 </p>
              </div>
            </div>

            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-3 bg-[#0F172A] hover:bg-indigo-600 border border-slate-800 hover:border-indigo-400 text-white px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]"
            >
              <Filter size={16} /> Filters {activeAmenities.length > 0 && `(${activeAmenities.length})`}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 pb-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
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
                  <SearchX size={48} strokeWidth={1} className="text-slate-700 mb-6" />
                  <h3 className="text-2xl font-black uppercase italic tracking-widest text-white">Zero results</h3>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[500px] xl:w-[600px] hidden lg:block">
            <div className="sticky top-32 w-full">
              <div className="relative h-[70vh] rounded-[3.5rem] overflow-hidden border border-slate-800 shadow-2xl">
                <iframe 
                  title="Location Map" 
                  src={mapSrc} 
                  className="w-full h-full border-0 brightness-[0.7] contrast-[1.1] grayscale-[0.2]" 
                  allowFullScreen 
                />
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Map View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-[#0F172A] w-full max-w-2xl border border-white/5 rounded-[4rem] overflow-hidden animate-in zoom-in-95">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Preferences</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-4 bg-slate-900 text-slate-400 rounded-3xl hover:text-white transition-all">
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
                        className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${
                          isActive 
                            ? "bg-indigo-600 border-indigo-400 text-white" 
                            : "bg-slate-900/50 border-white/5 text-slate-400"
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                        {isActive && <Check size={14} strokeWidth={4} />}
                      </button>
                    );
                 })}
              </div>
            </div>

            <div className="p-10 bg-black/20 flex gap-4">
               <button onClick={() => { setActiveAmenities([]); setIsFilterOpen(false); }} className="flex-1 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Reset</button>
               <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-xl">Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchByAddress;