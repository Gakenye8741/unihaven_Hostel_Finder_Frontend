import React, { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { 
  useGetAllHostelsQuery, 
  useCreateHostelMutation, 
  useUpdateHostelMutation, 
  useDeleteHostelMutation 
} from '../../features/Apis/Hostel.Api';
import { 
  Plus, Edit, Trash2, Search, X, Loader2, 
  ShieldAlert, Building2, MapPin, 
  ShieldCheck, Info, ChevronLeft, ChevronRight, 
  Users, Terminal, CheckCircle2,
  FileText, Zap, ShieldQuestion
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyHostels: React.FC = () => {
  // --- REDUX STATE ---
  // Accessing the user object from Redux which contains the ID from localStorage
  const { user } = useSelector((state: any) => state.auth); 
  const currentOwnerId = user?.id; // The ID of the logged-in owner
  const ownerName = user?.username ? user.username.split(' ')[0] : 'Owner';

  // --- API HOOKS ---
  const { data: allHostels, isLoading } = useGetAllHostelsQuery({});
  const [createHostel, { isLoading: isCreating }] = useCreateHostelMutation();
  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  const [deleteHostel] = useDeleteHostelMutation();

  // --- UI STATE ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- FILTER & PAGINATION STATE ---
  const [policyFilter, setPolicyFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    campus: '',
    address: '',
    description: '',
    policy: 'Mixed' as 'Mixed' | 'Male Only' | 'Female Only'
  });

  // --- FILTERING LOGIC (OWNER SPECIFIC) ---
  const filteredHostels = allHostels?.filter((h: any) => {
    // 1. STYRICT OWNER CHECK: Only show hostels where ownerId matches logged-in user
    const isMine = h.ownerId === currentOwnerId;
    
    // 2. Search & UI Filters
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.campus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPolicy = policyFilter === 'All' || h.policy === policyFilter;
    
    return isMine && matchesSearch && matchesPolicy;
  });

  // Pagination Logic
  const totalPages = Math.ceil((filteredHostels?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHostels = filteredHostels?.slice(startIndex, startIndex + itemsPerPage);

  // --- HANDLERS ---
  const handleOpenPanel = (hostel: any = null) => {
    if (hostel) {
      setEditingId(hostel.id);
      setFormData({
        name: hostel.name, campus: hostel.campus,
        address: hostel.address, description: hostel.description || '',
        policy: hostel.policy
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', campus: '', address: '', description: '', policy: 'Mixed' });
    }
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHostel({ id: editingId, ...formData }).unwrap();
        toast.success("Hostel record synchronized");
      } else {
        // Automatically attach the currentOwnerId to the new hostel
        await createHostel({ ...formData, ownerId: currentOwnerId }).unwrap();
        toast.success("New property registered to your account");
      }
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Protocol failure");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Confirm deletion? This record will be purged from the Vault.")) {
      try {
        await deleteHostel(id).unwrap();
        toast.success("Property removed");
      } catch (err) {
        toast.error("Purge failed");
      }
    }
  };

  if (isLoading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Filtering Personal Inventory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-6 selection:bg-indigo-500/30">
      
      {/* GREETING & HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/50 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Owner ID: {currentOwnerId?.slice(0,8)}... / {ownerName}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              My<span className="text-indigo-500 font-light not-italic">Inventory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-4 max-w-2xl leading-relaxed">
              Managing <span className="text-white font-bold">{filteredHostels?.length || 0} properties</span> registered under your unique identifier.
            </p>
          </div>
          <button 
            onClick={() => handleOpenPanel()}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
          >
            <Plus size={18} strokeWidth={3} /> Register New Property
          </button>
        </div>

        {/* SYSTEM OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-slate-800/60 transition-all">
            <Terminal size={18} className="text-indigo-500 mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Ownership Validation</h3>
            <p className="text-[10px] text-slate-500 leading-normal">System is currently displaying hostels strictly mapped to your account ID.</p>
          </div>
          <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-slate-800/60 transition-all">
            <ShieldCheck size={18} className="text-emerald-500 mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Verification Status</h3>
            <p className="text-[10px] text-slate-500 leading-normal">Hostels awaiting manual admin audit will show as 'Pending'.</p>
          </div>
        </div>

        {/* FILTERS BAR */}
        <div className="mt-8 flex flex-wrap items-center gap-3 bg-slate-900/20 p-2 rounded-xl border border-slate-800/40">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input 
              type="text" 
              placeholder="Search your properties..." 
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-[11px] focus:border-indigo-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5">
            <Users size={12} className="text-indigo-500" />
            <select value={policyFilter} onChange={(e) => setPolicyFilter(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-slate-400 outline-none">
              <option value="All">All Policies</option>
              <option value="Mixed">Mixed</option>
              <option value="Male Only">Male Only</option>
              <option value="Female Only">Female Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto bg-[#0F172A] border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Property Identity</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Audit Status</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paginatedHostels?.length === 0 ? (
                <tr>
                   <td colSpan={3} className="px-8 py-20 text-center">
                      <Building2 className="mx-auto text-slate-800 mb-4" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No properties found under your ID.</p>
                   </td>
                </tr>
              ) : paginatedHostels?.map((hostel: any) => (
                <tr key={hostel.id} className="hover:bg-indigo-500/[0.03] transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-center">
                        <Building2 className="text-indigo-400" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{hostel.name}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-indigo-500" /> {hostel.campus}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <div className={`mx-auto flex w-fit items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase ${
                        hostel.isVerified ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-800/40 border-slate-700 text-slate-500"
                      }`}>
                      {hostel.isVerified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      {hostel.isVerified ? 'Verified' : 'Pending Audit'}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenPanel(hostel)} className="p-2.5 bg-slate-800/50 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(hostel.id)} className="p-2.5 bg-slate-800/50 hover:bg-rose-600 text-white rounded-xl transition-all shadow-md">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-slate-900/50 px-8 py-5 flex justify-between items-center border-t border-slate-800">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Page <span className="text-white">{currentPage}</span> of {totalPages || 1}
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-indigo-600">
              <ChevronLeft size={16} />
            </button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-indigo-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* DATA ENTRY PANEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsPanelOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0F172A] border-l border-white/5 h-full flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                {editingId ? 'Modify Unit' : 'Register Property'}
              </h2>
              <button onClick={() => setIsPanelOpen(false)} className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-2xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Campus</label>
                  <input required value={formData.campus} onChange={(e) => setFormData({...formData, campus: e.target.value})} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Address</label>
                  <input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Policy</label>
                  <select value={formData.policy} onChange={(e) => setFormData({...formData, policy: e.target.value as any})} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs outline-none">
                    <option value="Mixed">Mixed Housing</option>
                    <option value="Male Only">Male Only</option>
                    <option value="Female Only">Female Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Description</label>
                  <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 px-5 text-xs focus:border-indigo-500 outline-none resize-none" />
                </div>
              </div>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3">
                 <ShieldQuestion size={18} className="text-indigo-400" />
                 <p className="text-[9px] text-indigo-300/60">Property records will be locked to Owner ID: {currentOwnerId?.slice(0,12)}...</p>
              </div>
            </form>

            <div className="p-8 border-t border-white/5 bg-slate-950/40 flex gap-4">
              <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20">
                {isCreating || isUpdating ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {editingId ? 'Push Update' : 'Finalize Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHostels;