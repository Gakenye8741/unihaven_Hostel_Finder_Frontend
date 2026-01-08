import React, { useState, useMemo } from 'react';
import { 
  useGetAllGlobalAmenitiesQuery, 
  useCreateAmenityMutation, 
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useListAmenitiesByHostelQuery,
  useSyncHostelAmenitiesMutation
} from '../../features/Apis/Amenities.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Wifi, Coffee, Shield, Tv, Wind, Zap, Car, Utensils, 
  Plus, Trash2, Save, Loader2, Building2, Search, 
  CheckCircle2, AlertCircle, Sparkles, LayoutGrid,
  Edit3, X, Router, Monitor, Waves, Flame, Dumbbell, Info, Settings2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICON_MAP: Record<string, any> = {
  wifi: Wifi, router: Router, coffee: Coffee, shield: Shield, 
  tv: Tv, monitor: Monitor, wind: Wind, waves: Waves, 
  zap: Zap, flame: Flame, car: Car, utensils: Utensils,
  gym: Dumbbell, default: Sparkles
};

const AmenityManager: React.FC = () => {
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: 'wifi' });

  // API Hooks
  const { data: hostels } = useGetAllHostelsQuery({});
  const { data: globalCatalog, isLoading: catalogLoading } = useGetAllGlobalAmenitiesQuery();
  const { data: activeHostelAmenities, isLoading: syncLoading } = useListAmenitiesByHostelQuery(selectedHostelId, { skip: !selectedHostelId });

  const [createGlobal, { isLoading: isCreating }] = useCreateAmenityMutation();
  const [updateGlobal, { isLoading: isUpdating }] = useUpdateAmenityMutation();
  const [deleteGlobal, { isLoading: isDeleting }] = useDeleteAmenityMutation();
  const [syncAmenities, { isLoading: isSyncing }] = useSyncHostelAmenitiesMutation();

  const filteredCatalog = useMemo(() => 
    globalCatalog?.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [globalCatalog, searchTerm]
  );

  const handleForgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Amenity name is required");
    try {
      if (editingId) {
        await updateGlobal({ id: editingId, body: formData }).unwrap();
        toast.success("Global catalog updated successfully");
        setEditingId(null);
      } else {
        await createGlobal(formData).unwrap();
        toast.success("New amenity registered to system");
      }
      setFormData({ name: '', icon: 'wifi' });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to save. Check Admin permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGlobal(id).unwrap();
      toast.success("Amenity permanently removed");
      setDeleteConfirmId(null);
    } catch (err) { toast.error("Unauthorized: Admin access required"); }
  };

  const toggleAmenitySelection = async (amenityId: string) => {
    if (!selectedHostelId) return toast.error("Please select a hostel first");
    
    const currentIds = activeHostelAmenities?.map(a => a.id) || [];
    const isAdding = !currentIds.includes(amenityId);
    const newIds = isAdding
      ? [...currentIds, amenityId]
      : currentIds.filter(id => id !== amenityId);

    try {
      await syncAmenities({ hostelId: selectedHostelId, amenityIds: newIds }).unwrap();
      toast.success(isAdding ? "Service added to hostel" : "Service removed from hostel");
    } catch (err) { toast.error("Sync failed: Check network or permissions"); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-10">
      
      {/* GLOSSY HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-500/20">
              <Settings2 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Amenity<span className="text-indigo-500 not-italic">Control</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">System Infrastructure Management</p>
            </div>
          </div>

          <div className="relative w-full lg:w-96">
            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
            <select 
              value={selectedHostelId} 
              onChange={(e) => setSelectedHostelId(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:ring-2 ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Hostel to Manage...</option>
              {hostels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SYSTEM CATALOG */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
              <Plus size={16} className="text-indigo-500" /> {editingId ? 'Update Global Item' : 'Create Global Item'}
            </h3>
            <form onSubmit={handleForgeSubmit} className="space-y-4">
              <input 
                disabled={isCreating || isUpdating}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Amenity Name..."
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
              />
              <select 
                disabled={isCreating || isUpdating}
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none cursor-pointer disabled:opacity-50"
              >
                {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon.toUpperCase()}</option>)}
              </select>
              <button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                {(isCreating || isUpdating) ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Save Changes' : 'Register Amenity')}
              </button>
            </form>
          </div>

          {/* CATALOG LIST */}
          <div className="bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-6">
             <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 px-2 flex justify-between items-center">
                Global System List
                {catalogLoading && <Loader2 className="animate-spin text-indigo-500" size={12} />}
             </h4>
             <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {globalCatalog?.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-transparent hover:border-white/5 transition-all group">
                    <div className="flex items-center gap-3">
                       {React.createElement(ICON_MAP[a.icon] || ICON_MAP.default, { size: 16, className: "text-indigo-400" })}
                       <span className="text-xs font-bold text-slate-300">{a.name}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(a.id); setFormData({name:a.name, icon:a.icon}); }} className="p-2 hover:bg-indigo-500/20 text-indigo-400 rounded-lg"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleteConfirmId(a.id)} className="p-2 hover:bg-rose-500/20 text-rose-500 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT: HOSTEL SYNC GRID */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl">
                <LayoutGrid size={22} className="text-indigo-500" />
              </div>
              <h2 className="text-white font-black uppercase text-sm tracking-widest">Hostel Deployment</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input 
                type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-white/5 rounded-xl py-2.5 pl-10 pr-6 text-xs text-white focus:border-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>

          {!selectedHostelId ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <Building2 size={64} className="mb-4" />
               <p className="text-xs font-black uppercase tracking-widest">Select a hostel to begin deployment</p>
            </div>
          ) : syncLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
               <Loader2 className="animate-spin text-indigo-500" size={32} />
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Loading Associations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
              {filteredCatalog?.map((amenity) => {
                const Icon = ICON_MAP[amenity.icon] || ICON_MAP.default;
                const isActive = activeHostelAmenities?.some(a => a.id === amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenitySelection(amenity.id)}
                    disabled={isSyncing}
                    className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 ${
                      isActive 
                      ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-500/20 -translate-y-1' 
                      : 'bg-slate-950 border-white/5 hover:border-white/20'
                    } ${isSyncing ? 'cursor-wait opacity-80' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl transition-all ${isActive ? 'bg-white/20 text-white scale-110' : 'bg-white/5 text-slate-500 group-hover:text-indigo-400'}`}>
                      <Icon size={32} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>{amenity.name}</span>
                    
                    <div className="absolute top-6 right-6">
                        {isSyncing ? (
                             <Loader2 className="animate-spin text-white/40" size={14} />
                        ) : (
                            isActive && <CheckCircle2 size={16} className="text-white/60 animate-in fade-in zoom-in" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {selectedHostelId && !syncLoading && (
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    {isSyncing ? 'Syncing...' : 'Live Sync Active'}
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Inventory management system</p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
               {isDeleting ? <Loader2 className="animate-spin" size={40} /> : <AlertCircle size={40} />}
            </div>
            <h4 className="text-white font-black uppercase italic text-xl mb-3 tracking-tighter">Confirm Purge?</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
              Deleting this amenity will remove it from <span className="text-rose-400 font-bold">ALL hostels</span> system-wide.
            </p>
            <div className="flex gap-4">
              <button 
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)} 
                disabled={isDeleting}
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:bg-rose-900"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenityManager;