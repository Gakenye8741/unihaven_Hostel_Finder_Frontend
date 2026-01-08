import React, { useState } from 'react';
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
  Plus, Edit, Trash2, X, Loader2, 
  DoorOpen, Building2, Users2, CheckCircle2, 
  ChevronLeft, ChevronRight, BedDouble, 
  Wrench, AlertCircle, PieChart, Zap, FileText, MapPin
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

const RoomManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const adminName = user?.username?.split(' ')[0] || 'Admin';

  // --- UI STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- API HOOKS ---
  const { data: hostels } = useGetAllHostelsQuery({});
  const { data: rooms, isLoading: isRoomsLoading } = useListRoomsByHostelQuery(selectedHostelId, { skip: !selectedHostelId });
  const { data: stats } = useGetHostelStatsQuery(selectedHostelId, { skip: !selectedHostelId });
  
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [updateStatus] = useUpdateRoomStatusMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  // --- FORM STATE (Strictly Typed) ---
  const [formData, setFormData] = useState<RoomFormData>({
    label: '',
    floor: '',
    block: '',
    type: 'Bedsitter',
    price: '',
    billingCycle: 'Per Semester',
    totalSlots: 1
  });

  // --- HANDLERS ---
  const handleOpenPanel = (room: any | null = null) => {
    if (!selectedHostelId) return toast.error("Select a hostel infrastructure first");
    if (room) {
      setEditingId(room.id);
      setFormData({
        label: room.label,
        floor: room.floor || '',
        block: room.block || '',
        type: room.type,
        price: room.price,
        billingCycle: room.billingCycle,
        totalSlots: room.totalSlots
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

  const filteredRooms = rooms?.filter((r: any) => 
    r.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-6">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Unit Control / {adminName}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Room<span className="text-indigo-500 font-light not-italic">Matrix</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
              <select 
                value={selectedHostelId} 
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-[11px] font-bold uppercase tracking-widest text-white appearance-none outline-none focus:border-indigo-500 transition-all min-w-[280px]"
              >
                <option value="">Select Hostel Infrastructure</option>
                {hostels?.map((h: any) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleOpenPanel()}
              disabled={!selectedHostelId}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-indigo-500/20"
            >
              <Plus size={18} strokeWidth={3} /> Add New Unit
            </button>
          </div>
        </div>

        {/* DASHBOARD STATS */}
        {selectedHostelId && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <StatCard icon={<DoorOpen size={20}/>} label="Total Capacity" value={stats.totalRooms} color="indigo" />
            <StatCard icon={<Users2 size={20}/>} label="Currently Occupied" value={stats.occupied} color="rose" />
            <StatCard icon={<CheckCircle2 size={20}/>} label="Ready for Lease" value={stats.available} color="emerald" />
            <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-white/5">
                <PieChart size={18} className="text-pink-500 mb-2" />
                <p className="text-[9px] font-black text-slate-500 uppercase">Load Factor</p>
                <p className="text-2xl font-black text-white italic">{stats.totalRooms > 0 ? Math.round((stats.occupied / stats.totalRooms) * 100) : 0}%</p>
            </div>
          </div>
        )}
      </div>

      {/* GRID SECTION */}
      <div className="max-w-7xl mx-auto">
        {!selectedHostelId ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-950/20">
            <div className="p-6 bg-slate-900/50 rounded-full mb-6">
                <AlertCircle className="text-slate-700" size={48} />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Infrastructure Selection</p>
          </div>
        ) : isRoomsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Syncing Matrix Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-700">
            {filteredRooms?.map((room: any) => (
              <div key={room.id} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${
                    room.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 
                    room.status === 'Full' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <BedDouble size={20} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenPanel(room)} className="p-2 hover:bg-indigo-500/10 rounded-lg transition-all text-slate-500 hover:text-indigo-400"><Edit size={14}/></button>
                    <button onClick={() => deleteRoom({ hostelId: selectedHostelId, roomId: room.id })} className="p-2 hover:bg-rose-500/10 rounded-lg transition-all text-slate-500 hover:text-rose-500"><Trash2 size={14}/></button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">{room.label}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/5 rounded-md text-slate-400 border border-white/5">{room.type}</span>
                    <span className="text-[8px] font-black uppercase px-2 py-1 bg-indigo-500/10 rounded-md text-indigo-400 border border-indigo-500/10">{room.block || 'No Block'}</span>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                        <span className="text-slate-500">Rent</span>
                        <span className="text-white">KES {room.price} <span className="text-[8px] text-slate-600 font-medium">/{room.billingCycle === 'Per Semester' ? 'Sem' : 'Mo'}</span></span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                        <span className="text-slate-500">Status</span>
                        <span className={room.status === 'Available' ? 'text-emerald-500' : 'text-rose-500'}>{room.occupiedSlots} / {room.totalSlots} Slots</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                    <StatusBtn active={room.status === 'Available'} icon={<CheckCircle2 size={12}/>} label="Avail" onClick={() => handleStatusChange(room.id, 'Available')} color="emerald" />
                    <StatusBtn active={room.status === 'Full'} icon={<Users2 size={12}/>} label="Full" onClick={() => handleStatusChange(room.id, 'Full')} color="rose" />
                    <StatusBtn active={room.status === 'Maintenance'} icon={<Wrench size={12}/>} label="Fix" onClick={() => handleStatusChange(room.id, 'Maintenance')} color="amber" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED ENTRY PANEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsPanelOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0F172A] border-l border-white/5 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b border-white/5 bg-slate-950/40 relative overflow-hidden">
               <BedDouble size={120} className="absolute -right-8 -bottom-8 text-white/[0.02] -rotate-12 pointer-events-none" />
               <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 bg-indigo-500/20 rounded text-indigo-400"><Zap size={12} /></span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500">Unit Registry</span>
                  </div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {editingId ? 'Modify Unit' : 'Configure Unit'}
                  </h2>
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-8 no-scrollbar">
              <SectionTitle icon={<FileText size={14}/>} title="Identity & Placement" color="indigo" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Room Label/No." value={formData.label} onChange={(v: any) => setFormData({...formData, label: v})} placeholder="e.g. RM-402" />
                <FormInput label="Floor Level" value={formData.floor} onChange={(v: any) => setFormData({...formData, floor: v})} placeholder="e.g. 4th Floor" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Block/Wing" value={formData.block} onChange={(v: any) => setFormData({...formData, block: v})} placeholder="e.g. Block C" />
                <FormSelect 
                    label="Unit Classification" 
                    value={formData.type} 
                    onChange={v => setFormData({...formData, type: v as any})} 
                    options={['Single', 'Bedsitter', 'One Bedroom', 'Two Bedroom']} 
                />
              </div>

              <SectionTitle icon={<MapPin size={14}/>} title="Pricing & Capacity" color="emerald" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Price (KES)" value={formData.price} onChange={(v:any) => setFormData({...formData, price: v})} placeholder="0.00" />
                <FormSelect 
                    label="Billing Cycle" 
                    value={formData.billingCycle} 
                    onChange={v => setFormData({...formData, billingCycle: v as any})} 
                    options={['Per Month', 'Per Semester']} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Total Available Slots (Beds)</label>
                <input 
                    type="number" 
                    value={formData.totalSlots} 
                    onChange={(e) => setFormData({...formData, totalSlots: parseInt(e.target.value) || 1})} 
                    className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </form>

            <div className="p-8 border-t border-white/5 bg-slate-950/40 flex gap-4">
              <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard</button>
              <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3">
                {isCreating || isUpdating ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
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
    <div className={`flex items-center gap-2 border-l-2 border-${color}-500 pl-3`}>
        <span className="text-slate-500">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">{title}</h3>
    </div>
);

const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-white/5 hover:bg-[#0F172A]/60 transition-all group">
      <div className={`text-${color}-500 mb-2 group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-[9px] font-black text-slate-500 uppercase">{label}</p>
      <p className="text-2xl font-black text-white italic">{value}</p>
    </div>
);

const StatusBtn = ({ active, icon, label, onClick, color }: any) => {
    const theme: any = {
        emerald: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/10',
        rose: active ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 border-rose-500/10',
        amber: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 border-amber-500/10',
    };
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all border ${theme[color]}`}>
            {icon}
            <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">{label}</span>
        </button>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</label>
        <input type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700" />
    </div>
);

const FormSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none cursor-pointer">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default RoomManager;