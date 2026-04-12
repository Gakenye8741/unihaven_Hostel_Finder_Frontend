import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { 
  Loader2, SearchX, SlidersHorizontal, ShieldCheck, Star, X, Navigation, Home, 
  RotateCcw, Search, Wifi, Droplets, Zap, Shield, Car, Coffee, Tv, Heart
} from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';
import toast, { Toaster } from 'react-hot-toast';

// API Imports
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api';
import { useGetHostelReviewsQuery } from '../features/Apis/Review.Api';

// Wishlist API Imports
import { 
  useAddToWishlistMutation, 
  useRemoveFromWishlistMutation, 
  useCheckFavoriteStatusQuery 
} from '../features/Apis/Wishlist.Api';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCampus = searchParams.get("campus") || "";
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(initialCampus);
  const [maxPrice, setMaxPrice] = useState<number>(200000); 
  const [roomType, setRoomType] = useState("");

  const { data: hostels, isLoading } = useGetAllHostelsQuery({ 
    campus: selectedCampus || undefined 
  });

  const availableCampuses = useMemo(() => {
    if (!hostels) return [];
    const campuses = hostels.map((h: any) => h.campus).filter(Boolean);
    return Array.from(new Set(campuses)) as string[];
  }, [hostels]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCampus("");
    setMaxPrice(200000);
    setRoomType("");
  };

  const resultsBySearch = useMemo(() => {
    if (!hostels) return [];
    return hostels.filter((hostel: any) => {
      const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCampus = selectedCampus === "" || hostel.campus === selectedCampus;
      return matchesSearch && matchesCampus;
    });
  }, [hostels, searchQuery, selectedCampus]);

  return (
    <div className="bg-[#0B0F1A] min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Navbar />

      {/* FILTER PARAMETERS MODAL */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Refine Search</h3>
                <button onClick={handleReset} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 mt-1 hover:text-rose-400 transition-colors">
                  <RotateCcw size={12} /> Clear Filters
                </button>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2"><Navigation size={12} /> Institution / Campus</label>
                <select 
                  value={selectedCampus} 
                  onChange={(e) => setSelectedCampus(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">All Locations ({availableCampuses.length})</option>
                  {availableCampuses.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2"><Home size={12} /> Room Category</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none appearance-none">
                  <option value="">Any Category</option>
                  <option value="One Bedroom">One Bedroom</option>
                  <option value="Two Bedroom">Two Bedroom</option>
                  <option value="Bed sitter">Bedsitter</option>
                  <option value="Single Room">Single Room</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Max Budget (KES)</label>
                  <span className="text-white font-black text-sm italic">{maxPrice.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="200000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer" />
              </div>

              <button onClick={() => setIsFilterOpen(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all">Update Marketplace</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Hostels <span className="text-[#6366F1]">Page</span></h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {resultsBySearch.length} Verified Listings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH HOSTEL NAME.." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="bg-slate-900 border border-slate-800 text-white pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase w-full md:w-64 focus:border-indigo-500/50 transition-all shadow-xl" 
              />
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-indigo-500/50 transition-all shadow-2xl">
              <SlidersHorizontal size={16} className="text-[#6366F1]" /> Refine Parameters
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800/50 rounded-[4rem]">
            <Loader2 className="text-[#6366F1] animate-spin mb-6" size={56} strokeWidth={1} />
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-black italic">Synchronizing Data...</p>
          </div>
        )}

        {!isLoading && (
          resultsBySearch.length === 0 ? (
            <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[4rem] p-24 text-center">
              <SearchX size={44} className="text-slate-600 mx-auto mb-8" strokeWidth={1} />
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Zero Hostels Match</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Try adjusting your search query or refine parameters</p>
              <button onClick={handleReset} className="px-10 py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95">Clear All Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {resultsBySearch.map((hostel: any) => (
                <HostelCardWrapper key={hostel.id} hostel={hostel} maxPrice={maxPrice} roomType={roomType} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
};

const HostelCardWrapper: React.FC<{ hostel: any, maxPrice: number, roomType: string }> = ({ hostel, maxPrice, roomType }) => {
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(hostel.id);
  const { data: gallery } = useGetHostelGalleryQuery(hostel.id);
  const { data: reviewResponse } = useGetHostelReviewsQuery(hostel.id);

  // Wishlist Logic
  const { data: favStatus } = useCheckFavoriteStatusQuery(hostel.id);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
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

  const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi size={14} />;
    if (n.includes('water')) return <Droplets size={14} />;
    if (n.includes('power') || n.includes('zap')) return <Zap size={14} />;
    if (n.includes('security')) return <Shield size={14} />;
    if (n.includes('parking')) return <Car size={14} />;
    if (n.includes('kitchen')) return <Coffee size={14} />;
    if (n.includes('tv')) return <Tv size={14} />;
    return null;
  };

  const stats = useMemo(() => {
    const avg = reviewResponse?.stats?.averageRating || 0;
    const count = reviewResponse?.stats?.totalReviews || 0;

    if (!rooms || rooms.length === 0) return { displayPrice: null, types: [], visible: true, avg, count };
    
    const validRooms = rooms.filter((r: any) => !isNaN(Number(r.price)));
    const lowestRoom = validRooms.reduce((prev: any, curr: any) => 
      (Number(prev.price) < Number(curr.price)) ? prev : curr
    , validRooms[0]);

    const minPrice = lowestRoom ? Number(lowestRoom.price) : 0;
    
    const cycleRaw = lowestRoom?.billingCycle || "";
    const billingSuffix = cycleRaw.toLowerCase().includes('semester') ? '/sem' : 
                          cycleRaw.toLowerCase().includes('month') ? '/month' : '';

    const types = rooms.map((r: any) => r.type);

    const priceMatch = minPrice <= maxPrice;
    const typeMatch = roomType === "" || types.some((t: string) => t?.toLowerCase().includes(roomType.toLowerCase()));

    return { 
      displayPrice: lowestRoom ? `${minPrice.toLocaleString()}${billingSuffix}` : null,
      types: Array.from(new Set(types.filter(Boolean))),
      visible: priceMatch && typeMatch,
      avg,
      count
    };
  }, [rooms, reviewResponse, maxPrice, roomType]);

  const displayImage = useMemo(() => {
    const thumb = gallery?.find((m: any) => m.isThumbnail === true);
    return thumb ? thumb.url : hostel.image;
  }, [gallery, hostel.image]);

  if (!stats.visible) return null;

  return (
    <div className="relative group bg-[#0F172A] border border-slate-800/60 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-indigo-500/50 hover:shadow-[0_0_80px_rgba(99,102,241,0.15)] h-full flex flex-col">
      
      {/* Top Left: Verified Badge */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        {hostel.isVerified && (
          <div className="bg-indigo-600 border border-indigo-400 p-2.5 rounded-2xl text-white shadow-2xl">
            <ShieldCheck size={18} />
          </div>
        )}
      </div>

      {/* Top Right: Room Types (Previously hiding the heart) */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
        {!roomsLoading && stats.types.slice(0, 1).map((type: any) => (
          <div key={type} className="bg-slate-950/80 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-indigo-500/30">
            <span className="text-[10px] font-black uppercase text-indigo-400 italic tracking-widest">{type}</span>
          </div>
        ))}
      </div>

      {/* NEW PLACEMENT: Floating Heart Button at Bottom Right of the image area */}
      <div className="absolute bottom-[145px] right-6 z-30">
        <button 
          onClick={handleWishlistToggle}
          className={`p-3.5 rounded-full border shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${
            favStatus?.isFavorited 
              ? 'bg-rose-600 border-rose-400 text-white shadow-rose-500/40' 
              : 'bg-slate-900/90 backdrop-blur-xl border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500'
          }`}
        >
          <Heart size={20} fill={favStatus?.isFavorited ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>

      {/* Amenities Overlay */}
      <div className="absolute bottom-[140px] left-6 right-20 z-20 flex gap-2 flex-wrap">
        {hostel.amenities?.slice(0, 3).map((item: any, idx: number) => (
          <div key={idx} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-2 rounded-xl text-slate-400">
            {getAmenityIcon(item.name || item)}
          </div>
        ))}
      </div>

      {/* Rating Overlay */}
      <div className="absolute top-[185px] right-6 z-20">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-3 py-1.5 rounded-2xl shadow-2xl">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-black text-white italic tracking-tighter">{stats.avg}</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">({stats.count})</span>
        </div>
      </div>

      <HostelCard 
        id={hostel.id} 
        name={hostel.name} 
        address={hostel.address}
        campus={hostel.campus} 
        policy={hostel.policy}
        image={displayImage} 
        price={stats.displayPrice as any} 
        isLoadingPrice={roomsLoading}
      />
    </div>
  );
};

export default SearchResultsPage;