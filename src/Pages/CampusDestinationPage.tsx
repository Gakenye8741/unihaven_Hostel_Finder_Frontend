import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useGetAllGlobalAmenitiesQuery } from '../features/Apis/Amenities.Api';
import { useGetHostelReviewsQuery } from '../features/Apis/Review.Api';
import { 
  MapPin, ArrowLeft, Filter, SearchX, Layers, Star,
  Check, Users, X, Map as MapIcon, List, Heart,
  CircleDollarSign, Home, ShieldCheck
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
  const { data: reviewResponse } = useGetHostelReviewsQuery(hostel.id);
  const { data: favStatus } = useCheckFavoriteStatusQuery(hostel.id);
  
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); 
    
    // Clear existing toasts so only one shows at a time
    toast.dismiss();

    try {
      if (favStatus?.isFavorited) {
        await removeFromWishlist(hostel.id).unwrap();
        toast.success(`${hostel.name} removed from wishlist`, {
            style: {
              background: '#0F172A',
              color: '#fff',
              border: '1px solid #1E293B',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }
        });
      } else {
        await addToWishlist({ hostelId: hostel.id }).unwrap();
        toast.success(`${hostel.name} added to wishlist`, {
            style: {
              background: '#0F172A',
              color: '#fff',
              border: '1px solid #6366F1',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }
        });
      }
    } catch (err) { 
        toast.error("Wishlist sync failed"); 
    }
  };

  const stats = useMemo(() => {
    // Safety check for avg calculation
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
    <div className="relative group bg-[#0F172A] border border-slate-800/60 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-indigo-500/50 hover:shadow-[0_0_80px_rgba(99,102,241,0.15)] h-full flex flex-col">
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
        {hostel.isVerified && <MetaBadge />}
        <PolicyBadge policy={hostel.policy} />
      </div>

      <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xl">
        <Star size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-[10px] font-black text-white">
          {stats.avg > 0 ? stats.avg.toFixed(1) : "New"}
        </span>
        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">({stats.count})</span>
      </div>

      <div className="absolute bottom-[145px] right-6 z-30">
        <button onClick={handleWishlistToggle} className={`p-4 rounded-full border shadow-2xl transition-all duration-500 hover:scale-110 ${favStatus?.isFavorited ? 'bg-rose-600 border-rose-400 text-white' : 'bg-slate-900/90 backdrop-blur-xl border-slate-700 text-slate-400 hover:text-white'}`}>
          <Heart size={20} fill={favStatus?.isFavorited ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>

      <HostelCard 
        id={hostel.id} 
        name={hostel.name} 
        address={hostel.address} 
        campus={hostel.campus} 
        policy={hostel.policy} 
        image={gallery?.find((m: any) => m.isThumbnail)?.url || hostel.image} 
        price={stats.price} 
        isLoadingPrice={roomsLoading} 
      />

      {!roomsLoading && stats.types.length > 0 && (
        <div className="absolute top-20 right-6 flex flex-col gap-1.5 items-end pointer-events-none">
            {stats.types.slice(0, 2).map((type: any) => (
                <div key={type} className="bg-indigo-600/20 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-500/30">
                    <span className="text-[8px] font-black uppercase text-indigo-300 tracking-widest">{type}</span>
                </div>
            ))}
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
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [roomType, setRoomType] = useState<string>('All');
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleAmenity = (name: string) => {
    setActiveAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
  };

  const filteredHostels = useMemo(() => {
    if (!hostels) return [];
    return hostels.filter((h: any) => {
      const hostelAmenityNames = h.amenities?.map((a: any) => a.name) || [];
      const matchesAmenities = activeAmenities.length === 0 || 
        activeAmenities.every(active => hostelAmenityNames.some((name: string) => name.toLowerCase() === active.toLowerCase()));
      
      const matchesPrice = (h.lowestPrice || 0) <= priceRange;
      const matchesRoomType = roomType === 'All' || (h.roomTypes && h.roomTypes.includes(roomType));

      return matchesAmenities && matchesPrice && matchesRoomType;
    });
  }, [hostels, activeAmenities, priceRange, roomType]);

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(campusName + " Kenya")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#030712] min-h-screen text-slate-400 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Toast configuration matching the Search Results style */}
      <Toaster position="bottom-right" reverseOrder={false} />
      <Navbar />

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-[#0F172A] w-full max-w-2xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Filter Hostels</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Refine your search parameters</p>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-slate-950 text-slate-400 rounded-2xl hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-10">
               <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        <CircleDollarSign size={16} /> Max Price (KES)
                    </label>
                    <span className="text-xl font-black text-white italic">{priceRange.toLocaleString()}</span>
                  </div>
                  <input type="range" min="2000" max="50000" step="500" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
               </div>

               <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-4">
                    <Home size={16} /> Room Preference
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['All', 'Single', 'Bedsitter', 'One Bedroom', 'Shared'].map((type) => (
                        <button key={type} onClick={() => setRoomType(type)} className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${roomType === type ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-900/50 border-slate-800 text-slate-400"}`}>
                            {type}
                        </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-4">
                    <Layers size={16} /> Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {globalAmenities?.map((item: any) => (
                        <button key={item.id} onClick={() => toggleAmenity(item.name)} className={`flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black transition-all ${activeAmenities.includes(item.name) ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"}`}>
                            <div className={`w-2 h-2 rounded-full ${activeAmenities.includes(item.name) ? "bg-white" : "bg-slate-700"}`} />
                            {item.name}
                        </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-900/50 flex gap-4 border-t border-slate-800">
               <button onClick={() => { setActiveAmenities([]); setPriceRange(50000); setRoomType('All'); }} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Reset</button>
               <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 hover:text-white transition-all">Apply Experience</button>
            </div>
          </div>
        </div>
      )}

      <header className="pt-32 pb-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={14} /> Back to Discovery
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">{campusName}</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mt-6">{filteredHostels.length} Luxury Spaces Available</p>
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20">
                <Filter size={16} /> Refine Search
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pb-40">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className={`flex-1 w-full ${viewMode === 'map' ? 'hidden' : 'block'} lg:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hostelsLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-slate-900/40 rounded-[2.5rem] animate-pulse border border-slate-800" />)
              ) : filteredHostels.length > 0 ? (
                filteredHostels.map((hostel: any) => <HostelCardWrapper key={hostel.id} hostel={hostel} />)
              ) : (
                <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-50">
                  <SearchX size={64} strokeWidth={1} />
                  <h3 className="mt-6 text-xl font-black uppercase italic tracking-widest">No Matches Found</h3>
                </div>
              )}
            </div>
          </div>

          <div className={`lg:w-[450px] xl:w-[550px] w-full lg:sticky lg:top-24 ${viewMode === 'list' ? 'hidden' : 'block'} lg:block`}>
            <div className="w-full h-[60vh] lg:h-[75vh] bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative">
              <iframe title="Campus Map" src={mapSrc} className="w-full h-full border-0 brightness-[0.7] contrast-[1.1] grayscale-[0.2]" allowFullScreen />
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 lg:hidden">
        <div className="bg-slate-900/90 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl flex items-center">
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-slate-400'}`}><List size={16} /> List</button>
            <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-black' : 'text-slate-400'}`}><MapIcon size={16} /> Map</button>
        </div>
      </div>
    </div>
  );
};

export default CampusDestinationPage;