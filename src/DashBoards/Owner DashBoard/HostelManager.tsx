import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  useCreateRoomMutation, 
  useListRoomsByHostelQuery, 
  useUpdateRoomMutation, 
  useDeleteRoomMutation,
  useGetHostelStatsQuery,
  useUpdateRoomStatusMutation,
} from '../../features/Apis/Rooms.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Plus, Edit, Trash2, X, Loader2, Search,
  DoorOpen, Building2, Users2, CheckCircle2, 
  BedDouble, Wrench, AlertCircle, PieChart, Zap, FileText, MapPin, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- TYPE DEFINITIONS ---
interface RoomFormData {
  label: string;
  floor: string;
  block: string;
  type: 'Single' | 'Bedsitter' | 'One Bedroom' | 'Two Bedroom';
  price: string;
  billingCycle: 'Per Month' | 'Per Semester';
  totalSlots: number;
}

const OwnerRoomManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const adminName = user?.username?.split(' ')[0] || 'Admin';
  const userId = user?.id || user?._id;

  // --- UI STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Full' | 'Maintenance'>('All');

  // --- API HOOKS ---
  const { data: allHostels } = useGetAllHostelsQuery({});
  
  const ownedHostels = useMemo(() => {
    if (!allHostels) return [];
    if (user?.role === 'SuperAdmin') return allHostels;
    return allHostels.filter((h: any) => h.owner === userId || h.ownerId === userId);
  }, [allHostels, userId, user?.role]);

  const { data: rooms, isLoading: isRoomsLoading } = useListRoomsByHostelQuery(selectedHostelId, { skip: !selectedHostelId });
  const { data: stats } = useGetHostelStatsQuery(selectedHostelId, { skip: !selectedHostelId });
  
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [updateStatus] = useUpdateRoomStatusMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [formData, setFormData] = useState<RoomFormData>({
    label: '', floor: '', block: '', type: 'Bedsitter', price: '', billingCycle: 'Per Semester', totalSlots: 1
  });

  // --- HANDLERS ---
  const handleOpenPanel = (room: any | null = null) => {
    if (!selectedHostelId) return toast.error("Select a hostel infrastructure first");
    if (room) {
      setEditingId(room.id);
      setFormData({
        label: room.label, floor: room.floor || '', block: room.block || '',
        type: room.type, price: room.price, billingCycle: room.billingCycle, totalSlots: room.totalSlots
      });
    } else {
      setEditingId(null);
      setFormData({ label: '', floor: '', block: '', type: 'Bedsitter', price: '', billingCycle: 'Per Semester', totalSlots: 1 });
    }
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRoom({ hostelId: selectedHostelId, roomId: editingId, body: formData }).unwrap();
        toast.success("Unit updated successfully");
      } else {
        await createRoom({ ...formData, hostelId: selectedHostelId }).unwrap();
        toast.success("New unit registered");
      }
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed");
    }
  };

  const handleStatusChange = async (roomId: string, status: 'Available' | 'Full' | 'Maintenance') => {
    try {
      await updateStatus({ roomId, status }).unwrap();
      toast.success(`Unit status: ${status}`);
    } catch (err) {
      toast.error("Override failed");
    }
  };

  const filteredRooms = rooms?.filter((r: any) => {
    const matchesSearch = r.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-8 selection:bg-indigo-500/30">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400/80">System.Core / {adminName}</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Room<span className="text-indigo-500 font-extralight not-italic opacity-80">Matrix</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative group flex-1 sm:min-w-[320px]">
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10" size={18} />
              <select 
                value={selectedHostelId} 
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="relative w-full bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl py-5 pl-14 pr-10 text-[12px] font-bold uppercase tracking-widest text-white appearance-none outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer"
              >
                <option value="">{ownedHostels.length > 0 ? "Select Infrastructure" : "No Hostels Linked"}</option>
                {ownedHostels?.map((h: any) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleOpenPanel()}
              disabled={!selectedHostelId}
              className="group bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-indigo-500/20"
            >
              <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> Register Unit
            </button>
          </div>
        </div>

        {/* DASHBOARD STATS */}
        {selectedHostelId && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 animate-in fade-in slide-in-from-top-6 duration-700">
            <StatCard icon={<DoorOpen size={22}/>} label="Total Inventory" value={stats.totalRooms} color="indigo" />
            <StatCard icon={<Users2 size={22}/>} label="Occupied Units" value={stats.occupied} color="rose" />
            <StatCard icon={<CheckCircle2 size={22}/>} label="Live Listings" value={stats.available} color="emerald" />
            <div className="bg-[#0F172A]/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:border-pink-500/20 transition-all group">
                <PieChart size={20} className="text-pink-500 mb-3 group-hover:rotate-12 transition-transform" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-white italic leading-none">{stats.totalRooms > 0 ? Math.round((stats.occupied / stats.totalRooms) * 100) : 0}%</p>
                  <span className="text-[10px] text-slate-600 font-bold mb-1 uppercase">Load</span>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      {selectedHostelId && (
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Filter by label (e.g. RM-402)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="flex gap-2 p-1 bg-slate-900/40 rounded-2xl border border-white/5">
            {['All', 'Available', 'Full', 'Maintenance'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white/10 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRID SECTION */}
      <div className="max-w-7xl mx-auto">
        {!selectedHostelId ? (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[4rem] bg-slate-950/20 group">
            <div className="p-8 bg-slate-900/50 rounded-full mb-8 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle className="text-slate-700 group-hover:text-indigo-500 transition-colors" size={60} />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[12px] text-center px-6">System Idle: Select an Infrastructure to proceed</p>
          </div>
        ) : isRoomsLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 className="animate-spin text-indigo-500 mb-6" size={50} />
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Synchronizing Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-1000">
            {filteredRooms?.map((room: any) => (
              <div key={room.id} className="bg-[#0F172A]/60 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-7 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <BedDouble size={80} className="-rotate-12" />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`p-4 rounded-2xl shadow-2xl ${
                    room.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5' : 
                    room.status === 'Full' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/5' : 'bg-amber-500/10 text-amber-500 shadow-amber-500/5'
                  }`}>
                    <BedDouble size={22} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenPanel(room)} className="p-3 bg-white/5 hover:bg-indigo-500/20 rounded-xl transition-all text-slate-500 hover:text-indigo-400"><Edit size={16}/></button>
                    <button onClick={() => deleteRoom({ hostelId: selectedHostelId, roomId: room.id })} className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-xl transition-all text-slate-500 hover:text-rose-500"><Trash2 size={16}/></button>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-indigo-400 transition-colors">{room.label}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="text-[9px] font-black uppercase px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 border border-white/5">{room.type}</span>
                    <span className="text-[9px] font-black uppercase px-3 py-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/10 tracking-widest">{room.block || 'No Block'}</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Rent Config</span>
                        <span className="text-white">KES {room.price} <span className="text-[9px] text-slate-600 font-medium">/{room.billingCycle === 'Per Semester' ? 'Sem' : 'Mo'}</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Load State</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${room.status === 'Full' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${(room.occupiedSlots / room.totalSlots) * 100}%` }}
                            />
                          </div>
                          <span className={room.status === 'Available' ? 'text-emerald-500' : 'text-rose-500'}>{room.occupiedSlots}/{room.totalSlots}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 relative z-10 pt-4 border-t border-white/5">
                    <StatusBtn active={room.status === 'Available'} icon={<CheckCircle2 size={14}/>} label="Avail" onClick={() => handleStatusChange(room.id, 'Available')} color="emerald" />
                    <StatusBtn active={room.status === 'Full'} icon={<Users2 size={14}/>} label="Full" onClick={() => handleStatusChange(room.id, 'Full')} color="rose" />
                    <StatusBtn active={room.status === 'Maintenance'} icon={<Wrench size={14}/>} label="Fix" onClick={() => handleStatusChange(room.id, 'Maintenance')} color="amber" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED ENTRY PANEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsPanelOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#030712] border-l border-white/5 h-full shadow-[ -20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-10 border-b border-white/5 bg-indigo-600/5 relative overflow-hidden">
               <BedDouble size={200} className="absolute -right-20 -bottom-20 text-indigo-500/[0.03] -rotate-12 pointer-events-none" />
               <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400"><Zap size={14} /></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Registry.Entry</span>
                  </div>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {editingId ? 'Modify Unit' : 'Configure Unit'}
                  </h2>
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="p-4 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-[1.5rem] transition-all group">
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 flex-1 overflow-y-auto space-y-10 no-scrollbar pb-20">
              <div className="space-y-6">
                <SectionTitle icon={<FileText size={16}/>} title="Identity & Placement" color="indigo" />
                <div className="grid grid-cols-2 gap-5">
                  <FormInput label="Room Label/No." value={formData.label} onChange={(v: any) => setFormData({...formData, label: v})} placeholder="e.g. RM-402" />
                  <FormInput label="Floor Level" value={formData.floor} onChange={(v: any) => setFormData({...formData, floor: v})} placeholder="e.g. 4th Floor" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <FormInput label="Block/Wing" value={formData.block} onChange={(v: any) => setFormData({...formData, block: v})} placeholder="e.g. Block C" />
                  <FormSelect 
                      label="Classification" 
                      value={formData.type} 
                      onChange={v => setFormData({...formData, type: v as any})} 
                      options={['Single', 'Bedsitter', 'One Bedroom', 'Two Bedroom']} 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <SectionTitle icon={<MapPin size={16}/>} title="Pricing & Capacity" color="emerald" />
                <div className="grid grid-cols-2 gap-5">
                  <FormInput label="Price (KES)" value={formData.price} onChange={(v:any) => setFormData({...formData, price: v})} placeholder="0.00" />
                  <FormSelect 
                      label="Cycle" 
                      value={formData.billingCycle} 
                      onChange={v => setFormData({...formData, billingCycle: v as any})} 
                      options={['Per Month', 'Per Semester']} 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Max Capacity (Beds)</label>
                  <input 
                      type="number" 
                      value={formData.totalSlots} 
                      onChange={(e) => setFormData({...formData, totalSlots: parseInt(e.target.value) || 1})} 
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 px-6 text-sm focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            </form>

            <div className="p-10 border-t border-white/5 bg-[#030712]/80 backdrop-blur-md flex gap-5">
              <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard</button>
              <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="flex-[2.5] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-4">
                {isCreating || isUpdating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {editingId ? 'Update Matrix' : 'Commit to Registry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SectionTitle = ({ icon, title, color }: any) => (
    <div className={`flex items-center gap-3 border-l-4 border-${color}-500 pl-4 py-1`}>
        <span className="text-slate-500">{icon}</span>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/90">{title}</h3>
    </div>
);

const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-[#0F172A]/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 hover:bg-indigo-500/[0.02] transition-all group">
      <div className={`text-${color}-500 mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

const StatusBtn = ({ active, icon, label, onClick, color }: any) => {
    const theme: any = {
        emerald: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 border-emerald-500' : 'bg-emerald-500/5 text-emerald-500/60 hover:text-emerald-500 hover:bg-emerald-500/10 border-white/5',
        rose: active ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 border-rose-500' : 'bg-rose-500/5 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 border-white/5',
        amber: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 border-amber-500' : 'bg-amber-500/5 text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10 border-white/5',
    };
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center py-3.5 rounded-2xl transition-all border ${theme[color]}`}>
            {icon}
            <span className="text-[8px] font-black uppercase mt-1.5 tracking-tighter">{label}</span>
        </button>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">{label}</label>
        <input type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 px-6 text-sm focus:border-indigo-500/50 outline-none transition-all shadow-inner placeholder:text-slate-800" />
    </div>
);

const FormSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 px-6 text-sm focus:border-indigo-500/50 outline-none cursor-pointer appearance-none">
            {options.map((opt: string) => <option key={opt} value={opt} className="bg-slate-950">{opt}</option>)}
        </select>
    </div>
);

export default OwnerRoomManager;