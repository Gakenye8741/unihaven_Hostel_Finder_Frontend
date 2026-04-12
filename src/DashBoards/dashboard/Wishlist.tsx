import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, ArrowRight, Trash2, MapPin, 
  Loader2, Sparkles, LayoutGrid, Info,
  ShieldCheck, TrendingUp, CalendarDays,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetWishlistStatsQuery, useListStudentWishlistQuery, useRemoveFromWishlistMutation } from '../../features/Apis/Wishlist.Api';
import { useListRoomsByHostelQuery } from '../../features/Apis/Rooms.Api';

/**
 * SUB-COMPONENT: WishlistPrice
 * Logic maintained: Fetches rooms, averages prices, identifies cycle.
 */
const WishlistPrice: React.FC<{ hostelId: string }> = ({ hostelId }) => {
  const { data: rooms, isLoading } = useListRoomsByHostelQuery(hostelId);

  const priceData = useMemo(() => {
    if (!rooms || rooms.length === 0) return { avg: 0, cycle: 'Monthly' };
    const total = rooms.reduce((acc, room) => acc + parseFloat(room.price), 0);
    const avg = Math.round(total / rooms.length);
    const cycle = rooms[0].billingCycle === 'Per Semester' ? 'Semester' : 'Month';
    return { avg, cycle };
  }, [rooms]);

  if (isLoading) return <div className="h-12 w-32 bg-white/[0.03] animate-pulse rounded-2xl" />;

  return (
    <div className="relative group/price">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Market Average</span>
      </div>
      <div className="flex flex-col">
        <p className="text-white font-black text-4xl italic tracking-tighter leading-none tracking-tight">
          <span className="text-indigo-500 text-xl not-italic mr-1">KES</span>
          {priceData.avg > 0 ? priceData.avg.toLocaleString() : '---'}
        </p>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
          <CalendarDays size={12} className="text-indigo-400" /> Per {priceData.cycle}
        </span>
      </div>
    </div>
  );
};

const StudentWishlist: React.FC = () => {
  const { data: wishlist, isLoading } = useListStudentWishlistQuery();
  const { data: stats } = useGetWishlistStatsQuery();
  const [removeFromWishlist, { isLoading: isDeleting }] = useRemoveFromWishlistMutation();

  const handleDelete = async (e: React.MouseEvent, hostelId: string) => {
    e.preventDefault(); 
    try {
      await removeFromWishlist(hostelId).unwrap();
      toast.success("REMOVED FROM VAULT", {
        style: { 
          borderRadius: '20px', 
          background: '#0F172A', 
          color: '#fff', 
          border: '1px solid rgba(99, 102, 241, 0.2)',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '0.1em'
        }
      });
    } catch (err) {
      toast.error("ACTION INTERRUPTED");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
          <Heart className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={32} />
        </div>
        <p className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Decrypting Wishlist...</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-40 px-4 md:px-0">
      
      {/* --- ELITE HEADER SECTION --- */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/[0.04]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={12} className="text-indigo-400" />
            <span className="text-indigo-400 text-[8px] font-black uppercase tracking-widest">Student Dashboard</span>
          </div>
          <div>
            <h3 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Wishlist</span>
            </h3>
            <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80">
              {stats?.totalSaved || 0} Curated Properties in Secure Storage
            </p>
          </div>
        </div>
        
        {wishlist && wishlist.length > 0 && (
            <div className="group bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6 rounded-[2rem] border border-white/[0.05] backdrop-blur-3xl md:w-64">
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">Vault Integrity</span>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white font-black text-lg italic tracking-tighter">Verified</p>
                  <ShieldCheck className="text-indigo-500" size={20} />
                </div>
            </div>
        )}
      </div>

      {/* --- LUXURY GRID --- */}
      <div className="grid grid-cols-1 gap-10">
        {wishlist && wishlist.length > 0 ? (
          wishlist.map((item: any) => (
            <Link 
              key={item.hostelId} 
              to={`/hostels/${item.hostelId}`}
              className="group relative flex flex-col md:flex-row bg-[#020617] border border-white/[0.05] rounded-[3.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 hover:shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]"
            >
              {/* IMAGE WRAPPER */}
              <div className="relative w-full md:w-[420px] h-72 md:h-auto overflow-hidden">
                <img 
                  src={item.hostel.media?.[0]?.url || "https://images.unsplash.com/photo-1555854817-5b2247a8175f?q=80&w=1200"} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                  alt={item.hostel.name} 
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent hidden md:block" />
                
                {/* Float Badge */}
                <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <ShieldCheck size={14} className="text-indigo-500" />
                  <span className="text-white text-[9px] font-black uppercase tracking-tighter">Premium Unit</span>
                </div>
              </div>

              {/* CONTENT PANEL */}
              <div className="flex-1 p-10 md:p-14 flex flex-col justify-between relative">
                <div className="space-y-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="space-y-3">
                      <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter group-hover:tracking-normal transition-all duration-500 leading-[0.8]">
                        {item.hostel.name}
                      </h4>
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">
                          {item.hostel.address || 'Nyahururu Sector'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleDelete(e, item.hostelId)}
                      disabled={isDeleting}
                      className="group/btn p-5 bg-white/[0.03] text-slate-500 rounded-3xl hover:bg-rose-500 transition-all border border-white/[0.05] active:scale-90"
                    >
                      <Trash2 size={24} className="group-hover/btn:text-white transition-colors" />
                    </button>
                  </div>

                  {/* AMENITIES PILLS */}
                  <div className="flex flex-wrap gap-3">
                    {item.hostel.amenities?.slice(0, 3).map((a: any, i: number) => (
                      <span key={i} className="px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-all">
                        {a.amenity.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                  {/* PRICE INTEGRATION (Logic preserved) */}
                  <WishlistPrice hostelId={item.hostelId} />

                  <div className="flex items-center gap-8">
                    <div className="hidden lg:flex flex-col items-end group/view">
                       <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] italic group-hover:pr-2 transition-all">Deep View</span>
                       <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-indigo-500 mt-2" />
                    </div>
                    <div className="relative flex items-center justify-center bg-white text-black w-20 h-20 rounded-[2.2rem] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group-hover:shadow-indigo-500/40">
                      <ArrowRight size={32} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP HOVER DETAIL */}
              <div className="absolute top-10 right-32 hidden xl:block opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                <div className="flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md rounded-2xl">
                  <Info size={14} className="text-indigo-400" />
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Inspect Property</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          /* --- ARCHITECTURAL EMPTY STATE --- */
          <div className="relative py-32 rounded-[4rem] border-2 border-dashed border-white/[0.05] bg-white/[0.01] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/[0.03] via-transparent to-transparent" />
            
            <div className="relative z-10 p-12 bg-[#020617] rounded-[3rem] border border-white/[0.05] shadow-2xl mb-12">
              <Heart size={80} className="text-slate-800" strokeWidth={1} />
            </div>
            
            <h4 className="relative z-10 text-white font-black uppercase italic tracking-tighter text-4xl mb-4">The Vault is Open</h4>
            <p className="relative z-10 text-slate-500 text-[11px] font-black uppercase tracking-[0.6em] mb-12 opacity-60">No saved assets detected</p>
            
            <Link 
              to="/hostels" 
              className="relative z-10 group flex items-center gap-6 bg-white text-black px-14 py-7 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-white/10 active:scale-95"
            >
              Acquire Favorites <LayoutGrid size={20} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentWishlist;