import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetAllGlobalAmenitiesQuery, 
  useListAmenitiesByHostelQuery, 
  useSyncHostelAmenitiesMutation 
} from '../../features/Apis/Amenities.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Wifi, Coffee, Shield, Tv, Wind, Zap, Car, Utensils, 
  Loader2, Building2, Search, CheckCircle2, LayoutGrid,
  Router, Monitor, Waves, Flame, Dumbbell, Settings2, 
  Info, MessageSquare, ArrowRight, Sparkles, Globe, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICON_MAP: Record<string, any> = {
  wifi: Wifi, router: Router, coffee: Coffee, shield: Shield, 
  tv: Tv, monitor: Monitor, wind: Wind, waves: Waves, 
  zap: Zap, flame: Flame, car: Car, utensils: Utensils,
  gym: Dumbbell, default: Sparkles
};

const OwnerAmenityManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const userId = user?.id || user?._id;

  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: allHostels } = useGetAllHostelsQuery({});
  const { data: globalCatalog, isLoading: catalogLoading } = useGetAllGlobalAmenitiesQuery();
  const { data: activeHostelAmenities, isLoading: syncLoading } = useListAmenitiesByHostelQuery(selectedHostelId, { skip: !selectedHostelId });
  const [syncAmenities, { isLoading: isSyncing }] = useSyncHostelAmenitiesMutation();

  const ownedHostels = useMemo(() => {
    if (!allHostels) return [];
    if (user?.role === 'SuperAdmin') return allHostels;
    return allHostels.filter((h: any) => h.owner === userId || h.ownerId === userId);
  }, [allHostels, userId, user?.role]);

  const filteredCatalog = useMemo(() => 
    globalCatalog?.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [globalCatalog, searchTerm]
  );

  const toggleAmenitySelection = async (amenityId: string) => {
    if (!selectedHostelId) return toast.error("Selection Required");
    const currentIds = activeHostelAmenities?.map(a => a.id) || [];
    const isAdding = !currentIds.includes(amenityId);
    const newIds = isAdding ? [...currentIds, amenityId] : currentIds.filter(id => id !== amenityId);

    try {
      await syncAmenities({ hostelId: selectedHostelId, amenityIds: newIds }).unwrap();
      toast.success(isAdding ? "Service Deployed" : "Service Retracted");
    } catch (err) { toast.error("Sync Error"); }
  };

  return (
    <div className="h-screen bg-[#030712] text-slate-300 p-4 lg:p-8 flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
              <Settings2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Amenity<span className="text-indigo-500 not-italic">Vault</span></h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Property Configuration</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <select 
              value={selectedHostelId} 
              onChange={(e) => setSelectedHostelId(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="">Select Property...</option>
              {ownedHostels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </header>
      </div>

      {/* --- MAIN CONTENT AREA (FIXED HEIGHT) --- */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 shadow-xl">
             <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-indigo-500" /> Request Asset
             </h3>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6">Missing a service? Contact Admin to whitelist new amenities.</p>
             <button onClick={() => window.location.href='mailto:support@unihaven.com'} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5">
               Contact Support
             </button>
          </div>

          <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] p-6">
             <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-indigo-500" />
                <h4 className="text-white font-bold text-xs italic">Live Status</h4>
             </div>
             <div className="space-y-3">
               <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-500">
                  <span>Sync Encryption</span>
                  <span className="text-emerald-500">Active</span>
               </div>
               <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-500">
                  <span>Global Catalog</span>
                  <span>{globalCatalog?.length || 0} items</span>
               </div>
             </div>
          </div>
        </aside>

        {/* --- GRID CONTAINER (INTERNAL SCROLL) --- */}
        <main className="lg:col-span-9 bg-slate-900/30 border border-white/5 rounded-[2.5rem] flex flex-col min-h-0 relative overflow-hidden">
          
          {/* STICKY CONTROL BAR */}
          <div className="p-6 md:px-10 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <LayoutGrid size={18} className="text-indigo-500" />
              <h2 className="text-white font-black uppercase text-xs tracking-widest">Infrastructure Deployment</h2>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input 
                type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* SCROLLABLE GRID */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {!selectedHostelId ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                 <Building2 size={40} className="mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Select a property above</p>
              </div>
            ) : catalogLoading ? (
              <div className="h-full flex flex-col items-center justify-center">
                 <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Decrypting Catalog...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCatalog?.map((amenity) => {
                  const Icon = ICON_MAP[amenity.icon] || ICON_MAP.default;
                  const isActive = activeHostelAmenities?.some(a => a.id === amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenitySelection(amenity.id)}
                      disabled={isSyncing}
                      className={`group relative p-6 rounded-[1.8rem] border-2 transition-all duration-300 flex items-center gap-4 ${
                        isActive 
                        ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-950 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-all ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500 group-hover:text-indigo-400'}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest text-left ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {amenity.name}
                      </span>
                      {isActive && <CheckCircle2 size={14} className="absolute top-4 right-4 text-white/60" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER BAR */}
          <div className="px-10 py-4 bg-slate-950/50 border-t border-white/5 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">
                  System Status: {isSyncing ? 'Syncing' : 'Operational'}
                </span>
             </div>
             <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Inventory Management Engine</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerAmenityManager;